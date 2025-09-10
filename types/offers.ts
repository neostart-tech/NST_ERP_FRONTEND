export interface Offer {
  id: string;
  title: string;
  reference?: string;
  description?: string;
  status: 'draft' | 'active' | 'submitted' | 'evaluation' | 'won' | 'lost' | 'cancelled';
  estimated_budget?: number;
  publication_date?: string;
  submission_deadline?: string;
  created_at?: string;
  updated_at?: string;
  // Ajoutez d'autres champs nécessaires
}

export type OfferStatus = Offer['status'];

export interface OfferMetrics {
  totalOffers: number;
  activeOffers: number;
  submittedOffers: number;
  wonOffers: number;
  lostOffers: number;
  successRate: number;
  totalValue: number;
  wonValue: number;
  pendingValue: number;
}
