import React from "react";
import { useFormContext } from "react-hook-form";
import { Heart, Droplets } from "lucide-react";

// ── Shared elite styled input components ───────────────────
const FieldInput: React.FC<{
  label: string;
  unit?: string;
  name: string;
  placeholder?: string;
  error?: string;
}> = ({ label, unit, name, placeholder, error }) => {
  const { register } = useFormContext<any>();
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label} {unit && `(${unit})`}</label>
      <input
        {...register(name)}
        type="number"
        placeholder={placeholder ?? "—"}
        className={`w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-[13px] font-bold outline-none focus:border-rose-400/50 focus:ring-4 focus:ring-rose-500/5 transition-all ${
          error ? "border-rose-300 bg-rose-50/10" : ""
        }`}
      />
      {error && <p className="text-[11px] text-rose-500 font-medium ml-1">{error}</p>}
    </div>
  );
};

const FieldSelect: React.FC<{
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
}> = ({ label, name, options, error }) => {
  const { register } = useFormContext<any>();
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select
          {...register(name)}
          className={`w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-[13px] font-bold outline-none focus:border-rose-400/50 focus:ring-4 focus:ring-rose-500/5 transition-all cursor-pointer appearance-none ${
            error ? "border-rose-300 bg-rose-50/10" : ""
          }`}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {error && <p className="text-[11px] text-rose-500 font-medium mt-1 ml-1">{error}</p>}
    </div>
  );
};

const SectionGroup: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2.5 pb-2.5 mb-4 border-b border-slate-50/50">
      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
        {React.cloneElement(icon as React.ReactElement, { size: 14, strokeWidth: 2 } as any)}
      </div>
      <p className="text-[12px] font-bold text-slate-800 tracking-tight uppercase">{title}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Step1_Vitals: React.FC = () => {
  const { formState: { errors } } = useFormContext<any>();
  const sgOptions = ["1.005","1.010","1.015","1.020","1.025"].map(v => ({ value: v, label: v }));
  const scaleOptions = ["0","1","2","3","4","5"].map(v => ({ value: v, label: v }));

  return (
    <div className="animate-in fade-in duration-500">
      <SectionGroup icon={<Heart />} title="Primary Vitals">
        <FieldInput name="age" label="Patient Age" unit="Years" placeholder="e.g. 45" error={errors.age?.message as string} />
        <FieldInput name="bloodPressure" label="Blood Pressure" unit="mmHg" placeholder="e.g. 80" error={errors.bloodPressure?.message as string} />
      </SectionGroup>

      <SectionGroup icon={<Droplets />} title="Urinalysis Metrics">
        <FieldSelect name="specificGravity" label="Specific Gravity" options={sgOptions} error={errors.specificGravity?.message as string} />
        <div className="grid grid-cols-2 gap-5">
          <FieldSelect name="albumin" label="Albumin" options={scaleOptions} error={errors.albumin?.message as string} />
          <FieldSelect name="sugar" label="Sugar" options={scaleOptions} error={errors.sugar?.message as string} />
        </div>
      </SectionGroup>
    </div>
  );
};

export { FieldInput, FieldSelect, SectionGroup };
export default Step1_Vitals;
