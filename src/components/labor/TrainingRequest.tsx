import { useState, type FormEvent } from 'react';
import { CheckCircle2, Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n';
export function TrainingRequest() {
  const { t } = useI18n(); const l = t.labor; const [done, setDone] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setDone(true); };
  return <div id="labor-request" className="labor-section mt-10 border-t pt-8"><h3 className="text-2xl font-bold">{l.formTitle}</h3><p className="mt-3 text-sm text-muted-foreground">{l.formNote}</p>{done ? <div className="mt-6 border-l-4 border-orange py-3 pl-5"><p role="status" className="flex items-start gap-3 font-semibold"><CheckCircle2 className="h-6 w-6 shrink-0 text-orange" />{l.success}</p><Button variant="outline" className="mt-5" onClick={() => setDone(false)}><RotateCcw />{l.another}</Button></div> : <form onSubmit={submit} className="mt-6 grid max-w-4xl gap-5 md:grid-cols-2">
    <label className="text-sm font-semibold">{l.form.company}<Input name="company" className="mt-2" required maxLength={160} autoComplete="organization" /></label>
    <label className="text-sm font-semibold">{l.form.contact}<Input name="contact" className="mt-2" required maxLength={240} autoComplete="off" /></label>
    <label className="text-sm font-semibold md:col-span-2">{l.form.occupations}<Input name="occupations" className="mt-2" required maxLength={500} /></label>
    <label className="text-sm font-semibold">{l.form.people}<Input name="people" className="mt-2" type="number" required min={1} max={100000} step={1} /></label>
    <label className="text-sm font-semibold">{l.form.deadline}<Input name="deadline" className="mt-2" required maxLength={120} /></label>
    <label className="text-sm font-semibold md:col-span-2">{l.form.message}<Textarea name="message" className="mt-2" rows={4} maxLength={3000} /></label>
    <div className="md:col-span-2"><Button type="submit" variant="cta"><Send />{l.form.submit}</Button></div>
  </form>}</div>;
}