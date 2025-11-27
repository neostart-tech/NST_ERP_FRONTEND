import type { Equipment } from "~/models/Equipment";
import type { ValidationErrors } from "../../composables/useValidationErrors";
import { useValidationErrors } from "../../composables/useValidationErrors";
import jsPDF from "jspdf";

export const useEquipmentStore = defineStore('Equipment', {
	state: () => ({
		equipments: [] as Equipment[],
		loading: false,
		validationErrors: {} as ValidationErrors,
	}),

	actions: {
		async fetchEquipments() {
			try {
				const { data } = await useApi().get<Equipment[]>(ApiUrl.EQUIPMENT);
				this.equipments = data;
			} catch (error) {
				console.error("Error fetching equipments: - equipmentStore.js:14", error);
			}
		},

		async addEquipment(payload: FormData) {
			try {
				const { data } = await useApi().post<Equipment>(ApiUrl.EQUIPMENT, payload);
				this.equipments.push(data);
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
			} finally {
				this.loading = false;
			}
		},
		async updateEquipment(id: string, formData: FormData) {
			this.loading = true;
			try {
				const { data } = await useApi().put<Equipment>(ApiUrl.EQUIPMENT_BY_ID.replace(":id", id), formData);
				this.equipments = this.equipments.map(_ => _.id === id ? data : _);
			} catch (error) {
				console.error("Error updating equipment: - equipmentStore.js:44", error);
				this.validationErrors = useValidationErrors(error);
			} finally {
				this.loading = false;
			}
		},



		async deleteEquipment(id: string) {
			this.loading = true;
			try {
				await useApi().del(ApiUrl.EQUIPMENT_BY_ID.replace(":id", id));
				this.equipments = this.equipments.filter(_ => _.id !== id);
			} catch (error) {
				console.error("Error deleting equipment: - equipmentStore.js:60", error);
				this.validationErrors = useValidationErrors(error);
			} finally {
				this.loading = false;
			}
		},


		async generateEquipmentSheet(equipment: Equipment) {
			try {

				// Je crée une instance de jsPDF en format A4
				const doc = new jsPDF('p', 'mm', 'a4');

				// Configuration
				const pageWidth = doc.internal.pageSize.width;
				const margin = 20;
				let yPosition = margin;

				// Définition des couleurs de la charte graphique
				const primaryBlue = [59, 130, 246];    // Bleu principal
				const secondaryBlue = [30, 64, 175];   // Bleu secondaire
				const accentGreen = [16, 185, 129];    // Vert d'accent
				const slate800 = [30, 41, 59];         // Slate 800
				const slate700 = [51, 65, 85];         // Slate 700
				const slate200 = [226, 232, 240];      // Slate 200
				const slate50 = [248, 250, 252];       // Slate 50

				// === EN-TÊTE PROFESSIONNEL ===
				// Bandeau supérieur avec dégradé
				doc.setFillColor(slate800[0]!, slate800[1]!, slate800[2]!);
				doc.rect(0, 0, pageWidth, 30, 'F');

				// Logo simulé
				doc.setFillColor(255, 255, 255);
				doc.roundedRect(15, 6, 18, 18, 3, 3, 'F');

				// Texte dans le logo
				doc.setTextColor(primaryBlue[0]!, primaryBlue[1]!, primaryBlue[2]!);
				doc.setFontSize(10);
				doc.setFont('helvetica', 'bold');
				doc.text('ET', 24, 16, { align: 'center' });

				// Titre principal
				doc.setTextColor(255, 255, 255);
				doc.setFontSize(16);
				doc.setFont('helvetica', 'bold');
				doc.text('FICHE TECHNIQUE ÉQUIPEMENT', pageWidth / 2, 14, { align: 'center' });

				// Sous-titre
				doc.setFontSize(9);
				doc.setFont('helvetica', 'normal');
				doc.text('SYSTÈME DE GESTION TECHNIQUE', pageWidth / 2, 20, { align: 'center' });

				// Référence de l'équipement
				doc.text(`Réf: ${equipment.model}-${equipment.serial_number}`, pageWidth - 15, 25, { align: 'right' });

				yPosition = 40;

				// === INFORMATIONS DE LA SOCIÉTÉ ===
				doc.setFillColor(slate50[0]!, slate50[1]!, slate50[2]!);
				doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'F');
				doc.setDrawColor(slate200[0]!, slate200[1]!, slate200[2]!);
				doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 3, 3, 'S');

				doc.setTextColor(slate800[0]!, slate800[1]!, slate800[2]!);
				doc.setFontSize(12);
				doc.setFont('helvetica', 'bold');
				doc.text(equipment.company_name.toUpperCase(), margin + 10, yPosition + 8);

				doc.setFontSize(8);
				doc.setFont('helvetica', 'normal');
				doc.setTextColor(slate700[0]!, slate700[1]!, slate700[2]!);
				doc.text(`${equipment.company_address} - ${equipment.company_zipCode} ${equipment.company_city}`, margin + 10, yPosition + 14);

				yPosition += 30;

				// === INFORMATIONS GÉNÉRALES ===
				// Titre de section
				doc.setFillColor(slate800[0]!, slate800[1]!, slate800[2]!);
				doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');

				doc.setTextColor(255, 255, 255);
				doc.setFontSize(10);
				doc.setFont('helvetica', 'bold');
				doc.text('INFORMATIONS GÉNÉRALES', margin + 5, yPosition + 5.5);

				yPosition += 15;

				// Grille d'informations améliorée
				const infoGrid = [
					{
						label: 'Type d\'équipement',
						value: equipment.type,
						color: equipment.type === 'Réseau' ? primaryBlue : accentGreen
					},
					{ label: 'Marque', value: equipment.brand },
					{ label: 'Modèle', value: equipment.model },
					{ label: 'N° de série', value: equipment.serial_number },
					{ label: 'Fabricant', value: equipment.manufacturer || 'Non spécifié' },
					{
						label: 'Prix diagnostic',
						value: equipment.diagnostic_price ? equipment.diagnostic_price + ' fcfa' : 'Non renseigné',
						color: equipment.diagnostic_price ? accentGreen : undefined
					}
				];

				// Je parcours la grille d'informations
				infoGrid.forEach((item, index) => {
					const x = margin + (index % 2) * ((pageWidth - 2 * margin) / 2);
					const rowY = yPosition + Math.floor(index / 2) * 12;

					// Je gère les sauts de page si nécessaire
					if (rowY > 250) {
						doc.addPage();
						yPosition = margin;
					}

					// Label
					doc.setTextColor(slate700[0]!, slate700[1]!, slate700[2]!);
					doc.setFontSize(7);
					doc.setFont('helvetica', 'normal');
					doc.text(item.label + ':', x, rowY);

					// Valeur avec couleur spécifique si définie
					if (item.color) {
						doc.setTextColor(item.color[0]!, item.color[1]!, item.color[2]!);
					} else {
						doc.setTextColor(slate800[0]!, slate800[1]!, slate800[2]!);
					}
					doc.setFontSize(8);
					doc.setFont('helvetica', 'bold');
					doc.text(item.value, x, rowY + 4);
				});

				yPosition += Math.ceil(infoGrid.length / 2) * 12 + 10;

				// === INFORMATIONS SPÉCIFIQUES ===
				// Je affiche les informations spécifiques selon le type d'équipement
				if ((equipment.type === 'Réseau' && (equipment.role || equipment.mac_address || equipment.ip_address)) ||
					(equipment.type === 'Non réseau' && equipment.name)) {

					// Je vérifie l'espace disponible
					if (yPosition > 200) {
						doc.addPage();
						yPosition = margin;
					}

					doc.setFillColor(slate800[0]!, slate800[1]!, slate800[2]!);
					doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');

					doc.setTextColor(255, 255, 255);
					doc.setFontSize(10);
					doc.setFont('helvetica', 'bold');
					doc.text('CONFIGURATION SPÉCIFIQUE', margin + 5, yPosition + 5.5);

					yPosition += 15;

					const specificInfo = [];

					// Informations réseau
					if (equipment.type === 'Réseau') {
						if (equipment.role) specificInfo.push({ label: 'Rôle', value: equipment.role });
						if (equipment.mac_address) specificInfo.push({ label: 'Adresse MAC', value: equipment.mac_address });
						if (equipment.ip_address) specificInfo.push({ label: 'Adresse IP', value: equipment.ip_address });
					} else {
						// Informations non-réseau
						if (equipment.name) specificInfo.push({ label: 'Nom', value: equipment.name });
					}

					// Je affiche les informations spécifiques
					specificInfo.forEach((item, index) => {
						const rowY = yPosition + index * 10;

						doc.setTextColor(slate700[0]!, slate700[1]!, slate700[2]!);
						doc.setFontSize(7);
						doc.setFont('helvetica', 'normal');
						doc.text(item.label + ':', margin, rowY);

						doc.setTextColor(slate800[0]!, slate800[1]!, slate800[2]!);
						doc.setFontSize(8);
						doc.setFont('helvetica', 'bold');
						doc.text(item.value, margin + 25, rowY);
					});

					yPosition += specificInfo.length * 10 + 10;
				}

				// === CARACTÉRISTIQUES TECHNIQUES ===
				if (equipment.characteristics) {
					if (yPosition > 220) {
						doc.addPage();
						yPosition = margin;
					}

					doc.setFillColor(slate800[0]!, slate800[1]!, slate800[2]!);
					doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');

					doc.setTextColor(255, 255, 255);
					doc.setFontSize(10);
					doc.setFont('helvetica', 'bold');
					doc.text('CARACTÉRISTIQUES TECHNIQUES', margin + 5, yPosition + 5.5);

					yPosition += 15;

					doc.setTextColor(slate800[0]!, slate800[1]!, slate800[2]!);
					doc.setFontSize(9);
					doc.setFont('helvetica', 'normal');

					// Je découpe le texte pour qu'il tienne dans la page
					const characteristics = doc.splitTextToSize(equipment.characteristics, pageWidth - 2 * margin - 10);
					characteristics.forEach((line: string) => {
						if (yPosition > 270) {
							doc.addPage();
							yPosition = margin;
						}
						doc.text(line, margin + 5, yPosition);
						yPosition += 5;
					});

					yPosition += 10;
				}

				// === COMMENTAIRES ===
				if (equipment.comment) {
					if (yPosition > 220) {
						doc.addPage();
						yPosition = margin;
					}

					doc.setFillColor(accentGreen[0]!, accentGreen[1]!, accentGreen[2]!);
					doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');

					doc.setTextColor(255, 255, 255);
					doc.setFontSize(10);
					doc.setFont('helvetica', 'bold');
					doc.text('COMMENTAIRES', margin + 5, yPosition + 5.5);

					yPosition += 15;

					doc.setTextColor(slate800[0]!, slate800[1]!, slate800[2]!);
					doc.setFontSize(9);
					doc.setFont('helvetica', 'normal');

					// Je découpe les commentaires
					const comments = doc.splitTextToSize(equipment.comment, pageWidth - 2 * margin - 10);
					comments.forEach((line: string) => {
						if (yPosition > 270) {
							doc.addPage();
							yPosition = margin;
						}
						doc.text(line, margin + 5, yPosition);
						yPosition += 5;
					});
				}

				// === PIED DE PAGE SUR TOUTES LES PAGES ===
				// @ts-ignore
				const totalPages = doc.internal.getNumberOfPages();
				for (let i = 1; i <= totalPages; i++) {
					doc.setPage(i);

					// Ligne de séparation
					doc.setDrawColor(slate200[0]!, slate200[1]!, slate200[2]!);
					doc.line(margin, 280, pageWidth - margin, 280);

					// Informations du pied de page
					doc.setTextColor(slate700[0]!, slate700[1]!, slate700[2]!);
					doc.setFontSize(7);
					doc.setFont('helvetica', 'normal');

					// À gauche : Société
					doc.text(equipment.company_name, margin, 285);

					// Au centre : Numéro de page
					doc.text(`Page ${i} sur ${totalPages}`, pageWidth / 2, 285, { align: 'center' });

					// À droite : Date de génération
					doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, 285, { align: 'right' });
				}

				// === TÉLÉCHARGEMENT DU PDF ===
				const fileName = `fiche-technique-${equipment.model}-${equipment.serial_number}.pdf`
					.toLowerCase()
					.replace(/[^a-z0-9-]/g, '-')
					.replace(/-+/g, '-')
					.replace(/^-|-$/g, '');

				doc.save(fileName);

			} catch (error) {
				console.error('Erreur lors de la génération du PDF:', error);
				alert('Erreur lors de la génération du PDF. Vérifiez la console pour plus de détails.');
			}
		}
	}
});
