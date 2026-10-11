export interface FeatureFlag {
    id?: string;
    key: string;
    val: string;
    description: string;
    is_active: number;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface FeatureFlagFormData {
    id?: string;
    key: string;
    val: string;
    description: string;
    is_active: number;
  } 