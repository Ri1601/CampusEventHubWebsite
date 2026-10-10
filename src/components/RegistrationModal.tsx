import { useEffect, useRef, useState } from "react";
import type { FestEvent } from "../data/events";
import { Icon } from "./Icon";

type FormData = { name: string; email: string; phone: string };
type Errors = Partial<FormData> & { form?: string };

export function RegistrationModal({
  event,
  seatsLeft,
  onClose,
  onSubmit,
}: {
  event: FestEvent;
  seatsLeft: number;
  onClose: () => void;
  onSubmit: (details: FormData) => { error?: string };
}) {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});
  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => nameInput.current?.focus(), []);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const handleSubmit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    const nextErrors: Errors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      nextErrors.phone = "Enter a valid phone number with 10–15 digits.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const result = onSubmit(form);
    if (result.error) setErrors({ form: result.error });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="registration-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        onMouseDown={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close registration" onClick={onClose}>
          <Icon name="close" />
        </button>
        <div className="modal-event-summary">
          <p className="section-kicker">EVENT REGISTRATION</p>
          <h2 id="registration-title">{event.name}</h2>
          <div>
            <span><Icon name="calendar" /> {event.date} · {event.time}</span>
            <span><Icon name="pin" /> {event.venue}</span>
          </div>
          <p className="seats-callout"><strong>{seatsLeft}</strong> seats currently available</p>
        </div>
        <form className="registration-form" onSubmit={handleSubmit} noValidate>
          <p>Save your spot</p>
          <div className="form-field">
            <label htmlFor="full-name">Full name</label>
            <input
              ref={nameInput}
              id="full-name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              onChange={(inputEvent) => updateField("name", inputEvent.target.value)}
            />
            {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="registration-email">Email address</label>
            <input
              id="registration-email"
              type="email"
              autoComplete="email"
              placeholder="student@college.edu"
              value={form.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              onChange={(inputEvent) => updateField("email", inputEvent.target.value)}
            />
            {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              onChange={(inputEvent) => updateField("phone", inputEvent.target.value)}
            />
            {errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}
          </div>
          {errors.form && <div className="form-error" role="alert">{errors.form}</div>}
          <button className="button button-primary submit-button" type="submit">
            Confirm registration <Icon name="arrow" />
          </button>
          <small>By registering, you agree to receive event updates by email.</small>
        </form>
      </div>
    </div>
  );
}
