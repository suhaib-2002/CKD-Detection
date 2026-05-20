import React from "react";
import { useFormContext } from "react-hook-form";
import { Beaker } from "lucide-react";

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

const Step3_SerumChemistry: React.FC = () => {
  const { formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
          <Beaker size={16} />
        </div>
        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Serum Chemistry & Counts</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputField label="Blood Glucose" unit="mgs/dl" name="bloodGlucoseRandom" placeholder="e.g. 121" error={errors.bloodGlucoseRandom?.message as string} />
        <InputField label="Blood Urea" unit="mgs/dl" name="bloodUrea" placeholder="e.g. 36" error={errors.bloodUrea?.message as string} />
        <InputField label="Serum Creatinine" unit="mgs/dl" name="serumCreatinine" placeholder="e.g. 1.2" error={errors.serumCreatinine?.message as string} />
        <InputField label="Sodium" unit="mEq/L" name="sodium" placeholder="e.g. 138" error={errors.sodium?.message as string} />
        <InputField label="Potassium" unit="mEq/L" name="potassium" placeholder="e.g. 4.4" error={errors.potassium?.message as string} />
        <InputField label="WBC Count" unit="cells/cumm" name="whiteBloodCellCount" placeholder="e.g. 7800" error={errors.whiteBloodCellCount?.message as string} />
        <InputField label="RBC Count" unit="millions/cmm" name="redBloodCellCount" placeholder="e.g. 5.2" error={errors.redBloodCellCount?.message as string} />
      </div>
    </div>
  );
};

export default Step3_SerumChemistry;
