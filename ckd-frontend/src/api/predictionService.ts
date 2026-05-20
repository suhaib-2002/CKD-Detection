import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

/**
 * Interface for the request payload sent to the backend
 */
export interface CKDPayload {
  features: Record<string, string | number>;
}

/**
 * Interface for the medical prediction response
 */
export interface PredictionResponse {
  prediction: "CKD" | "NOT CKD";
  probability: number;
  risk_factors: string[];
  feature_importance?: Array<{ name: string; importance: number }>;
}

export const API_READY = true;

/**
 * Service to communicate with the FastAPI CKD Prediction Backend
 */
export const predictCKD = async (data: any): Promise<PredictionResponse> => {
  const response = await axios.post<PredictionResponse>(`${API_BASE_URL}/predict`, {
    features: data
  });
  return response.data;
};
