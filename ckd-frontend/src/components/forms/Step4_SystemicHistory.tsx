import React from "react";
import { useFormContext } from "react-hook-form";
import { ClipboardList } from "lucide-react";

const SelectField: React.FC<{ label: string, name: string, options: { label: string, value: string }[], error?: string }> = ({ label, name, options, error }) => {
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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {error && <p className="text-[11px] text-rose-500 font-medium ml-1">{error}</p>}
    </div>
  );
};

const Step4_SystemicHistory: React.FC = () => {
  const { formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
          <ClipboardList size={16} />
        </div>
        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Systemic History & Comorbidities</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField label="Hypertension" name="hypertension" options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }]} error={errors.hypertension?.message as string} />
        <SelectField label="Diabetes Mellitus" name="diabetesMellitus" options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }]} error={errors.diabetesMellitus?.message as string} />
        <SelectField label="Coronary Artery" name="coronaryArteryDisease" options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }]} error={errors.coronaryArteryDisease?.message as string} />
        <SelectField label="Appetite" name="appetite" options={[{ label: "Good", value: "good" }, { label: "Poor", value: "poor" }]} error={errors.appetite?.message as string} />
        <SelectField label="Pedal Edema" name="pedalEdema" options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }]} error={errors.pedalEdema?.message as string} />
        <SelectField label="Anemia" name="anemia" options={[{ label: "No", value: "no" }, { label: "Yes", value: "yes" }]} error={errors.anemia?.message as string} />
      </div>
    </div>
  );
};

export default Step4_SystemicHistory;
