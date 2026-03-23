-- Create vendor accounts table
CREATE TABLE IF NOT EXISTS vendor_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL, -- IT/Cloud, Logistics, Legal, Finance, Manufacturing
  services_offered TEXT[] NOT NULL, -- Array of services
  website TEXT,
  country TEXT,
  contact_email TEXT,
  contact_person TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendor submissions table
CREATE TABLE IF NOT EXISTS vendor_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_account_id UUID NOT NULL REFERENCES vendor_accounts(id) ON DELETE CASCADE,
  submission_data JSONB NOT NULL, -- Store all form answers as JSON
  calculated_risk_score NUMERIC,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendor risk calculations table (audit trail)
CREATE TABLE IF NOT EXISTS vendor_risk_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_account_id UUID NOT NULL REFERENCES vendor_accounts(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES vendor_submissions(id) ON DELETE CASCADE,
  inherent_risk_score NUMERIC NOT NULL,
  mitigation_factors JSONB NOT NULL, -- Stores individual mitigation deductions
  residual_risk_score NUMERIC NOT NULL,
  risk_level TEXT, -- Low, Medium, High, Critical
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE vendor_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_risk_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_accounts (vendors can only see their own)
CREATE POLICY "vendor_accounts_select_own" ON vendor_accounts FOR SELECT 
  USING (auth.uid()::text = id::text);

-- RLS Policies for vendor_submissions (vendors can only see/insert their own)
CREATE POLICY "vendor_submissions_select_own" ON vendor_submissions FOR SELECT 
  USING (vendor_account_id = auth.uid());

CREATE POLICY "vendor_submissions_insert_own" ON vendor_submissions FOR INSERT 
  WITH CHECK (vendor_account_id = auth.uid());

-- RLS Policies for vendor_risk_calculations (vendors can only see their own)
CREATE POLICY "vendor_risk_calculations_select_own" ON vendor_risk_calculations FOR SELECT 
  USING (vendor_account_id = auth.uid());

-- Function to calculate risk score from submission
CREATE OR REPLACE FUNCTION calculate_vendor_risk_score(
  submission_data JSONB,
  vendor_type_input TEXT
)
RETURNS JSONB AS $$
DECLARE
  base_risk NUMERIC;
  mitigation_json JSONB := '{}'::JSONB;
  total_mitigation NUMERIC := 0;
  residual_risk NUMERIC;
  risk_level TEXT;
BEGIN
  -- Set base inherent risk by category
  base_risk := CASE vendor_type_input
    WHEN 'IT/Cloud' THEN 70
    WHEN 'Logistics' THEN 60
    WHEN 'Legal' THEN 50
    WHEN 'Finance' THEN 80
    WHEN 'Manufacturing' THEN 65
    ELSE 60
  END;

  -- Apply mitigations based on submission answers
  IF submission_data->>'soc2_certified' = 'true' THEN
    total_mitigation := total_mitigation + 15;
    mitigation_json := mitigation_json || '{"soc2_certified": 15}'::JSONB;
  END IF;

  IF submission_data->>'iso27001_certified' = 'true' THEN
    total_mitigation := total_mitigation + 12;
    mitigation_json := mitigation_json || '{"iso27001_certified": 12}'::JSONB;
  END IF;

  IF submission_data->>'cyber_insurance' = 'true' THEN
    total_mitigation := total_mitigation + 10;
    mitigation_json := mitigation_json || '{"cyber_insurance": 10}'::JSONB;
  END IF;

  IF submission_data->>'multi_region_redundancy' = 'true' THEN
    total_mitigation := total_mitigation + 8;
    mitigation_json := mitigation_json || '{"multi_region_redundancy": 8}'::JSONB;
  END IF;

  IF submission_data->>'disaster_recovery_plan' = 'true' THEN
    total_mitigation := total_mitigation + 7;
    mitigation_json := mitigation_json || '{"disaster_recovery_plan": 7}'::JSONB;
  END IF;

  IF submission_data->>'data_encryption' = 'true' THEN
    total_mitigation := total_mitigation + 10;
    mitigation_json := mitigation_json || '{"data_encryption": 10}'::JSONB;
  END IF;

  -- Calculate residual risk
  residual_risk := GREATEST(0, base_risk - total_mitigation);

  -- Determine risk level
  risk_level := CASE
    WHEN residual_risk <= 25 THEN 'Low'
    WHEN residual_risk <= 50 THEN 'Medium'
    WHEN residual_risk <= 75 THEN 'High'
    ELSE 'Critical'
  END;

  RETURN jsonb_build_object(
    'base_risk', base_risk,
    'mitigation_factors', mitigation_json,
    'total_mitigation', total_mitigation,
    'residual_risk', residual_risk,
    'risk_level', risk_level
  );
END;
$$ LANGUAGE plpgsql;
