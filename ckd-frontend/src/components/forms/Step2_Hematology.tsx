import React from "react";
import { useFormContext } from "react-hook-form";
import { FlaskConical } from "lucide-react";

const InputField: React.FC<{ label: string, unit?: string, name: string, placeholder: string, error?: string }> = ({ label, unit, name, placeholder, error }) => {
  const { register } = useFormContext<any>();
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label} {unit && `(${unit})`}</label>
      <input
        {...register(name)}
        type="number"
        placeholder={placeholder}
        className={`w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-[13px] font-bold outline-none focus:border-rose-400/50 focus:ring-4 focus:ring-rose-500/5 transition-all ${
          error ? "border-rose-300 bg-rose-50/10" : ""
        }`}
      />
      {error && <p className="text-[11px] text-rose-500 font-medium ml-1">{error}</p>}
    </div>
  );
};

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

const Step2_Hematology: React.FC = () => {
  const { formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
          <FlaskConical size={16} />
        </div>
        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Hematology & Microscopy</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField label="RBC Status" name="redBloodCells" options={[{ label: "Normal", value: "normal" }, { label: "Abnormal", value: "abnormal" }]} error={errors.redBloodCells?.message as string} />
        <SelectField label="Pus Cell Status" name="pusCell" options={[{ label: "Normal", value: "normal" }, { label: "Abnormal", value: "abnormal" }]} error={errors.pusCell?.message as string} />
        <SelectField label="Pus Cell Clumps" name="pusCellClumps" options={[{ label: "Present", value: "present" }, { label: "Not Present", value: "notpresent" }]} error={errors.pusCellClumps?.message as string} />
        <SelectField label="Bacteria" name="bacteria" options={[{ label: "Present", value: "present" }, { label: "Not Present", value: "notpresent" }]} error={errors.bacteria?.message as string} />
        <InputField label="Hemoglobin" unit="g/dL" name="hemoglobin" placeholder="e.g. 15.4" error={errors.hemoglobin?.message as string} />
        <InputField label="Packed Cell Vol" unit="%" name="packedCellVolume" placeholder="e.g. 44" error={errors.packedCellVolume?.message as string} />
      </div>
    </div>
  );
};

export default Step2_Hematology;
