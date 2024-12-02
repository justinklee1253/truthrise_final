export interface Summary {
    original_text: string;
    summary: string;
    created_at: string;
    id?: string;
  }
  
  export interface APIResponse {
    success: boolean;
    data?: any;
    error?: string;
  }