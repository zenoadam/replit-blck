import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreatePatientIntake } from '@workspace/api-client-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight, Check, CircleAlert, ClipboardList, LoaderCircle, RotateCcw } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Login from '@/pages/login';
import {
  Route,
  Switch,
  Link,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import './intake.css';

const queryClient = new QueryClient();

const intakeSchema = z.object({
  patientName: z.string().trim().min(1, 'Enter the patient’s full name.').max(120, 'Name must be 120 characters or fewer.'),
  dateOfBirth: z.string().min(1, 'Select a date of birth.').refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
  }, 'Enter a valid date that is not in the future.'),
  medicalSymptoms: z.string().trim().min(1, 'Describe the symptoms to continue.').max(4000, 'Keep the description under 4,000 characters.'),
});

type IntakeValues = z.infer<typeof intakeSchema>;

function Home() {
  const mutation = useCreatePatientIntake();
  const [savedIntake, setSavedIntake] = useState<Awaited<ReturnType<typeof mutation.mutateAsync>> | null>(null);
  const form = useForm<IntakeValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: { patientName: '', dateOfBirth: '', medicalSymptoms: '' },
    mode: 'onBlur',
  });

  const submitIntake = (values: IntakeValues) => {
    mutation.mutate(
      { data: values },
      { onSuccess: (intake) => setSavedIntake(intake) },
    );
  };

  const startAnother = () => {
    setSavedIntake(null);
    mutation.reset();
    form.reset();
  };

  return (
    <main className="intake-page" data-testid="page-patient-intake">
      <div className="page-grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Fieldnote Clinic intake home" data-testid="link-intake-home">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">FIELDNOTE <span>CLINIC</span></span>
        </a>
        <div className="prototype-tag" data-testid="text-prototype-label">
          <span className="prototype-dot" />
          DEMO WORKSPACE
        </div>
        <Link className="topbar-login" href="/login" data-testid="link-login">Care team sign in <ArrowRight size={14} /></Link>
      </header>

      <section className="intake-layout">
        <aside className="intro-panel">
          <div className="intro-kicker"><span>01</span> PATIENT INTAKE</div>
          <div className="intro-copy">
            <p className="eyebrow">A GOOD VISIT STARTS HERE</p>
            <h1>Tell us what<br />brings you <em>in.</em></h1>
            <p className="intro-description">A few details help the care team prepare for your visit. Take your time — you can review everything before it’s sent.</p>
          </div>
          <div className="flow-note">
            <div className="flow-icon"><ClipboardList size={19} strokeWidth={1.7} /></div>
            <div>
              <strong>Just the essentials</strong>
              <span>Name, birth date, and what you’re experiencing.</span>
            </div>
          </div>
          <div className="intro-footer">
            <span className="footer-rule" />
            <span>PROTOTYPE · SYNTHETIC DATA ONLY</span>
          </div>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="orbit-mark" aria-hidden="true">F.</div>
        </aside>

        <section className="form-panel" aria-label="Patient intake form">
          <div className="form-header">
            <div>
              <p className="step-label">YOUR DETAILS <span>—</span> 1 OF 1</p>
              <h2>{savedIntake ? 'You’re all set.' : 'Let’s get started.'}</h2>
              <p className="form-subtitle">{savedIntake ? 'Your intake has been saved successfully.' : 'Please complete each field below.'}</p>
            </div>
            <div className="step-badge">01 <span>/ 01</span></div>
          </div>

          {savedIntake ? (
            <div className="success-card" role="status" data-testid="status-intake-success">
              <div className="success-symbol"><Check size={24} strokeWidth={2} /></div>
              <p className="success-overline">SUBMISSION CONFIRMED</p>
              <h3>Thank you, {savedIntake.patientName.split(' ')[0]}.</h3>
              <p className="success-copy">Your information is saved and ready for the care team.</p>
              <div className="receipt">
                <div><span>REFERENCE</span><strong data-testid="text-intake-reference">#{savedIntake.id}</strong></div>
                <div><span>SAVED</span><strong data-testid="text-intake-created">{new Date(savedIntake.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</strong></div>
              </div>
              <button className="secondary-button" type="button" onClick={startAnother} data-testid="button-new-intake">
                <RotateCcw size={15} /> Start another intake
              </button>
            </div>
          ) : (
            <Form {...form}>
              <form className="intake-form" onSubmit={form.handleSubmit(submitIntake)} noValidate>
                {mutation.isError && (
                  <div className="failure-message" role="alert" data-testid="status-intake-error">
                    <CircleAlert size={18} />
                    <div>
                      <strong>We couldn’t save your intake.</strong>
                      <p>{mutation.error instanceof Error ? mutation.error.message : 'Check your connection and try submitting again. Your entries are still here.'}</p>
                    </div>
                  </div>
                )}
                <div className="field-grid">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem className="field-wrap field-full">
                        <FormLabel className="field-label">Patient name <span>REQUIRED</span></FormLabel>
                        <FormControl>
                          <Input {...field} autoComplete="name" placeholder="e.g. Morgan Ellis" className="intake-input" data-testid="input-patient-name" aria-describedby="name-hint" />
                        </FormControl>
                        <p className="field-hint" id="name-hint">Enter first and last name.</p>
                        <FormMessage data-testid="error-patient-name" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="field-wrap field-full">
                        <FormLabel className="field-label">Date of birth <span>REQUIRED</span></FormLabel>
                        <FormControl>
                          <Input {...field} type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} className="intake-input date-input" data-testid="input-date-of-birth" />
                        </FormControl>
                        <p className="field-hint">Use the format YYYY-MM-DD.</p>
                        <FormMessage data-testid="error-date-of-birth" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalSymptoms"
                    render={({ field }) => (
                      <FormItem className="field-wrap field-full">
                        <FormLabel className="field-label">What symptoms are you experiencing? <span>REQUIRED</span></FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} maxLength={4000} placeholder="Share what you’ve been feeling, when it started, and anything that makes it better or worse." className="intake-input symptoms-input" data-testid="input-medical-symptoms" />
                        </FormControl>
                        <div className="symptoms-meta">
                          <FormMessage data-testid="error-medical-symptoms" />
                          <span data-testid="text-symptom-character-count">{field.value.length.toLocaleString()} / 4,000</span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="form-bottom">
                  <p className="required-note"><span>*</span> All fields are required</p>
                  <button className="submit-button" type="submit" disabled={mutation.isPending} data-testid="button-submit-intake">
                    {mutation.isPending ? (
                      <><LoaderCircle size={17} className="pending-icon" /> Saving intake…</>
                    ) : (
                      <>Submit intake <ArrowRight size={17} /></>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          )}
          <div className="demo-warning" data-testid="text-demo-warning">
            <CircleAlert size={15} />
            <p><strong>Prototype only.</strong> Use synthetic demo information only. Do not enter real patient records.</p>
          </div>
        </section>
      </section>
      <footer className="page-footer">
        <span>FIELDNOTE CLINIC <span className="footer-separator">/</span> INTAKE PROTOTYPE</span>
        <span>DESIGNED FOR A BETTER FIRST VISIT</span>
      </footer>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
