import type { Client } from "./Client";

export interface Intervention {
	id?: string;
	date: string;
	type: string;
	description: string;
	status: string;
	notes?: string;
}

export interface Contract {
	id: string;
	reference_number: string;
	client_id: string;
	client?: Client;
	formula: string;
	start_date: string;
	contract_type: string;
	origin: string;
	end_date: string;
	amount: number;
	frequency: string;
	status: string;
	interventions?: Intervention[];
	created_at?: string;
	updated_at?: string;
}

export interface Letter {
	clientId: string;
	clientContact: string;
	contractType: string;
	formula: string;
	amount: number;
	equipmentDetails: string;
	startDate: string;
	endDate: string;
	frequency: string;
	preamble: string;
	providerCommitments: string;
	clientCommitments: string;
	includedServices: string;
	interventions: Intervention[];
}

export const contractStatusToString = (status: string): string => {
	const statusMap: Record<string, string> = {
		active: "Actif",
		pending: "En attente",
		expired: "Expiré",
		inactive: "Inactif",
		mensuel: "Mensuel",
		trimestriel: "Trimestriel",
		annuel: "Annuel",
	};
	return statusMap[status] || status;
};

export const defaultContractData = (contract?: Contract): Contract => {
	return {
		id: contract?.id || "",
		reference_number: contract?.reference_number || "",
		client_id: contract?.client_id || "",
		formula: contract?.formula || "standard",
		start_date: contract?.start_date || "",
		contract_type: contract?.contract_type || "",
		origin: contract?.origin || "",
		end_date: contract?.end_date || "",
		amount: contract?.amount || 0,
		frequency: contract?.frequency || "mensuel",
		status: contract?.status || "pending",
		interventions: contract?.interventions || [],
	};
};

export const defaultLetterData = (): Letter => {
	return {
		clientId: "",
		clientContact: "",
		contractType: "main_oeuvre",
		formula: "standard",
		amount: 0,
		equipmentDetails: "",
		startDate: "",
		endDate: "",
		frequency: "mensuel",
		preamble:
			"Dans le cadre de nos activités de maintenance informatique, nous sommes heureux de vous proposer un contrat de maintenance personnalisé pour votre parc informatique.",
		providerCommitments:
			"- Maintenance préventive régulière\n- Assistance technique prioritaire\n- Mise à jour des systèmes\n- Rapport d'intervention détaillé",
		clientCommitments:
			"- Accès aux locaux pendant les heures ouvrables\n- Prévenir en cas de modification du parc\n- Paiement dans les délais convenus",
		includedServices:
			"- Nettoyage et maintenance du matériel\n- Vérification des sauvegardes\n- Mise à jour des logiciels\n- Optimisation des performances\n- Support technique",
		interventions: [],
	};
};
