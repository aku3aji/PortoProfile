import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Download, Github, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { content } from '@/data/content';
import { useLang } from '@/context/lang-context';
import { useReveal } from '@/hooks/useReveal';
import { useMagnetic } from '@/hooks/useMagnetic';
import { Magnetic } from './ui/Magnetic';
import { SectionHeading } from './ui/SectionHeading';

const SOCIALS = [
  { key: 'github', href: content.socials.github, label: 'GitHub', Icon: Github },
  { key: 'linkedin', href: content.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { key: 'instagram', href: content.socials.instagram, label: 'Instagram', Icon: Instagram },
];

function CopyEmailButton() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const ref = useMagnetic<HTMLButtonElement>(0.3);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content.email);
    } catch {
      // Clipboard API bisa ditolak browser — jangan sampai menjatuhkan UI.
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="link"
      onClick={copy}
      aria-label={t(content.ui.contact.copy)}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-panel/60 px-4 font-mono text-[0.72rem] text-dim transition-colors duration-300 hover:border-teal/50 hover:text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-term"
          >
            <Check size={13} strokeWidth={2.25} />
            {t(content.ui.contact.copied)}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Copy size={13} strokeWidth={1.75} />
            {t(content.ui.contact.copy)}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function CvButton() {
  const { t } = useLang();
  const ref = useMagnetic<HTMLAnchorElement>(0.3);

  // Selama `cvUrl` masih kosong, tombolnya tampil jujur sebagai "menyusul".
  if (!content.cvUrl) {
    return (
      <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-line px-5 font-mono text-[0.75rem] text-dim">
        <Download size={14} strokeWidth={1.75} />
        {t(content.ui.contact.cvPending)}
      </span>
    );
  }

  return (
    <a
      ref={ref}
      href={content.cvUrl}
      download
      data-cursor="link"
      className="group inline-flex h-11 items-center gap-2 rounded-full border border-line bg-panel/60 px-5 text-[0.82rem] text-ink transition-colors duration-300 hover:border-violet/50 hover:bg-violet/5"
    >
      <Download
        size={14}
        strokeWidth={1.75}
        className="transition-transform duration-400 ease-signature group-hover:translate-y-0.5"
      />
      {t(content.ui.contact.downloadCv)}
    </a>
  );
}

export function Contact() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const mailRef = useMagnetic<HTMLAnchorElement>(0.14);

  useReveal(sectionRef, { selector: '.js-reveal', y: 34, stagger: 0.08, start: 'top 82%' });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-t border-line/60 py-24 sm:py-32"
      aria-labelledby="contact-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 grid-lines opacity-[0.35]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgba(124,92,255,0.16),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="shell">
        <SectionHeading
          id="contact-title"
          index={content.ui.contact.index}
          label={content.ui.contact.label}
          title={content.ui.contact.title}
          subtitle={content.ui.contact.subtitle}
        />

        {/* Email besar sebagai CTA utama */}
        <div className="js-reveal mt-14 border-y border-line/70 py-8 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <a
              ref={mailRef}
              href={`mailto:${content.email}`}
              data-cursor="link"
              className="group inline-flex max-w-full items-center gap-3"
            >
              <Mail size={20} strokeWidth={1.5} className="hidden shrink-0 text-teal sm:block" />
              <span className="relative min-w-0">
                <span className="block truncate font-display text-[clamp(1.35rem,5.2vw,3.25rem)] leading-none tracking-tight text-ink transition-colors duration-400 group-hover:text-teal">
                  {content.email}
                </span>
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-teal transition-transform duration-600 ease-signature group-hover:scale-x-100" />
              </span>
              <ArrowUpRight
                size={22}
                strokeWidth={1.5}
                className="hidden shrink-0 text-dim transition-all duration-400 ease-signature group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teal sm:block"
              />
            </a>

            <CopyEmailButton />
          </div>
        </div>

        <div className="js-reveal mt-8 flex flex-wrap items-center gap-3">
          <Magnetic strength={0.3}>
            <a
              href={`mailto:${content.email}`}
              data-cursor="link"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.82rem] font-medium text-base transition-shadow duration-400 ease-signature hover:shadow-[0_0_34px_-8px_rgba(124,92,255,0.9)]"
            >
              {t(content.ui.contact.sendEmail)}
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="transition-transform duration-400 ease-signature group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Magnetic>

          <CvButton />
        </div>

        <div className="js-reveal mt-14 grid gap-8 border-t border-line/60 pt-10 sm:grid-cols-2">
          <div>
            <p className="mono-label">{t(content.ui.contact.locationLabel)}</p>
            <p className="mt-3 flex items-center gap-2 text-ink">
              <MapPin size={15} strokeWidth={1.6} className="text-teal" />
              {t(content.location)}
            </p>
          </div>

          <div className="sm:justify-self-end">
            <p className="mono-label sm:text-right">{t(content.ui.contact.socialsLabel)}</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {SOCIALS.map(({ key, href, label, Icon }) => (
                <li key={key}>
                  <Magnetic strength={0.35}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="link"
                      aria-label={label}
                      className="group flex h-11 items-center gap-2 rounded-full border border-line bg-panel/60 px-4 text-[0.78rem] text-dim transition-colors duration-300 hover:border-violet/50 hover:bg-violet/5 hover:text-ink"
                    >
                      <Icon size={15} strokeWidth={1.6} className="transition-colors duration-300 group-hover:text-violet" />
                      {label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
