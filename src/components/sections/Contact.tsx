import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Github, Mail, MessageCircle, Send } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, LetterSwap } from '@/components/motion';
import { site } from '@/content/site';
import { services } from '@/content/services';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [type, setType] = useState(services[0].title);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Web3Forms needs an access key; without one, fail loudly rather than
    // silently swallowing a real enquiry.
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus('error');
      return;
    }
    data.append('access_key', accessKey);
    data.append('subject', `New enquiry: ${type}`);

    setStatus('sending');
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12_000);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      const json = await res.json();
      if (json.success) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const socials = [
    { icon: Mail, label: 'Email', value: site.links.email, href: `mailto:${site.links.email}` },
    { icon: Github, label: 'GitHub', value: 'View my code', href: site.links.github },
    ...(site.links.whatsapp
      ? [
          {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: 'Message me',
            href: site.links.whatsapp,
          },
        ]
      : []),
  ];

  return (
    <Section id="contact">
      <div className="sr-only" role="status" aria-live="polite">
        {status === 'sending' && 'Sending your message.'}
        {status === 'sent' && 'Message sent successfully.'}
        {status === 'error' && 'Message could not be sent. Email Ayan directly instead.'}
      </div>
      <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            index="08"
            label="Contact"
            title={
              <>
                Let&apos;s build <span className="text-accent italic">the thing</span>
              </>
            }
            description="Tell me what you need, even roughly. You'll get a straight answer about whether I'm the right person, a fixed quote, and a date."
          />

          <Reveal delay={0.15}>
            <div className="mt-10 border-t border-rule">
              {socials.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  data-cursor="OPEN"
                  className="group flex items-center gap-4 border-b border-rule py-4 transition-colors hover:text-accent"
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
                  <span className="text-[15px]">
                    <LetterSwap text={value} />
                  </span>
                  <span className="ml-auto text-[12px] text-ink-3">{label}</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-6 flex items-center gap-2 text-[13px] text-ink-3">
              <span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
              {site.availability.label} · replies {site.responseTime}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[460px] flex-col items-center justify-center border-t border-rule text-center"
                >
                  {/* Motorcycle easter egg, the chain pulls taut. */}
                  <svg viewBox="0 0 160 24" className="w-44 text-accent">
                    <motion.g
                      initial={{ scaleX: 0.3, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ originX: 0.5 }}
                    >
                      {Array.from({ length: 6 }, (_, i) => (
                        <g key={i} transform={`translate(${i * 26} 0)`}>
                          <rect
                            x="2"
                            y="7"
                            width="18"
                            height="10"
                            rx="5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <circle cx="6" cy="12" r="1.6" fill="currentColor" />
                          <circle cx="16" cy="12" r="1.6" fill="currentColor" />
                        </g>
                      ))}
                    </motion.g>
                  </svg>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 240, damping: 16 }}
                    className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-accent"
                  >
                    <Check className="h-6 w-6 text-on-accent" />
                  </motion.div>

                  <h3 className="mt-6 text-[2rem]">Message sent</h3>
                  <p className="mt-3 max-w-xs text-[15px] text-ink-2">
                    You&apos;ll hear back {site.responseTime}. If it&apos;s urgent, email{' '}
                    {site.links.email} directly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="link-rule mt-8 text-[14px] text-accent"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-7 border-t border-rule pt-8"
                >
                  {/* Honeypot, bots fill it, humans never see it. */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />

                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field label="Your name" name="name" placeholder="Alex Carter" required />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="alex@company.com"
                      required
                    />
                  </div>

                  <div>
                    <span className="eyebrow">What do you need?</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setType(s.title)}
                          className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${
                            type === s.title
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-rule text-ink-2 hover:border-ink hover:text-ink'
                          }`}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="project_type" value={type} />
                  </div>

                  <Field
                    label="Budget range (optional)"
                    name="budget"
                    placeholder="e.g. $2,000 – $5,000"
                  />

                  <div>
                    <label htmlFor="message" className="eyebrow">
                      Tell me about it
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="What are you building, who is it for, and when do you need it?"
                      className="mt-3 w-full resize-none border-b border-rule bg-transparent pb-2 text-[15px] outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="border-l-2 border-accent pl-4 text-[13px] text-ink-2">
                      {import.meta.env.VITE_WEB3FORMS_KEY
                        ? `That didn't send. Please email ${site.links.email} instead.`
                        : `The form is not connected yet. Email ${site.links.email} in the meantime.`}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-medium text-paper transition-colors duration-400 hover:bg-accent hover:text-on-accent disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      'Sending…'
                    ) : (
                      <>
                        Send message <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Underlined field, an editorial form has rules, not boxes. */
function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={name === 'name' ? 100 : 254}
        placeholder={placeholder}
        className="mt-3 w-full border-b border-rule bg-transparent pb-2 text-[15px] outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
      />
    </div>
  );
}
