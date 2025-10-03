 const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
 };


 export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 3600 * 24));

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (diffDays === 0) {
    return `Aujourd'hui, ${hours}:${minutes}`;
  } else if (diffDays === 1) {
    return `Hier, ${hours}:${minutes}`;
  } else {
    return `${formatDate(date)} ${hours}:${minutes}`;
  }
 };


export const pickDate = (dateAsString: string |null) => dateAsString?.split('T')[0] || "";

/**
 * Extrait l'heure (HH:MM:SS) d'une chaîne de date ISO
 * @param dateAsString Chaîne de date au format ISO
 * @returns L'heure au format HH:MM:SS ou une chaîne vide si la date est invalide
 */
export const extractTime = (dateAsString: string | null): string => {
  if (!dateAsString) return "";
  const timePart = dateAsString.split('T')[1];
  if (!timePart) return "";
  return timePart.split('.')[0]; // Retire les millisecondes si présentes
};

/**
 * Extrait la date et l'heure d'une chaîne de date ISO
 * @param dateAsString Chaîne de date au format ISO
 * @returns Un objet avec la date (YYYY-MM-DD) et l'heure (HH:MM:SS)
 */
export const extractDateTime = (dateAsString: string | null): string => {
  if (!dateAsString) return "";
  const [date, timeWithMs] = dateAsString.split('T');
  const time = timeWithMs ? timeWithMs.split('.')[0] : "";
  return date + "T" + time;
};
