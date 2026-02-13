export const formatDate = (date: Date | string): string => {
	const parsedDate = typeof date === "string" ? new Date(date) : date;

	if (isNaN(parsedDate.getTime())) {
		return "Date invalide";
		// throw new Error("Date invalide");
	}

	const day = parsedDate.getDate().toString().padStart(2, "0");
	const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
	const year = parsedDate.getFullYear();

	return `${day}/${month}/${year}`;
};


export const formatRelativeDate = (date: Date | string | null): string => {
	if (!date) return "";

	const parsedDate = date instanceof Date ? date : new Date(date);

	if (isNaN(parsedDate.getTime())) return "";

	const now = new Date();
	const diff = now.getTime() - parsedDate.getTime();
	const diffDays = Math.floor(diff / (1000 * 3600 * 24));

	const hours = parsedDate.getHours().toString().padStart(2, "0");
	const minutes = parsedDate.getMinutes().toString().padStart(2, "0");

	if (diffDays === 0) {
		return `Aujourd'hui, ${hours}:${minutes}`;
	} else if (diffDays === 1) {
		return `Hier, ${hours}:${minutes}`;
	} else {
		return `${formatDate(parsedDate)} ${hours}:${minutes}`;
	}
};


export const pickDate = (dateAsString: string | null) =>
	dateAsString?.split("T")[0] || "";

/**
 * Extrait l'heure (HH:MM:SS) d'une chaîne de date ISO
 * @param dateAsString Chaîne de date au format ISO
 * @returns L'heure au format HH:MM:SS ou une chaîne vide si la date est invalide
 */
export const extractTime = (dateAsString: string | null): string => {
	if (!dateAsString) return "";
	const timePart = dateAsString.split("T")[1];
	if (!timePart) return "";
	const timeWithoutMs = timePart.split(".")[0];
	return timeWithoutMs || ""; // Retire les millisecondes si présentes
};

/**
 * Extrait la date et l'heure d'une chaîne de date ISO
 * @param dateAsString Chaîne de date au format ISO
 * @returns Un objet avec la date (YYYY-MM-DD) et l'heure (HH:MM:SS)
 */
export const extractDateTime = (dateAsString: string | null): string => {
	if (!dateAsString) return "";
	const [date, timeWithMs] = dateAsString.split("T");
	const time = timeWithMs ? timeWithMs.split(".")[0] : "";
	return date + "T" + time;
};

/**
 * Parse une date ISO pour l'afficher dans un input de type datetime-local
 * Gère les formats: 2025-11-15T11:30:00.000000Z ou 2025-11-15
 * @param dateAsString Chaîne de date au format ISO
 * @returns La date au format YYYY-MM-DDTHH:MM pour input datetime-local
 */
export const parseForDateTimeInput = (
	dateAsString: string | null | undefined
): string => {
	if (!dateAsString) return "";

	// Retire le Z final si présent
	const cleanDate = dateAsString.replace("Z", "");

	// Split sur T pour séparer date et heure
	const [datePart, timePart] = cleanDate.split("T");

	if (!timePart) {
		// Si pas d'heure, retourne juste la date
		return datePart || "";
	}

	// Retire les microsecondes (.000000) et garde seulement HH:MM
	const timeWithoutMs = timePart.split(".")[0];
	if (!timeWithoutMs) return datePart || "";
	const timeParts = timeWithoutMs.split(":");
	const hours = timeParts[0] || "00";
	const minutes = timeParts[1] || "00";

	return `${datePart}T${hours}:${minutes}`;
};

/**
 * Parse une date ISO pour l'afficher dans un input de type date
 * Gère les formats: 2025-11-15T11:30:00.000000Z ou 2025-11-15
 * @param dateAsString Chaîne de date au format ISO
 * @returns La date au format YYYY-MM-DD pour input date
 */
export const parseForDateInput = (
	dateAsString: string | null | undefined
): string => {
	if (!dateAsString) return "";
	// Extrait seulement la partie date
	return dateAsString.split("T")[0] || "";
};

/**
 * Parse une date ISO pour l'afficher dans un input de type time
 * Gère le format: 2025-11-15T11:30:00.000000Z
 * @param dateAsString Chaîne de date au format ISO
 * @returns L'heure au format HH:MM pour input time
 */
export const parseForTimeInput = (dateAsString: string | null): string => {
	if (!dateAsString) return "";

	const timePart = dateAsString.split("T")[1];
	if (!timePart) return "";

	// Retire le Z et les microsecondes, garde seulement HH:MM
	const cleanTime = timePart.replace("Z", "").split(".")[0];
	if (!cleanTime) return "";
	const timeParts = cleanTime.split(":");
	const hours = timeParts[0] || "00";
	const minutes = timeParts[1] || "00";

	return `${hours}:${minutes}`;
};
