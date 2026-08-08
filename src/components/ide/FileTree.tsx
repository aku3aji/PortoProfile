import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, FolderOpen, Folder } from 'lucide-react';
import type { IdeFile } from '@/data/content';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { cn } from '@/lib/utils';

/** Ikon file bergaya VS Code: kotak kecil dengan warna per ekstensi. */
function FileIcon({ kind }: { kind: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ts: { label: 'TS', className: 'bg-[#3178C6]/15 text-[#6FA8E8]' },
    json: { label: '{}', className: 'bg-amber/15 text-amber' },
    md: { label: 'M↓', className: 'bg-ink/10 text-ink/70' },
  };
  const icon = map[kind] ?? map.ts!;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] font-mono text-[0.5rem] font-bold leading-none',
        icon.className,
      )}
    >
      {icon.label}
    </span>
  );
}

interface Props {
  files: IdeFile[];
  activeKey: string;
  onSelect: (key: string) => void;
}

function FileRow({
  file,
  active,
  nested,
  onSelect,
}: {
  file: IdeFile;
  active: boolean;
  nested?: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        data-cursor="link"
        onClick={() => onSelect(file.key)}
        aria-current={active ? 'true' : undefined}
        className={cn(
          'group relative flex w-full items-center gap-2 rounded-sm py-1.5 pr-2 text-left font-mono text-[0.72rem] transition-colors duration-200',
          nested ? 'pl-7' : 'pl-3',
          active ? 'bg-panel text-ink' : 'text-dim hover:bg-panel/60 hover:text-ink',
        )}
      >
        {active ? (
          <motion.span
            layoutId="ide-active-file"
            className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-violet to-teal"
            transition={{ type: 'spring', stiffness: 480, damping: 38 }}
          />
        ) : null}
        <FileIcon kind={file.icon} />
        <span className="truncate">{file.name}</span>
      </button>
    </li>
  );
}

export function FileTree({ files, activeKey, onSelect }: Props) {
  const { t } = useLang();
  const [open, setOpen] = useState(true);

  const rootFiles = files.filter((f) => !f.folder);
  const projectFiles = files.filter((f) => f.folder === 'projects');

  return (
    <nav
      aria-label={t(content.ui.ide.explorer)}
      className="flex h-full min-h-0 flex-col border-b border-line bg-surface/60 lg:border-b-0 lg:border-r"
    >
      <p className="px-3 py-2.5 font-mono text-[0.6rem] tracking-[0.18em] text-dim">
        {t(content.ui.ide.explorer)}
      </p>

      <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto pb-3">
        <ul className="space-y-px px-1.5">
          {rootFiles.slice(0, 2).map((file) => (
            <FileRow key={file.key} file={file} active={file.key === activeKey} onSelect={onSelect} />
          ))}

          <li>
            <button
              type="button"
              data-cursor="link"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex w-full items-center gap-1.5 rounded-sm py-1.5 pl-1.5 pr-2 text-left font-mono text-[0.72rem] text-dim transition-colors duration-200 hover:bg-panel/60 hover:text-ink"
            >
              <ChevronRight
                size={12}
                strokeWidth={2}
                className={cn('shrink-0 transition-transform duration-300 ease-signature', open && 'rotate-90')}
              />
              {open ? (
                <FolderOpen size={13} strokeWidth={1.75} className="shrink-0 text-teal/80" />
              ) : (
                <Folder size={13} strokeWidth={1.75} className="shrink-0 text-teal/80" />
              )}
              projects/
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.ul
                  key="projects"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-px overflow-hidden"
                >
                  {projectFiles.map((file) => (
                    <FileRow
                      key={file.key}
                      file={file}
                      nested
                      active={file.key === activeKey}
                      onSelect={onSelect}
                    />
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </li>

          {rootFiles.slice(2).map((file) => (
            <FileRow key={file.key} file={file} active={file.key === activeKey} onSelect={onSelect} />
          ))}
        </ul>
      </div>

      <p className="hidden border-t border-line/60 px-3 py-2.5 font-mono text-[0.58rem] leading-snug text-dim lg:block">
        {'// '}
        {t(content.ui.ide.hint)}
      </p>
    </nav>
  );
}
