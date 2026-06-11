import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  UserPlus, Shield, Eye, EyeOff, CheckCircle, AlertCircle,
  ArrowRight, ArrowLeft, Lock, User, Mail, Phone, CreditCard,
  Calendar, Check, Info, HelpCircle,
} from 'lucide-react';
import { Logo } from '../components/Logo';

const steps = [
  {
    label: 'Dados Pessoais',
    icon: User,
    desc: 'Precisamos dos seus dados de identificação para verificar que é um cidadão português com direito ao voto.',
  },
  {
    label: 'Contacto',
    icon: Mail,
    desc: 'O seu email e telefone serão usados para enviar confirmações e notificações sobre o processo eleitoral.',
  },
  {
    label: 'Credenciais',
    icon: Lock,
    desc: 'Crie as credenciais de acesso que irá usar para autenticar-se no SOVE e exercer o seu voto.',
  },
  {
    label: 'Confirmação',
    icon: CheckCircle,
    desc: 'Reveja todos os dados antes de submeter. Após a verificação pelos serviços eleitorais, receberá acesso à plataforma.',
  },
];

interface FormData {
  nome: string;
  cartaoCidadao: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  numerEleitor: string;
  pin: string;
  pinConfirm: string;
  termos: boolean;
  rgpd: boolean;
}

const empty: FormData = {
  nome: '', cartaoCidadao: '', dataNascimento: '',
  email: '', telefone: '', numerEleitor: '',
  pin: '', pinConfirm: '', termos: false, rgpd: false,
};

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5"
        >
          <AlertCircle size={12} className="flex-shrink-0" /> {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function HintBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 mt-2">
      <Info size={12} className="text-gray-500 flex-shrink-0 mt-0.5" />
      <p className="text-gray-500 text-xs leading-relaxed">{children}</p>
    </div>
  );
}

function Field({
  label, required = true, error, hint, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-200 mb-1.5">
        {label}
        {required && <span className="text-[#c8d96f] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <HintBox>{hint}</HintBox>}
      <FieldError msg={error} />
    </div>
  );
}

const inputBase = 'w-full bg-white/8 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:bg-white/10 transition-all';
const inputClass = (err?: string) =>
  `${inputBase} ${err ? 'border-red-500/50 focus:border-red-400/60' : 'border-white/15 focus:border-[#c8d96f]/60'}`;

export function Inscricao() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPin, setShowPin] = useState(false);
  const [showPinC, setShowPinC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validateStep = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!form.nome.trim() || form.nome.trim().split(' ').filter(Boolean).length < 2)
        e.nome = 'Introduza o nome completo (pelo menos primeiro e último nome).';
      if (form.cartaoCidadao.replace(/\s/g, '').length < 8)
        e.cartaoCidadao = 'Introduza o número completo do Cartão de Cidadão.';
      if (!form.dataNascimento)
        e.dataNascimento = 'A data de nascimento é obrigatória.';
      else {
        const age = (Date.now() - new Date(form.dataNascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 18) e.dataNascimento = 'Deve ter pelo menos 18 anos para se inscrever como eleitor.';
      }
    }
    if (step === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = 'Introduza um endereço de email válido (ex: nome@dominio.pt).';
      if (!/^\+?[\d\s\-]{9,15}$/.test(form.telefone))
        e.telefone = 'Introduza um número de telefone válido (9 a 15 dígitos).';
    }
    if (step === 2) {
      if (form.numerEleitor.length < 6)
        e.numerEleitor = 'O Número de Eleitor deve ter pelo menos 6 caracteres.';
      if (form.pin.length < 4)
        e.pin = 'O PIN deve ter entre 4 a 6 dígitos numéricos.';
      if (form.pin !== form.pinConfirm)
        e.pinConfirm = 'Os dois PINs não coincidem. Verifique e tente novamente.';
    }
    if (step === 3) {
      if (!form.termos) e.termos = 'É obrigatório aceitar os termos e condições para prosseguir.' as any;
      if (!form.rgpd) e.rgpd = 'É obrigatório dar consentimento ao tratamento de dados pessoais.' as any;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < steps.length - 1) setStep((s) => s + 1);
    else submit();
  };

  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
    toast.success('Inscrição submetida com sucesso!', { description: 'Receberá confirmação por email em breve.' });
  };

  const StepIcon = steps[step].icon;

  if (done) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[85vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white/8 border border-white/10 rounded-3xl p-10 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-[#c8d96f]/15 border-2 border-[#c8d96f]/40 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check size={36} className="text-[#c8d96f]" />
            </motion.div>
            <h2 className="text-2xl text-white mb-3">Inscrição Submetida!</h2>
            <p className="text-gray-400 mb-2">
              A sua inscrição foi recebida e encontra-se a ser analisada pelos serviços eleitorais.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Enviaremos uma resposta para <span className="text-[#c8d96f]">{form.email}</span> no prazo de 2 a 3 dias úteis.
            </p>
            <div className="bg-[#c8d96f]/8 border border-[#c8d96f]/20 rounded-xl p-5 mb-8 text-left">
              <p className="text-[#c8d96f] text-sm mb-3">O que acontece a seguir?</p>
              <ul className="space-y-3 text-gray-400 text-sm">
                {[
                  { n: '1', t: 'Verificação de identidade', d: 'Os serviços eleitorais confirmam os seus dados junto da base de dados nacional.' },
                  { n: '2', t: 'Notificação por email', d: 'Receberá um email com a aprovação ou pedido de informação adicional.' },
                  { n: '3', t: 'Ativação da conta', d: 'Após aprovação, poderá fazer login com as credenciais que definiu.' },
                ].map(({ n, t, d }) => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c8d96f]/20 text-[#c8d96f] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                    <div>
                      <p className="text-white text-sm">{t}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#c8d96f] text-[#0d3440] py-3 rounded-xl hover:bg-[#d4e07f] transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} /> Ir para o Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <div className="flex justify-center mb-6">
            <Logo className="h-20 w-auto" />
          </div>

          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4 relative">
              <div className="absolute top-4 left-0 right-0 h-px bg-white/10 z-0" />
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        i < step ? 'bg-[#c8d96f] border-[#c8d96f] text-[#0d3440]'
                        : i === step ? 'bg-[#0d3440] border-[#c8d96f] text-[#c8d96f]'
                        : 'bg-[#0d3440] border-white/20 text-gray-600'
                      }`}
                    >
                      {i < step ? <Check size={14} /> : <Icon size={13} />}
                    </div>
                    <span className={`text-xs text-center leading-tight hidden sm:block ${i === step ? 'text-[#c8d96f]' : i < step ? 'text-gray-400' : 'text-gray-600'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <motion.div
                className="h-full bg-[#c8d96f] rounded-full"
                animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-gray-600 text-xs text-right mt-1.5">Passo {step + 1} de {steps.length}</p>
          </div>

          {/* Main card */}
          <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

            {/* Step header */}
            <div className="bg-white/5 border-b border-white/8 px-8 py-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-[#c8d96f]/15 border border-[#c8d96f]/30 rounded-xl flex items-center justify-center">
                  <StepIcon size={18} className="text-[#c8d96f]" />
                </div>
                <div>
                  <h2 className="text-white">{steps[step].label}</h2>
                  <p className="text-gray-500 text-xs">Inscrição de Eleitor SOVE</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{steps[step].desc}</p>
            </div>

            {/* Fields */}
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >

                  {/* ── Step 0: Dados Pessoais ── */}
                  {step === 0 && (
                    <>
                      <Field
                        label="Nome Completo"
                        error={errors.nome}
                        hint="Introduza o seu nome tal como aparece no Cartão de Cidadão — primeiro nome e apelido(s)."
                      >
                        <input
                          type="text"
                          value={form.nome}
                          onChange={(e) => set('nome', e.target.value)}
                          placeholder="Ex: Maria Silva Santos"
                          className={inputClass(errors.nome)}
                          autoFocus
                          autoComplete="name"
                        />
                      </Field>

                      <Field
                        label="Número do Cartão de Cidadão"
                        error={errors.cartaoCidadao}
                        hint={
                          <>
                            Encontra o número no frente do seu Cartão de Cidadão, abaixo da sua fotografia.
                            Formato habitual: <span className="text-gray-400">12345678 9ZZ4</span>
                          </>
                        }
                      >
                        <input
                          type="text"
                          value={form.cartaoCidadao}
                          onChange={(e) => set('cartaoCidadao', e.target.value.toUpperCase())}
                          placeholder="Ex: 12345678 9ZZ4"
                          className={inputClass(errors.cartaoCidadao)}
                          maxLength={14}
                        />
                      </Field>

                      <Field
                        label="Data de Nascimento"
                        error={errors.dataNascimento}
                        hint="Apenas cidadãos com 18 anos ou mais podem inscrever-se como eleitores."
                      >
                        <input
                          type="date"
                          value={form.dataNascimento}
                          onChange={(e) => set('dataNascimento', e.target.value)}
                          max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]}
                          className={inputClass(errors.dataNascimento) + ' [color-scheme:dark]'}
                        />
                      </Field>
                    </>
                  )}

                  {/* ── Step 1: Contacto ── */}
                  {step === 1 && (
                    <>
                      <Field
                        label="Endereço de Email"
                        error={errors.email}
                        hint="Use um email a que tenha acesso regular — será aqui que receberá a confirmação da inscrição e futuras notificações eleitorais."
                      >
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set('email', e.target.value)}
                          placeholder="exemplo@email.com"
                          className={inputClass(errors.email)}
                          autoFocus
                          autoComplete="email"
                        />
                      </Field>

                      <Field
                        label="Número de Telemóvel"
                        error={errors.telefone}
                        hint="Pode ser utilizado para autenticação de dois fatores e alertas de segurança. Inclua o indicativo do país (ex: +351 para Portugal)."
                      >
                        <input
                          type="tel"
                          value={form.telefone}
                          onChange={(e) => set('telefone', e.target.value)}
                          placeholder="+351 912 345 678"
                          className={inputClass(errors.telefone)}
                          autoComplete="tel"
                        />
                      </Field>

                      <div className="flex items-start gap-3 bg-[#c8d96f]/8 border border-[#c8d96f]/20 rounded-xl p-4">
                        <Shield size={16} className="text-[#c8d96f] flex-shrink-0 mt-0.5" />
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Os seus dados de contacto são protegidos ao abrigo do <span className="text-[#c8d96f]">RGPD</span> e
                          nunca serão partilhados com terceiros. São usados exclusivamente no âmbito do processo eleitoral.
                        </p>
                      </div>
                    </>
                  )}

                  {/* ── Step 2: Credenciais ── */}
                  {step === 2 && (
                    <>
                      <Field
                        label="Número de Eleitor"
                        error={errors.numerEleitor}
                        hint={
                          <>
                            O Número de Eleitor encontra-se no seu <span className="text-gray-400">Cartão de Eleitor</span> ou
                            no aviso de recenseamento enviado pelos serviços eleitorais da sua freguesia.
                            Formato: <span className="text-gray-400">PT seguido de 8 dígitos</span>.
                          </>
                        }
                      >
                        <input
                          type="text"
                          value={form.numerEleitor}
                          onChange={(e) => set('numerEleitor', e.target.value.toUpperCase())}
                          placeholder="Ex: PT12345678"
                          className={inputClass(errors.numerEleitor)}
                          maxLength={12}
                          autoFocus
                        />
                      </Field>

                      <Field
                        label="PIN Pessoal"
                        error={errors.pin}
                        hint="Escolha um PIN de 4 a 6 dígitos numéricos. Não use sequências óbvias como 1234 ou a sua data de nascimento. Guarde-o num local seguro."
                      >
                        <div className="relative">
                          <input
                            type={showPin ? 'text' : 'password'}
                            value={form.pin}
                            onChange={(e) => set('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Entre 4 e 6 dígitos"
                            className={inputClass(errors.pin) + ' pr-12'}
                            maxLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            title={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                          >
                            {showPin ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </div>
                      </Field>

                      {form.pin.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-gray-600 text-xs">Dígitos introduzidos: {form.pin.length}/6</p>
                          <div className="flex gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                                  i < form.pin.length ? 'bg-[#c8d96f]' : 'bg-white/15'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <Field
                        label="Confirmar PIN"
                        error={errors.pinConfirm}
                        hint="Repita o PIN que escolheu acima para confirmar que não houve erros de digitação."
                      >
                        <div className="relative">
                          <input
                            type={showPinC ? 'text' : 'password'}
                            value={form.pinConfirm}
                            onChange={(e) => set('pinConfirm', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Repita o PIN"
                            className={inputClass(errors.pinConfirm) + ' pr-12'}
                            maxLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPinC(!showPinC)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            {showPinC ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                          {form.pinConfirm.length > 0 && form.pin === form.pinConfirm && (
                            <CheckCircle size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-[#c8d96f]" />
                          )}
                        </div>
                      </Field>
                    </>
                  )}

                  {/* ── Step 3: Confirmação ── */}
                  {step === 3 && (
                    <>
                      <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/8 overflow-hidden">
                        <div className="px-5 py-3 flex items-center gap-2">
                          <HelpCircle size={14} className="text-[#c8d96f]" />
                          <p className="text-[#c8d96f] text-sm">Reveja os seus dados</p>
                        </div>
                        {[
                          { label: 'Nome completo', value: form.nome, icon: User },
                          { label: 'Cartão de Cidadão', value: form.cartaoCidadao, icon: CreditCard },
                          { label: 'Data de nascimento', value: form.dataNascimento, icon: Calendar },
                          { label: 'Email', value: form.email, icon: Mail },
                          { label: 'Telemóvel', value: form.telefone, icon: Phone },
                          { label: 'Número de Eleitor', value: form.numerEleitor, icon: Shield },
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Icon size={13} /> {label}
                            </div>
                            <span className="text-white text-sm">{value || '—'}</span>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="w-full px-5 py-2.5 text-[#c8d96f] text-xs hover:bg-white/5 transition-colors text-left"
                        >
                          ← Corrigir dados
                        </button>
                      </div>

                      <div className="space-y-4 pt-1">
                        <p className="text-gray-500 text-xs">Os campos marcados com * são obrigatórios para prosseguir.</p>

                        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.termos}
                            onChange={(e) => set('termos', e.target.checked)}
                            className="mt-0.5 accent-[#c8d96f] w-4 h-4 flex-shrink-0 cursor-pointer"
                          />
                          <span className="text-gray-400 text-sm leading-relaxed">
                            <span className="text-red-400">*</span>{' '}
                            Li e aceito os{' '}
                            <span className="text-[#c8d96f] underline underline-offset-2 cursor-pointer hover:text-[#d4e07f]">
                              Termos e Condições de Utilização
                            </span>{' '}
                            do Sistema de Voto Eletrónico SOVE, incluindo as regras de utilização da plataforma e as
                            responsabilidades do eleitor.
                          </span>
                        </label>
                        <FieldError msg={errors.termos} />

                        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.rgpd}
                            onChange={(e) => set('rgpd', e.target.checked)}
                            className="mt-0.5 accent-[#c8d96f] w-4 h-4 flex-shrink-0 cursor-pointer"
                          />
                          <span className="text-gray-400 text-sm leading-relaxed">
                            <span className="text-red-400">*</span>{' '}
                            Consinto o tratamento dos meus dados pessoais pela Comissão Nacional de Eleições,
                            nos termos do{' '}
                            <span className="text-[#c8d96f] underline underline-offset-2 cursor-pointer hover:text-[#d4e07f]">
                              Regulamento Geral de Proteção de Dados (RGPD)
                            </span>
                            , para efeitos de verificação de identidade e gestão do processo eleitoral.
                          </span>
                        </label>
                        <FieldError msg={errors.rgpd} />
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className={`flex gap-3 px-8 py-5 border-t border-white/8 bg-white/3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-3 border border-white/15 text-gray-300 rounded-xl hover:bg-white/8 hover:text-white transition-all"
                >
                  <ArrowLeft size={16} /> Anterior
                </button>
              )}
              <button
                onClick={next}
                disabled={loading}
                className="flex-1 bg-[#c8d96f] text-[#0d3440] py-3 rounded-xl hover:bg-[#d4e07f] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#c8d96f]/20 hover:scale-[1.02] active:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    A submeter inscrição...
                  </>
                ) : step === steps.length - 1 ? (
                  <><CheckCircle size={16} /> Submeter Inscrição</>
                ) : (
                  <>Seguinte <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Já tem conta?{' '}
            <Link to="/login" className="text-[#c8d96f] hover:underline">
              Entrar para votar
            </Link>
          </p>

          <div className="flex items-center justify-center gap-3 mt-4 text-gray-600 text-xs">
            <Lock size={11} />
            <span>Ligação protegida por SSL/TLS 256-bit</span>
            <span>·</span>
            <Shield size={11} />
            <span>ISO/IEC 27001</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
