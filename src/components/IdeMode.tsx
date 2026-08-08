import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, GitBranch } from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useReveal } from '@/hooks/useReveal';
import { SectionHeading } from './ui/SectionHeading';
import { FileTree } from './ide/FileTree';
import { CodeEditor } from './ide/CodeEditor';
import { Terminal } from './ide/Terminal';

const FILES = content.ide.files;

export function IdeMode() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(windowRef, 'top 78%');
  const [activeKey, setActiveKey] = useState(FILES[0]!.key);

  useReveal(sectionRef, { selector: '.js-reveal', y: 30, stagger: 0.07 });

  const activeFile = FILES.find((f) => f.key === activeKey) ?? FILES[0]!;
  const filePath = activeFile.folder ? `${activeFile.folder}/${activeFile.name}` : activeFile.name;

  return (
    <section id="ide" ref={sectionRef} className="relative scroll-mt-24 py-24 sm:py-32" aria-labelledby="ide-title">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(45,212,191,0.07),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="shell">
        <SectionHeading
          id="ide-title"
          index={content.ui.ide.index}
          label={content.ui.ide.label}
          title={content.ui.ide.title}
          subtitle={content.ui.ide.subtitle}
        />

        {/* Jendela editor */}
        <div
          ref={windowRef}
          className="js-reveal border-gradient mt-12 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
        >
          {/* Title bar */}
          <div className="flex items-center gap-3 border-b border-line bg-panel/70 px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>

            <p className="flex-1 truncate text-center font-mono text-[0.68rem] text-dim">
              <span className="text-dim">triaji-portfolio — </span>
              {filePath}
            </p>

            <span className="hidden font-mono text-[0.6rem] text-dim sm:inline">UTF-8</span>
          </div>

          {/* Tab bar */}
          <div className="flex items-stretch overflow-x-auto border-b border-line bg-surface/80">
            <div className="relative flex items-center gap-2 border-r border-line bg-surface px-4 py-2 font-mono text-[0.7rem] text-ink">
              <motion.span
                layoutId="ide-tab-underline"
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet to-teal"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
              {activeFile.name}
            </div>
            <div className="flex-1 border-b border-line/0" />
          </div>

          <div className="grid lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
            <FileTree files={FILES} activeKey={activeKey} onSelect={setActiveKey} />

            <div className="flex min-w-0 flex-col">
              <CodeEditor
                key={activeFile.key}
                code={t(activeFile.code)}
                language={activeFile.language}
                active={inView}
                instant={reduced}
              />
              <Terminal steps={content.ide.terminal} active={inView} instant={reduced} />
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between gap-4 border-t border-line bg-gradient-to-r from-violet/15 to-teal/10 px-4 py-1.5 font-mono text-[0.62rem] text-dim">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-ink/80">
                <GitBranch size={11} strokeWidth={1.75} />
                main
              </span>
              <span className="flex items-center gap-1.5 text-term">
                <Check size={11} strokeWidth={2.25} />
                {t(content.ui.ide.problems)}
              </span>
            </div>

            <div className="hidden items-center gap-4 sm:flex">
              <span>Ln {activeFile.code.id.split('\n').length}</span>
              <span className="uppercase">{activeFile.language}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
