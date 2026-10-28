/**
 * Copyright (c) 2026 Zeno Productions. All rights reserved.
 */
import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CircleAlert } from 'lucide-react';
import { Link } from 'wouter';

export default function Login() {
  const [notice, setNotice] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(true);
  };

  return (
    <main className="intake-page login-page" data-testid="page-login">
      <div className="page-grain" aria-hidden="true" />
      <header className="topbar login-topbar">
        <Link className="brand" href="/" aria-label="Fieldnote Clinic intake home" data-testid="link-login-brand">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">FIELDNOTE <span>CLINIC</span></span>
        </Link>
        <Link className="login-back-top" href="/" data-testid="link-login-intake-top"><ArrowLeft size={14} /> Back to intake</Link>
      </header>

      <section className="login-layout">
        <aside className="login-aside">
          <div className="intro-kicker"><span>02</span> FIELDNOTE FOR CARE TEAMS</div>
          <div className="login-aside-copy">
            <p className="eyebrow">A LITTLE MORE PREPARED</p>
            <h1>Care begins<br />with <em>listening.</em></h1>
            <p>Make room for a better first conversation. Fieldnote helps your team gather the essentials before a visit.</p>
          </div>
          <div className="login-aside-note">
            <span className="note-mark" aria-hidden="true">F.</span>
            <div><strong>Thoughtful by design</strong><span>A calm place to begin the visit.</span></div>
          </div>
          <div className="login-orbit login-orbit-a" aria-hidden="true" />
          <div className="login-orbit login-orbit-b" aria-hidden="true" />
        </aside>

        <section className="login-panel" aria-labelledby="login-title">
          <p className="step-label">CARE TEAM <span>—</span> DEMO ACCESS</p>
          <div className="login-heading">
            <span className="login-index">01 <i>/ 01</i></span>
            <h2 id="login-title">Welcome back.</h2>
            <p>Sign in to continue to your workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" autoComplete="off" placeholder="you@clinic.org" data-testid="input-login-email" />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" autoComplete="new-password" placeholder="Enter a password" data-testid="input-login-password" />
            </div>
            <button className="submit-button login-submit" type="submit" data-testid="button-login-submit">
              Sign in <ArrowRight size={16} />
            </button>
            {notice && (
              <div className="login-notice" role="status" aria-live="polite" data-testid="status-login-prototype">
                <CircleAlert size={17} />
                <p><strong>Sign-in is not connected.</strong> No credentials were sent or saved.</p>
              </div>
            )}
          </form>

          <div className="login-demo-note" data-testid="text-login-demo-note">
            <CircleAlert size={15} />
            <p><strong>Visual prototype only.</strong> This screen does not sign you in. Please don’t enter real credentials.</p>
          </div>
          <div className="login-return">
            <span>Here to share visit details?</span>
            <Link href="/" data-testid="link-login-intake"><ArrowLeft size={14} /> Return to patient intake</Link>
          </div>
        </section>
      </section>

      <footer className="page-footer login-footer">
        <span>FIELDNOTE CLINIC <span className="footer-separator">/</span> CARE TEAM</span>
        <span>DESIGNED FOR A BETTER FIRST VISIT</span>
      </footer>
    </main>
  );
}
