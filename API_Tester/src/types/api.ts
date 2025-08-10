export interface ApiService {
  id: string;
  name: string;
  description: string;
  logo: string;
  endpoint: string;
  method: 'GET' | 'POST';
  fields: ApiField[];
}

export interface ApiField {
  name: string;
  label: string;
  type: 'text' | 'password';
  required: boolean;
  placeholder?: string;
}

export interface TestResult {
  success: boolean;
  status?: number;
  message: string;
  details?: any;
}

export type Screen = 'selection' | 'form' | 'results';