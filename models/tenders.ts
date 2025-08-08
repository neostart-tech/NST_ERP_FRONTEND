// src/types/offers.ts

// Core entity types for offer domain
export interface offer {
  id: string
  reference: string
  title: string
  description: string
  source: string // Source of the offer (website, contact, etc.)
  publisher: string // Organization publishing the offer
  deadline: string // Submission deadline
  estimatedValue: number
  sector: string // Industry sector
  location: string
  status: offerStatus
  priority: offerPriority
  createdAt: string
  updatedAt: string
  documents: offerDocument[]
  submissions: offerSubmission[]
  requirements: string[] // List of requirements
  criteria: EvaluationCriteria[]
  tags: string[]
}

export interface offerDocument {
  id: string
  offerId: string
  name: string
  type: DocumentType
  category: DocumentCategory
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  version: number
  isRequired: boolean
  description?: string
}

export interface offerSubmission {
  id: string
  offerId: string
  submittedAt: string
  status: SubmissionStatus
  documents: SubmissionDocument[]
  proposal: offerProposal
  result?: SubmissionResult
  followUp: FollowUpAction[]
}

export interface offerProposal {
  id: string
  technicalOffer: string
  financialOffer: FinancialOffer
  deliveryPlan: DeliveryPlan
  team: TeamAssignment[]
  guarantees: string[]
  validityPeriod: number // in days
}

export interface FinancialOffer {
  totalAmount: number
  breakdown: CostBreakdown[]
  paymentTerms: string
  currency: string
  taxIncluded: boolean
}

export interface CostBreakdown {
  category: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface DeliveryPlan {
  phases: DeliveryPhase[]
  totalDuration: number // in days
  milestones: Milestone[]
}

export interface DeliveryPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  deliverables: string[]
  dependencies: string[]
}

export interface Milestone {
  id: string
  name: string
  date: string
  deliverables: string[]
  criticalPath: boolean
}

export interface TeamAssignment {
  id: string
  role: string
  name: string
  experience: string
  allocation: number // percentage
  skills: string[]
  skillsText: string // Text representation of skills for easier input
}

export interface SubmissionDocument {
  id: string
  name: string
  type: DocumentType
  fileUrl: string
  generated: boolean // true if auto-generated
  template?: string
}

export interface SubmissionResult {
  id: string
  receivedAt: string
  status: ResultStatus
  ranking?: number
  score?: number
  feedback?: string
  wonAmount?: number
  lostReason?: string
  nextSteps?: string[]
}

export interface FollowUpAction {
  id: string
  type: FollowUpType
  description: string
  dueDate: string
  completed: boolean
  assignedTo: string
  notes?: string
}

export interface EvaluationCriteria {
  id: string
  name: string
  weight: number // percentage
  description: string
  type: CriteriaType
}

export interface ProjectTask {
  id: string
  offerId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string
  dueDate: string
  estimatedHours: number
  actualHours?: number
  dependencies: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProjectProgress {
  offerId: string
  completionPercentage: number
  tasksTotal: number
  tasksCompleted: number
  tasksInProgress: number
  tasksOverdue: number
  lastUpdate: string
}

// Form data interfaces for API operations
export interface offerFormData {
  reference: string
  title: string
  description: string
  source: string
  publisher: string
  deadline: string
  estimatedValue: number
  sector: string
  location: string
  priority: offerPriority
  requirements: string[]
  tags: string[]
}

export interface SubmissionFormData {
  offerId: string
  technicalOffer: string
  financialOffer: Omit<FinancialOffer, 'breakdown'>
  costBreakdown: CostBreakdown[]
  deliveryPlan: Omit<DeliveryPlan, 'phases' | 'milestones'>
  team: TeamAssignment[]
  guarantees: string[]
  validityPeriod: number
}

export interface TaskFormData {
  title: string
  description: string
  assignedTo: string
  dueDate: string
  estimatedHours: number
  priority: TaskPriority
  dependencies: string[]
  tags: string[]
}

// Enum types for better type safety
export type offerStatus =
  | 'draft'
  | 'active'
  | 'submitted'
  | 'evaluation'
  | 'won'
  | 'lost'
  | 'cancelled'

export type offerPriority = 'low' | 'medium' | 'high' | 'critical'

export type DocumentType =
  | 'cahier_charges'
  | 'reglement'
  | 'plans'
  | 'annexe'
  | 'specification'
  | 'autre'

export type DocumentCategory = 'required' | 'optional' | 'reference' | 'template'

export type SubmissionStatus = 'draft' | 'ready' | 'submitted' | 'acknowledged' | 'under_review'

export type ResultStatus = 'pending' | 'shortlisted' | 'won' | 'lost' | 'cancelled'

export type FollowUpType = 'meeting' | 'call' | 'email' | 'document' | 'presentation'

export type CriteriaType = 'technical' | 'financial' | 'experience' | 'methodology'

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'blocked'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// Utility types for filtering and sorting
export interface offerFilters {
  status?: offerStatus[]
  priority?: offerPriority[]
  sector?: string[]
  dateRange?: {
    start: string
    end: string
  }
  estimatedValueRange?: {
    min: number
    max: number
  }
  tags?: string[]
  search?: string
}

export interface offerSortOptions {
  field: 'deadline' | 'estimatedValue' | 'priority' | 'createdAt'
  direction: 'asc' | 'desc'
}

// Analytics and metrics types
export interface offerMetrics {
  totaloffers: number
  activeoffers: number
  submittedoffers: number
  wonoffers: number
  lostoffers: number
  successRate: number
  averageValue: number
  totalValue: number
  wonValue: number
  pendingValue: number
  monthlySubmissions: MonthlyData[]
  sectorDistribution: SectorData[]
  statusDistribution: StatusData[]
}

export interface MonthlyData {
  month: string
  submissions: number
  wins: number
  value: number
}

export interface SectorData {
  sector: string
  count: number
  value: number
  successRate: number
}

export interface StatusData {
  status: offerStatus
  count: number
  percentage: number
}

// Error handling types
export interface offerError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}

export interface ApiResponse<T> {
  data?: T
  error?: offerError
  success: boolean
  message?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// All types and interfaces are already exported above individually.
