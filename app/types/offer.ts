export interface Tab {
  id: string;
  name: string;
}

export interface OfferFormData {
  id: string;
  title: string;
  description: string;
  decision?: 'yes' | 'no' | null;
  submissionMotif?: string;
  refusalMotif?: string;
  metaData: {
    [key: string]: any;
  };
  // Ajoutez d'autres champs nécessaires
}
