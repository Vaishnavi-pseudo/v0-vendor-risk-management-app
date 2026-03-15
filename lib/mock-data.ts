export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type VendorStatus = 'Active' | 'Under Review' | 'Offboarded' | 'Pending Approval';
export type DocumentStatus = 'Uploaded' | 'Pending' | 'Expired';
export type AlertType = 'Document Expiry' | 'Overdue Review' | 'Risk Score Change' | 'New Vendor Pending';
export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Vendor {
  id: string;
  name: string;
  category: 'IT/Cloud' | 'Logistics' | 'Legal' | 'Finance' | 'Manufacturing';
  country: string;
  website: string;
  inherentRisk: RiskLevel;
  residualRiskScore: number;
  lastReviewDate: string;
  status: VendorStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  dataAccess: 'None' | 'Limited' | 'Sensitive' | 'Critical';
  financialExposure: 'Low' | 'Medium' | 'High';
  operationalDependency: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedReviewer: string;
  likelihood: number; // 1-5 for heatmap
  impact: number; // 1-5 for heatmap
  reviewHistory: ReviewEvent[];
}

export interface ReviewEvent {
  date: string;
  event: string;
  user: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  type: 'NDA' | 'SOC 2 Report' | 'Information Security Policy' | 'Business Continuity Plan' | 'GDPR/DPA' | 'Insurance Certificate';
  status: DocumentStatus;
  uploadedDate: string | null;
  expiryDate: string | null;
}

export interface Alert {
  id: string;
  vendorId: string;
  vendorName: string;
  type: AlertType;
  dueDate: string;
  severity: AlertSeverity;
  resolved: boolean;
  message: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'CloudScale Technologies',
    category: 'IT/Cloud',
    country: 'United States',
    website: 'https://cloudscale.io',
    inherentRisk: 'Critical',
    residualRiskScore: 82,
    lastReviewDate: '2024-01-15',
    status: 'Active',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah.mitchell@cloudscale.io',
    contactPhone: '+1 (555) 123-4567',
    dataAccess: 'Critical',
    financialExposure: 'High',
    operationalDependency: 'Critical',
    assignedReviewer: 'John Smith',
    likelihood: 4,
    impact: 5,
    reviewHistory: [
      { date: '2024-01-15', event: 'Annual risk assessment completed', user: 'John Smith' },
      { date: '2023-10-20', event: 'SOC 2 report reviewed', user: 'Emily Chen' },
      { date: '2023-07-05', event: 'Contract renewal processed', user: 'John Smith' },
    ]
  },
  {
    id: 'v2',
    name: 'SwiftLogistics Inc',
    category: 'Logistics',
    country: 'Germany',
    website: 'https://swiftlogistics.de',
    inherentRisk: 'Medium',
    residualRiskScore: 45,
    lastReviewDate: '2024-02-01',
    status: 'Active',
    contactName: 'Hans Mueller',
    contactEmail: 'h.mueller@swiftlogistics.de',
    contactPhone: '+49 30 12345678',
    dataAccess: 'Limited',
    financialExposure: 'Medium',
    operationalDependency: 'Medium',
    assignedReviewer: 'Emily Chen',
    likelihood: 2,
    impact: 3,
    reviewHistory: [
      { date: '2024-02-01', event: 'Quarterly review completed', user: 'Emily Chen' },
      { date: '2023-11-15', event: 'Insurance certificate verified', user: 'Emily Chen' },
    ]
  },
  {
    id: 'v3',
    name: 'LegalEdge Partners',
    category: 'Legal',
    country: 'United Kingdom',
    website: 'https://legaledge.co.uk',
    inherentRisk: 'High',
    residualRiskScore: 68,
    lastReviewDate: '2023-12-10',
    status: 'Under Review',
    contactName: 'James Crawford',
    contactEmail: 'j.crawford@legaledge.co.uk',
    contactPhone: '+44 20 7946 0958',
    dataAccess: 'Sensitive',
    financialExposure: 'Medium',
    operationalDependency: 'Medium',
    assignedReviewer: 'John Smith',
    likelihood: 3,
    impact: 4,
    reviewHistory: [
      { date: '2023-12-10', event: 'Risk assessment flagged for review', user: 'John Smith' },
      { date: '2023-09-05', event: 'NDA renewed', user: 'Sarah Wilson' },
    ]
  },
  {
    id: 'v4',
    name: 'FinanceHub Solutions',
    category: 'Finance',
    country: 'Singapore',
    website: 'https://financehub.sg',
    inherentRisk: 'Critical',
    residualRiskScore: 78,
    lastReviewDate: '2024-01-20',
    status: 'Active',
    contactName: 'Wei Lin',
    contactEmail: 'wei.lin@financehub.sg',
    contactPhone: '+65 6789 0123',
    dataAccess: 'Critical',
    financialExposure: 'High',
    operationalDependency: 'High',
    assignedReviewer: 'Emily Chen',
    likelihood: 4,
    impact: 4,
    reviewHistory: [
      { date: '2024-01-20', event: 'Annual audit completed', user: 'Emily Chen' },
      { date: '2023-08-12', event: 'Security assessment passed', user: 'John Smith' },
    ]
  },
  {
    id: 'v5',
    name: 'PrecisionMfg Co',
    category: 'Manufacturing',
    country: 'Japan',
    website: 'https://precisionmfg.jp',
    inherentRisk: 'Low',
    residualRiskScore: 25,
    lastReviewDate: '2024-02-15',
    status: 'Active',
    contactName: 'Takeshi Yamamoto',
    contactEmail: 't.yamamoto@precisionmfg.jp',
    contactPhone: '+81 3 1234 5678',
    dataAccess: 'None',
    financialExposure: 'Low',
    operationalDependency: 'Low',
    assignedReviewer: 'Sarah Wilson',
    likelihood: 1,
    impact: 2,
    reviewHistory: [
      { date: '2024-02-15', event: 'Quality certification renewed', user: 'Sarah Wilson' },
    ]
  },
  {
    id: 'v6',
    name: 'DataVault Systems',
    category: 'IT/Cloud',
    country: 'Canada',
    website: 'https://datavault.ca',
    inherentRisk: 'High',
    residualRiskScore: 71,
    lastReviewDate: '2023-11-28',
    status: 'Under Review',
    contactName: 'Michael Brown',
    contactEmail: 'm.brown@datavault.ca',
    contactPhone: '+1 (416) 555-7890',
    dataAccess: 'Sensitive',
    financialExposure: 'Medium',
    operationalDependency: 'High',
    assignedReviewer: 'John Smith',
    likelihood: 3,
    impact: 5,
    reviewHistory: [
      { date: '2023-11-28', event: 'Security incident reported', user: 'John Smith' },
      { date: '2023-09-10', event: 'Penetration test completed', user: 'Emily Chen' },
    ]
  },
  {
    id: 'v7',
    name: 'GlobalShip Express',
    category: 'Logistics',
    country: 'Netherlands',
    website: 'https://globalship.nl',
    inherentRisk: 'Low',
    residualRiskScore: 32,
    lastReviewDate: '2024-01-05',
    status: 'Active',
    contactName: 'Anna van der Berg',
    contactEmail: 'a.vanderberg@globalship.nl',
    contactPhone: '+31 20 123 4567',
    dataAccess: 'Limited',
    financialExposure: 'Low',
    operationalDependency: 'Medium',
    assignedReviewer: 'Emily Chen',
    likelihood: 2,
    impact: 2,
    reviewHistory: [
      { date: '2024-01-05', event: 'Annual review completed', user: 'Emily Chen' },
    ]
  },
  {
    id: 'v8',
    name: 'SecureNet Analytics',
    category: 'IT/Cloud',
    country: 'United States',
    website: 'https://securenet.com',
    inherentRisk: 'High',
    residualRiskScore: 65,
    lastReviewDate: '2023-12-20',
    status: 'Active',
    contactName: 'David Chen',
    contactEmail: 'd.chen@securenet.com',
    contactPhone: '+1 (650) 555-3456',
    dataAccess: 'Sensitive',
    financialExposure: 'Medium',
    operationalDependency: 'Medium',
    assignedReviewer: 'Sarah Wilson',
    likelihood: 3,
    impact: 3,
    reviewHistory: [
      { date: '2023-12-20', event: 'SOC 2 Type II received', user: 'Sarah Wilson' },
      { date: '2023-06-15', event: 'Vendor onboarded', user: 'John Smith' },
    ]
  },
  {
    id: 'v9',
    name: 'TrustLegal Associates',
    category: 'Legal',
    country: 'Australia',
    website: 'https://trustlegal.com.au',
    inherentRisk: 'Medium',
    residualRiskScore: 48,
    lastReviewDate: '2024-02-10',
    status: 'Active',
    contactName: 'Rachel Thompson',
    contactEmail: 'r.thompson@trustlegal.com.au',
    contactPhone: '+61 2 9876 5432',
    dataAccess: 'Sensitive',
    financialExposure: 'Low',
    operationalDependency: 'Low',
    assignedReviewer: 'Emily Chen',
    likelihood: 2,
    impact: 3,
    reviewHistory: [
      { date: '2024-02-10', event: 'Contract terms reviewed', user: 'Emily Chen' },
    ]
  },
  {
    id: 'v10',
    name: 'PayStream Global',
    category: 'Finance',
    country: 'Switzerland',
    website: 'https://paystream.ch',
    inherentRisk: 'Critical',
    residualRiskScore: 85,
    lastReviewDate: '2023-10-30',
    status: 'Active',
    contactName: 'Marco Rossi',
    contactEmail: 'm.rossi@paystream.ch',
    contactPhone: '+41 44 123 4567',
    dataAccess: 'Critical',
    financialExposure: 'High',
    operationalDependency: 'Critical',
    assignedReviewer: 'John Smith',
    likelihood: 5,
    impact: 5,
    reviewHistory: [
      { date: '2023-10-30', event: 'PCI-DSS compliance verified', user: 'John Smith' },
      { date: '2023-07-20', event: 'Financial audit completed', user: 'Emily Chen' },
    ]
  },
  {
    id: 'v11',
    name: 'IndustrialParts Ltd',
    category: 'Manufacturing',
    country: 'China',
    website: 'https://industrialparts.cn',
    inherentRisk: 'Medium',
    residualRiskScore: 52,
    lastReviewDate: '2024-01-25',
    status: 'Pending Approval',
    contactName: 'Liu Wei',
    contactEmail: 'l.wei@industrialparts.cn',
    contactPhone: '+86 21 1234 5678',
    dataAccess: 'None',
    financialExposure: 'Medium',
    operationalDependency: 'Medium',
    assignedReviewer: 'Sarah Wilson',
    likelihood: 3,
    impact: 2,
    reviewHistory: [
      { date: '2024-01-25', event: 'Onboarding documents submitted', user: 'System' },
    ]
  },
  {
    id: 'v12',
    name: 'CloudOps Pro',
    category: 'IT/Cloud',
    country: 'Ireland',
    website: 'https://cloudops.ie',
    inherentRisk: 'Low',
    residualRiskScore: 28,
    lastReviewDate: '2024-02-20',
    status: 'Offboarded',
    contactName: 'Patrick Murphy',
    contactEmail: 'p.murphy@cloudops.ie',
    contactPhone: '+353 1 234 5678',
    dataAccess: 'Limited',
    financialExposure: 'Low',
    operationalDependency: 'Low',
    assignedReviewer: 'Emily Chen',
    likelihood: 1,
    impact: 1,
    reviewHistory: [
      { date: '2024-02-20', event: 'Vendor offboarded - contract ended', user: 'Emily Chen' },
      { date: '2024-01-10', event: 'Final data deletion confirmed', user: 'John Smith' },
    ]
  },
];

export const documents: VendorDocument[] = [
  // CloudScale Technologies
  { id: 'd1', vendorId: 'v1', vendorName: 'CloudScale Technologies', name: 'NDA', type: 'NDA', status: 'Uploaded', uploadedDate: '2023-06-01', expiryDate: '2025-06-01' },
  { id: 'd2', vendorId: 'v1', vendorName: 'CloudScale Technologies', name: 'SOC 2 Report', type: 'SOC 2 Report', status: 'Uploaded', uploadedDate: '2024-01-10', expiryDate: '2025-01-10' },
  { id: 'd3', vendorId: 'v1', vendorName: 'CloudScale Technologies', name: 'Information Security Policy', type: 'Information Security Policy', status: 'Uploaded', uploadedDate: '2023-08-15', expiryDate: '2024-08-15' },
  { id: 'd4', vendorId: 'v1', vendorName: 'CloudScale Technologies', name: 'Business Continuity Plan', type: 'Business Continuity Plan', status: 'Pending', uploadedDate: null, expiryDate: null },
  { id: 'd5', vendorId: 'v1', vendorName: 'CloudScale Technologies', name: 'GDPR/DPA', type: 'GDPR/DPA', status: 'Uploaded', uploadedDate: '2023-05-20', expiryDate: '2026-05-20' },
  { id: 'd6', vendorId: 'v1', vendorName: 'CloudScale Technologies', name: 'Insurance Certificate', type: 'Insurance Certificate', status: 'Expired', uploadedDate: '2023-01-01', expiryDate: '2024-01-01' },
  
  // SwiftLogistics Inc
  { id: 'd7', vendorId: 'v2', vendorName: 'SwiftLogistics Inc', name: 'NDA', type: 'NDA', status: 'Uploaded', uploadedDate: '2023-03-15', expiryDate: '2025-03-15' },
  { id: 'd8', vendorId: 'v2', vendorName: 'SwiftLogistics Inc', name: 'Insurance Certificate', type: 'Insurance Certificate', status: 'Uploaded', uploadedDate: '2024-01-05', expiryDate: '2025-01-05' },
  { id: 'd9', vendorId: 'v2', vendorName: 'SwiftLogistics Inc', name: 'Business Continuity Plan', type: 'Business Continuity Plan', status: 'Uploaded', uploadedDate: '2023-07-20', expiryDate: '2024-07-20' },
  
  // LegalEdge Partners
  { id: 'd10', vendorId: 'v3', vendorName: 'LegalEdge Partners', name: 'NDA', type: 'NDA', status: 'Uploaded', uploadedDate: '2023-09-05', expiryDate: '2025-09-05' },
  { id: 'd11', vendorId: 'v3', vendorName: 'LegalEdge Partners', name: 'Information Security Policy', type: 'Information Security Policy', status: 'Pending', uploadedDate: null, expiryDate: null },
  { id: 'd12', vendorId: 'v3', vendorName: 'LegalEdge Partners', name: 'GDPR/DPA', type: 'GDPR/DPA', status: 'Uploaded', uploadedDate: '2023-09-10', expiryDate: '2025-09-10' },
  
  // FinanceHub Solutions
  { id: 'd13', vendorId: 'v4', vendorName: 'FinanceHub Solutions', name: 'NDA', type: 'NDA', status: 'Uploaded', uploadedDate: '2023-04-01', expiryDate: '2025-04-01' },
  { id: 'd14', vendorId: 'v4', vendorName: 'FinanceHub Solutions', name: 'SOC 2 Report', type: 'SOC 2 Report', status: 'Uploaded', uploadedDate: '2024-01-15', expiryDate: '2025-01-15' },
  { id: 'd15', vendorId: 'v4', vendorName: 'FinanceHub Solutions', name: 'Insurance Certificate', type: 'Insurance Certificate', status: 'Uploaded', uploadedDate: '2023-12-01', expiryDate: '2024-12-01' },
  { id: 'd16', vendorId: 'v4', vendorName: 'FinanceHub Solutions', name: 'GDPR/DPA', type: 'GDPR/DPA', status: 'Expired', uploadedDate: '2022-06-01', expiryDate: '2024-02-01' },
  
  // DataVault Systems
  { id: 'd17', vendorId: 'v6', vendorName: 'DataVault Systems', name: 'NDA', type: 'NDA', status: 'Uploaded', uploadedDate: '2023-06-15', expiryDate: '2025-06-15' },
  { id: 'd18', vendorId: 'v6', vendorName: 'DataVault Systems', name: 'SOC 2 Report', type: 'SOC 2 Report', status: 'Pending', uploadedDate: null, expiryDate: null },
  { id: 'd19', vendorId: 'v6', vendorName: 'DataVault Systems', name: 'Information Security Policy', type: 'Information Security Policy', status: 'Uploaded', uploadedDate: '2023-09-10', expiryDate: '2024-09-10' },
  
  // PayStream Global
  { id: 'd20', vendorId: 'v10', vendorName: 'PayStream Global', name: 'NDA', type: 'NDA', status: 'Uploaded', uploadedDate: '2023-02-01', expiryDate: '2025-02-01' },
  { id: 'd21', vendorId: 'v10', vendorName: 'PayStream Global', name: 'SOC 2 Report', type: 'SOC 2 Report', status: 'Uploaded', uploadedDate: '2023-10-30', expiryDate: '2024-10-30' },
  { id: 'd22', vendorId: 'v10', vendorName: 'PayStream Global', name: 'Insurance Certificate', type: 'Insurance Certificate', status: 'Uploaded', uploadedDate: '2023-11-01', expiryDate: '2024-03-15' },
  { id: 'd23', vendorId: 'v10', vendorName: 'PayStream Global', name: 'Business Continuity Plan', type: 'Business Continuity Plan', status: 'Uploaded', uploadedDate: '2023-07-20', expiryDate: '2024-07-20' },
];

export const alerts: Alert[] = [
  { id: 'a1', vendorId: 'v1', vendorName: 'CloudScale Technologies', type: 'Document Expiry', dueDate: '2024-01-01', severity: 'High', resolved: false, message: 'Insurance Certificate has expired' },
  { id: 'a2', vendorId: 'v4', vendorName: 'FinanceHub Solutions', type: 'Document Expiry', dueDate: '2024-02-01', severity: 'Critical', resolved: false, message: 'GDPR/DPA has expired and requires immediate attention' },
  { id: 'a3', vendorId: 'v6', vendorName: 'DataVault Systems', type: 'Overdue Review', dueDate: '2024-02-28', severity: 'High', resolved: false, message: 'Quarterly security review is overdue' },
  { id: 'a4', vendorId: 'v3', vendorName: 'LegalEdge Partners', type: 'Risk Score Change', dueDate: '2024-03-01', severity: 'Medium', resolved: false, message: 'Risk score increased from 55 to 68 after recent assessment' },
  { id: 'a5', vendorId: 'v11', vendorName: 'IndustrialParts Ltd', type: 'New Vendor Pending', dueDate: '2024-03-10', severity: 'Low', resolved: false, message: 'New vendor awaiting approval - onboarding documents submitted' },
  { id: 'a6', vendorId: 'v10', vendorName: 'PayStream Global', type: 'Document Expiry', dueDate: '2024-03-15', severity: 'High', resolved: false, message: 'Insurance Certificate expiring within 30 days' },
  { id: 'a7', vendorId: 'v2', vendorName: 'SwiftLogistics Inc', type: 'Document Expiry', dueDate: '2024-07-20', severity: 'Medium', resolved: true, message: 'Business Continuity Plan expiring soon' },
  { id: 'a8', vendorId: 'v8', vendorName: 'SecureNet Analytics', type: 'Overdue Review', dueDate: '2024-02-20', severity: 'Medium', resolved: true, message: 'Annual security review completed' },
];

export const activityFeed: ActivityEvent[] = [
  { id: 'e1', timestamp: '2024-02-25T14:30:00', message: 'CloudScale Technologies submitted updated SOC 2 report', type: 'success' },
  { id: 'e2', timestamp: '2024-02-25T11:15:00', message: 'Risk score updated for PayStream Global (82 → 85)', type: 'warning' },
  { id: 'e3', timestamp: '2024-02-24T16:45:00', message: 'IndustrialParts Ltd submitted onboarding documents', type: 'info' },
  { id: 'e4', timestamp: '2024-02-24T09:20:00', message: 'DataVault Systems flagged for security review', type: 'error' },
  { id: 'e5', timestamp: '2024-02-23T15:00:00', message: 'Quarterly review completed for SwiftLogistics Inc', type: 'success' },
  { id: 'e6', timestamp: '2024-02-23T10:30:00', message: 'New NDA signed with TrustLegal Associates', type: 'success' },
  { id: 'e7', timestamp: '2024-02-22T14:00:00', message: 'CloudOps Pro offboarding process initiated', type: 'info' },
  { id: 'e8', timestamp: '2024-02-22T09:45:00', message: 'Insurance certificate expired for CloudScale Technologies', type: 'error' },
];

export const dashboardStats = {
  totalVendors: vendors.filter(v => v.status !== 'Offboarded').length,
  highRiskVendors: vendors.filter(v => v.inherentRisk === 'High' || v.inherentRisk === 'Critical').length,
  pendingReviews: vendors.filter(v => v.status === 'Under Review' || v.status === 'Pending Approval').length,
  documentsOverdue: documents.filter(d => d.status === 'Expired' || d.status === 'Pending').length,
};

export const riskDistributionByCategory = [
  { category: 'IT/Cloud', low: 1, medium: 1, high: 2, critical: 1 },
  { category: 'Logistics', low: 1, medium: 1, high: 0, critical: 0 },
  { category: 'Legal', low: 0, medium: 1, high: 1, critical: 0 },
  { category: 'Finance', low: 0, medium: 0, high: 0, critical: 2 },
  { category: 'Manufacturing', low: 1, medium: 1, high: 0, critical: 0 },
];
