/**
 * Syntax highlighter mini — cukup untuk TypeScript, JSON, dan Markdown yang
 * tampil di section "IDE Mode". Sengaja ditulis sendiri (bukan Prism/Shiki)
 * supaya bundle tetap kecil dan hasilnya bisa dipotong per-karakter untuk
 * efek typewriter.
 */

export type TokenType =
  | 'plain'
  | 'keyword'
  | 'literal'
  | 'type'
  | 'string'
  | 'number'
  | 'comment'
  | 'property'
  | 'function'
  | 'punctuation'
  | 'heading'
  | 'strong'
  | 'quote';

export interface Token {
  type: TokenType;
  value: string;
}

export type CodeLanguage = 'ts' | 'json' | 'md';

interface Rule {
  type: TokenType;
  re: RegExp;
}

const sticky = (source: string) => new RegExp(source, 'y');

const KEYWORDS =
  'const|let|var|function|return|export|default|import|from|new|class|interface|enum|extends|implements|if|else|for|while|switch|case|break|continue|async|await|try|catch|finally|throw|typeof|instanceof|delete|in|of|as|satisfies|public|private|readonly';

const TS_RULES: Rule[] = [
  { type: 'comment', re: sticky('//[^\\n]*') },
  { type: 'string', re: sticky('`(?:\\\\.|\\$\\{[^}]*\\}|[^`\\\\])*`') },
  { type: 'string', re: sticky("'(?:\\\\.|[^'\\\\])*'") },
  { type: 'string', re: sticky('"(?:\\\\.|[^"\\\\])*"') },
  { type: 'literal', re: sticky('\\b(?:true|false|null|undefined|this)\\b') },
  { type: 'type', re: sticky('\\b(?:string|number|boolean|void|any|unknown|never|type)\\b') },
  { type: 'keyword', re: sticky(`\\b(?:${KEYWORDS})\\b`) },
  { type: 'number', re: sticky('\\b\\d[\\d_]*(?:\\.\\d+)?\\b') },
  { type: 'function', re: sticky('[A-Za-z_$][\\w$]*(?=\\s*\\()') },
  { type: 'property', re: sticky('[A-Za-z_$][\\w$]*(?=\\s*:)') },
  { type: 'punctuation', re: sticky('[{}[\\]().,;:+\\-*/%=<>!&|?]+') },
  { type: 'plain', re: sticky('[A-Za-z_$][\\w$]*') },
  { type: 'plain', re: sticky('\\s+') },
];

const JSON_RULES: Rule[] = [
  { type: 'property', re: sticky('"(?:\\\\.|[^"\\\\])*"(?=\\s*:)') },
  { type: 'string', re: sticky('"(?:\\\\.|[^"\\\\])*"') },
  { type: 'literal', re: sticky('\\b(?:true|false|null)\\b') },
  { type: 'number', re: sticky('-?\\b\\d+(?:\\.\\d+)?\\b') },
  { type: 'punctuation', re: sticky('[{}[\\],:]+') },
  { type: 'plain', re: sticky('\\s+') },
];

/** Tokenisasi satu baris memakai daftar aturan; sisa karakter jadi `plain`. */
function tokenizeLine(line: string, rules: Rule[]): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < line.length) {
    let matched = false;

    for (const rule of rules) {
      rule.re.lastIndex = pos;
      const m = rule.re.exec(line);
      if (m && m[0].length > 0) {
        push(tokens, rule.type, m[0]);
        pos += m[0].length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      push(tokens, 'plain', line[pos]!);
      pos += 1;
    }
  }

  return tokens;
}

function push(tokens: Token[], type: TokenType, value: string) {
  const last = tokens[tokens.length - 1];
  if (last && last.type === type) last.value += value;
  else tokens.push({ type, value });
}

/** Markdown ditangani per baris — lebih sederhana dan sudah cukup. */
function tokenizeMarkdownLine(line: string): Token[] {
  if (/^\s*#{1,6}\s/.test(line)) return [{ type: 'heading', value: line }];
  if (/^\s*>/.test(line)) return [{ type: 'quote', value: line }];

  const tokens: Token[] = [];
  const inline = /(\*\*[^*]+\*\*)|(`[^`]+`)|(^\s*[-*+]\s)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = inline.exec(line)) !== null) {
    if (m.index > last) push(tokens, 'plain', line.slice(last, m.index));
    if (m[1]) push(tokens, 'strong', m[1]);
    else if (m[2]) push(tokens, 'string', m[2]);
    else push(tokens, 'punctuation', m[0]);
    last = m.index + m[0].length;
  }

  if (last < line.length) push(tokens, 'plain', line.slice(last));
  return tokens;
}

/**
 * Ubah kode jadi array baris berisi token siap render.
 * Komentar blok (slash-star) ditangani lintas baris lewat state sederhana.
 */
export function tokenize(code: string, language: CodeLanguage): Token[][] {
  const lines = code.split('\n');

  if (language === 'md') return lines.map(tokenizeMarkdownLine);

  const rules = language === 'json' ? JSON_RULES : TS_RULES;
  let inBlockComment = false;

  return lines.map((line) => {
    if (language !== 'ts') return tokenizeLine(line, rules);

    const tokens: Token[] = [];
    let rest = line;

    while (rest.length > 0) {
      if (inBlockComment) {
        const end = rest.indexOf('*/');
        if (end === -1) {
          push(tokens, 'comment', rest);
          rest = '';
        } else {
          push(tokens, 'comment', rest.slice(0, end + 2));
          rest = rest.slice(end + 2);
          inBlockComment = false;
        }
        continue;
      }

      const start = rest.indexOf('/*');
      const lineComment = rest.indexOf('//');
      const openInString = start !== -1 && lineComment !== -1 && lineComment < start;

      if (start === -1 || openInString) {
        tokens.push(...tokenizeLine(rest, rules));
        rest = '';
      } else {
        if (start > 0) tokens.push(...tokenizeLine(rest.slice(0, start), rules));
        rest = rest.slice(start);
        inBlockComment = true;
      }
    }

    return tokens;
  });
}

/** Kelas Tailwind per jenis token — dipakai komponen Editor. */
export const TOKEN_CLASS: Record<TokenType, string> = {
  plain: 'text-ink/85',
  keyword: 'text-[#FF7B72]',
  literal: 'text-[#79C0FF]',
  type: 'text-[#FFA657]',
  string: 'text-teal',
  number: 'text-[#79C0FF]',
  comment: 'text-dim italic',
  property: 'text-violet',
  function: 'text-[#D2A8FF]',
  punctuation: 'text-dim',
  heading: 'text-ink font-semibold',
  strong: 'text-ink font-semibold',
  quote: 'text-teal/80 italic',
};
