"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Code2,
  Facebook,
  Github,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Music2,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import {
  GlassIconButton,
  LiquidButton,
} from "@/components/shared/LiquidButton";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

interface ContactApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const EMPTY_FORM: ContactFormValues = { name: "", email: "", message: "" };

const FALLBACK_SUCCESS =
  "Message received and stored. Email delivery is not configured yet, so replies will not be automatic.";

const FALLBACK_ERROR =
  "Something went wrong while saving your message. Please try again.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  codeforces: Code2,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
};

function validate(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length === 0) {
    errors.name = "Please enter your name.";
  }
  if (values.email.trim().length === 0) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  return errors;
}

/**
 * 06 — CONTACT. Contact details + socials on the left, a validated form on
 * the right that stores messages via POST /api/contact (email delivery is
 * truthfully reported as not configured).
 */
export default function Contact() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setField = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setFormError(null);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });
      const data: ContactApiResponse = await response
        .json()
        .catch(() => ({}) as ContactApiResponse);

      if (response.ok && data.ok) {
        setSuccessMessage(data.message ?? FALLBACK_SUCCESS);
      } else if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
        setErrors(data.fieldErrors);
      } else {
        setFormError(data.error ?? FALLBACK_ERROR);
      }
    } catch {
      setFormError(FALLBACK_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(EMPTY_FORM);
    setErrors({});
    setFormError(null);
    setSuccessMessage(null);
  };

  const contactRows: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
  }> = [
    {
      icon: Mail,
      label: "Email",
      value: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.contact.phone,
      href: `tel:${profile.contact.phone}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile.contact.location,
    },
  ];

  return (
    <SectionShell
      id="contact"
      number="06"
      label="Contact"
      heading={profile.contact.heading}
      className="py-14 sm:py-20"
    >
      <div className="mt-10 grid gap-14 sm:mt-14 lg:grid-cols-2 lg:gap-16">
        {/* Left — direct lines + socials */}
        <Reveal>
          <div>
            <p className="label-mono text-muted-foreground">Direct</p>
            <ul className="mt-6 space-y-6">
              {contactRows.map((row) => (
                <li key={row.label} className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface/70">
                    <row.icon className="size-4 text-accent" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="label-mono text-muted-foreground">
                      {row.label}
                    </p>
                    {row.href ? (
                      <a
                        href={row.href}
                        className="mt-1 inline-block break-all text-sm font-medium transition-colors hover:text-accent sm:text-base"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium sm:text-base">
                        {row.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="my-9 h-px bg-hairline" aria-hidden />

            <p className="label-mono text-muted-foreground">Elsewhere</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {profile.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.id] ?? Music2;
                return (
                  <li key={social.id}>
                    <GlassIconButton
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                    >
                      <Icon className="size-4" aria-hidden />
                    </GlassIconButton>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* Right — form / success card */}
        <Reveal delay={0.08}>
          {successMessage !== null ? (
            <div
              role="status"
              aria-live="polite"
              className="glass rounded-2xl p-8 text-center sm:p-10"
            >
              <CheckCircle2
                className="mx-auto size-12 text-accent"
                aria-hidden
              />
              <h3 className="mt-5 font-display text-2xl sm:text-3xl">
                Message received.
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {successMessage}
              </p>
              <div className="mt-8 flex justify-center">
                <LiquidButton variant="secondary" onClick={resetForm}>
                  Send another
                </LiquidButton>
              </div>
            </div>
          ) : (
            <div>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-hairline bg-surface/50 p-6 sm:p-8"
              >
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    value={values.name}
                    onChange={(event) => setField("name", event.target.value)}
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    className="min-h-11"
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="text-xs text-destructive"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(event) => setField("email", event.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    className="min-h-11"
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="text-xs text-destructive"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    value={values.message}
                    onChange={(event) =>
                      setField("message", event.target.value)
                    }
                    placeholder="What would you like to build?"
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                    className="min-h-32"
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="text-xs text-destructive"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {formError && (
                  <p role="alert" className="mt-5 text-sm text-destructive">
                    {formError}
                  </p>
                )}

                <div className="mt-7">
                  <LiquidButton
                    type="submit"
                    disabled={submitting}
                    className={cn("w-full sm:w-auto")}
                    ariaLabel="Send contact message"
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" aria-hidden />
                        Send message
                      </>
                    )}
                  </LiquidButton>
                </div>
              </form>
              <p className="mt-5 font-mono text-[0.66rem] leading-relaxed tracking-wide text-muted-foreground">
                Messages are stored in the site database. Email delivery is not
                configured yet.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </SectionShell>
  );
}
