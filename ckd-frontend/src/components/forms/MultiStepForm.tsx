import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { predictSchema } from "../../schemas/predictSchema.ts";
import { storage } from "../../utils/storage.ts";
import { predictCKD, type PredictionResponse } from "../../api/predictionService";

import Step1_Vitals from "./Step1_Vitals.tsx";
import Step2_Hematology from "./Step2_Hematology.tsx";
import Step3_SerumChemistry from "./Step3_SerumChemistry.tsx";
import Step4_SystemicHistory from "./Step4_SystemicHistory.tsx";
import ResultsDashboard from "../../pages/ResultsDashboard.tsx";

const STEP_FIELDS: string[][] = [
  ["age", "bloodPressure", "specificGravity", "albumin", "sugar"],
  ["redBloodCells", "pusCell", "pusCellClumps", "bacteria", "hemoglobin", "packedCellVolume"],
  ["bloodGlucoseRandom", "bloodUrea", "serumCreatinine", "sodium", "potassium", "whiteBloodCellCount", "redBloodCellCount"],
  ["hypertension", "diabetesMellitus", "coronaryArteryDisease", "appetite", "pedalEdema", "anemia"],
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const methods = useForm<any>({ 
    resolver: zodResolver(predictSchema), 
    mode: "onTouched" 
  });

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await methods.trigger(fields as any);
    
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep((p) => p + 1);
      } else {
        methods.handleSubmit(onSubmit)();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await predictCKD(data);
      
      storage.addRecord({
        id: `${response.prediction}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Patient Assessment",
        ingestionType: "MANUAL",
        status: response.prediction === "CKD" ? "Active Risk" : "Normal Risk",
        lastSync: "Just now",
        completeness: 100,
        data: data
      });

      setPredictionResult(response);
    } catch (error) {
      console.error("Prediction Engine Error:", error);
      alert("Error contacting the prediction engine. Please check if the backend server is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  if (predictionResult) {
    return (
      <ResultsDashboard 
        prediction={predictionResult.prediction} 
        probability={Math.round(predictionResult.probability * 100)} 
        featureImportance={predictionResult.feature_importance} 
        onReset={() => {
          setPredictionResult(null);
          methods.reset();
          setCurrentStep(0);
        }} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Surgical Phase Indicators ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 px-8 relative">
        <div className="absolute top-4 left-16 right-16 h-[1px] bg-slate-100 -z-10" />
        {[0, 1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center gap-2 bg-[#f8fafc] px-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black transition-all duration-500 ${
              currentStep === step 
                ? "bg-rose-600 text-white shadow-lg shadow-rose-100 scale-110" 
                : currentStep > step ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-300"
            }`}>
              {currentStep > step ? <Check size={14} strokeWidth={3} /> : step + 1}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${
              currentStep === step ? "text-rose-600" : "text-slate-300"
            }`}>
              PHASE {step + 1}
            </span>
          </div>
        ))}
      </div>

      {/* ── Form Container ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin mb-4" />
             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Processing Intelligence</p>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <Step1_Vitals />}
                {currentStep === 1 && <Step2_Hematology />}
                {currentStep === 2 && <Step3_SerumChemistry />}
                {currentStep === 3 && <Step4_SystemicHistory />}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation Actions ─────────────────────────────────── */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <button
                type="button"
                onClick={handleBack}
                className={`px-6 py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest ${
                  currentStep === 0 ? "invisible" : "visible"
                }`}
              >
                ← Prev Phase
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-10 py-3.5 rounded-xl text-[11px] font-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
              >
                {currentStep === 3 ? "Initialize Engine" : "Next Phase"}
                <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default MultiStepForm;
