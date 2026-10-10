import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, User, Phone, GraduationCap, Target, FlaskConical } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ApplicationForm() {
  const { t } = useI18n();
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: '',
    goal: '',
  });

  const validate = () => {
    if (!formData.name.trim() || formData.name.trim().length < 3) return false;
    const phoneRegex = /^\+?998?\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) return false;
    if (!formData.grade) return false;
    if (!formData.goal) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
      return;
    }

    setFormState('sending');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormState('success');
      setFormData({ name: '', phone: '', grade: '', goal: '' });
      setTimeout(() => setFormState('idle'), 5000);
    } catch {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  const labelClass = 'flex items-center gap-2 text-sm font-medium text-white/70 mb-2';

  return (
    <section id="apply" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-sm font-medium text-accent-400">
            {t.form.tag}
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.form.title}
          </h2>
          <p className="mt-3 text-white/60">{t.form.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="apply-container"
        >
          <form onSubmit={handleSubmit} className="apply-box">
            {/* Logo */}
            <div className="apply-logo">
              <FlaskConical className="h-8 w-8 text-accent-400" />
            </div>

            <span className="apply-header">{t.form.title}</span>

            {/* Name */}
            <div>
              <label className={labelClass}>
                <User className="h-4 w-4 text-accent-400" />
                {t.form.name}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.form.namePlaceholder}
                className="apply-input"
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>
                <Phone className="h-4 w-4 text-accent-400" />
                {t.form.phone}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t.form.phonePlaceholder}
                className="apply-input"
              />
            </div>

            {/* Grade */}
            <div>
              <label className={labelClass}>
                <GraduationCap className="h-4 w-4 text-accent-400" />
                {t.form.grade}
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="apply-input"
              >
                <option value="" className="bg-navy-800">—</option>
                {t.form.gradeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-navy-800">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className={labelClass}>
                <Target className="h-4 w-4 text-accent-400" />
                {t.form.goal}
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="apply-input"
              >
                <option value="" className="bg-navy-800">—</option>
                {t.form.goalOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-navy-800">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button type="submit" disabled={formState === 'sending'} className="apply-btn mt-1">
              {formState === 'sending' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t.form.sending}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {t.form.submit}
                </>
              )}
            </button>

            {/* Messages */}
            <AnimatePresence>
              {formState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-accent-400/10 border border-accent-400/30 px-4 py-3"
                >
                  <CheckCircle className="h-5 w-5 text-accent-400 flex-shrink-0" />
                  <p className="text-sm text-accent-400">{t.form.success}</p>
                </motion.div>
              )}
              {formState === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3"
                >
                  <p className="text-sm text-red-400">{t.form.error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
