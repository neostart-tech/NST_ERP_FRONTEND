import { defineStore } from "pinia";
import type { Proforma } from "~/models/Proforma";
import { jsPDF } from "jspdf";
import { drawPdfFooter, drawPdfLogo, getCompanyFooterInfo } from "@/utils/pdf/pdfBranding";
export const useProformaStore = defineStore("ProformaStore", {
	state: () => ({
		proforma: [] as Proforma[],
		isLoading: false,
		isSaving: false,
		validationErrors: {},
	}),

	actions: {
		async fetchAll() {
			try {
				if (this.proforma.length == 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Proforma[]>(ApiUrl.PROFORMA);
				this.proforma = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(proforma: Proforma) {
			try {
				this.isSaving = true;
				const { data } = await useApi().post<Proforma>(
					ApiUrl.PROFORMA,
					proforma
				);
				this.proforma.push(data);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur d'enregistrement de facture", error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async fetchProformaValidate() {
			try {
				if (this.proforma.length == 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Proforma[]>(ApiUrl.PROFORMA_VALIDATE);
				this.proforma = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
		async updateStatus(id: string, status: string) {
			try {
				const { data } = await useApi().put<Proforma>(
					ApiUrl.parameterized(ApiUrl.PROFORMA_BY_ID_STATUS, id),
					{ status }
				);
				this.proforma = this.proforma.map((_) => (_.id === id ? data : _));
			} catch (error) {
				console.error("Erreur lors de la misa à jour du statut", error);
			} finally {
				this.isSaving = false;
			}
		},

		async downloadProformaAsPdf(proforma: Proforma) {
			try {
				const doc = new jsPDF({
					orientation: "portrait",
					unit: "mm",
					format: "a4",
				});

				const margin = 14;
				const pageWidth = doc.internal.pageSize.getWidth();
				const pageHeight = doc.internal.pageSize.getHeight();
				const footerTopY = pageHeight - 30;
				const usableBottomY = footerTopY - 8;
				const companyInfo = getCompanyFooterInfo();

				const tableWidth = pageWidth - margin * 2;
				const colRef = 24;
				const colDesignation = 74;
				const colUnitPrice = 28;
				const colQuantity = 18;
				const colTotal = tableWidth - (colRef + colDesignation + colUnitPrice + colQuantity);

				const xRef = margin;
				const xDesignation = xRef + colRef;
				const xUnitPrice = xDesignation + colDesignation;
				const xQuantity = xUnitPrice + colUnitPrice;
				const xTotal = xQuantity + colQuantity;

				const formatDate = (value: string | Date | undefined) => {
					if (!value) return "-";
					const date = new Date(value);
					if (Number.isNaN(date.getTime())) return "-";
					return date.toLocaleDateString("fr-FR");
				};

				const formatAmount = (value: number) => {
					const normalized = Math.round(Number(value) || 0);
					return String(normalized).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
				};

				const getClientName = () => {
					const client = proforma.client;
					if (!client) return "-";
					if ((client.client_type || "").toLowerCase() === "physique") {
						return `${client.first_name || ""} ${client.last_name || ""}`.trim() || "-";
					}
					return client.company_name || `${client.first_name || ""} ${client.last_name || ""}`.trim() || "-";
				};

				const fileToDataUrl = (file: File) =>
					new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(String(reader.result || ""));
						reader.onerror = () => reject(new Error("Impossible de lire le fichier image"));
						reader.readAsDataURL(file);
					});

				const urlToDataUrl = async (url: string): Promise<string | null> => {
					try {
						const response = await fetch(url);
						if (!response.ok) return null;
						const blob = await response.blob();
						return await fileToDataUrl(new File([blob], "image"));
					} catch {
						return null;
					}
				};

				const extractImageSource = (article: any): string | File | null => {
					if (article?.photo) return article.photo;
					if (article?.image) return article.image;
					if (article?.photoPreview) return article.photoPreview;
					if (Array.isArray(article?.images) && article.images.length > 0) {
						const first = article.images[0];
						if (typeof first === "string") return first;
						return first?.url || first?.path || first?.src || null;
					}
					return null;
				};

				const resolveArticleImage = async (article: any): Promise<string | null> => {
					const source = extractImageSource(article);
					if (!source) return null;
					if (source instanceof File) {
						try {
							return await fileToDataUrl(source);
						} catch {
							return null;
						}
					}
					if (typeof source === "string") {
						if (source.startsWith("data:image")) return source;
						return await urlToDataUrl(source);
					}
					return null;
				};

				const logoDataUrl = await urlToDataUrl("/logo.png");

				const drawHeader = () => {
					const logoY = 8;
					const logoHeight = 12;
					const titleY = logoY + logoHeight + 8;
					const metaY = titleY + 9;

					drawPdfLogo(doc, logoDataUrl, { margin, y: logoY, width: 24, height: logoHeight });

					doc.setFont("helvetica", "bold");
					doc.setFontSize(18);
					doc.text("PROFORMA", pageWidth / 2, titleY, { align: "center" });

					doc.setFont("helvetica", "normal");
					doc.setFontSize(10);
					doc.text(`REF : ${proforma.reference || "-"}`, margin, metaY);
					doc.text(`CLIENT : ${getClientName()}`, pageWidth / 2, metaY, { align: "center" });
					doc.text(`DATE : ${formatDate(proforma.created_at)}`, pageWidth - margin, metaY, { align: "right" });
				};

				const drawFooter = () => {
					drawPdfFooter(doc, {
						margin,
						pageWidth,
						footerTopY,
						companyInfo,
					});
				};

				const drawTableHeader = (startY: number) => {
					doc.setDrawColor(0, 0, 0);
					doc.setLineWidth(0.2);
					doc.setFont("helvetica", "bold");
					doc.setFontSize(9);
					doc.rect(xRef, startY, colRef, 9);
					doc.rect(xDesignation, startY, colDesignation, 9);
					doc.rect(xUnitPrice, startY, colUnitPrice, 9);
					doc.rect(xQuantity, startY, colQuantity, 9);
					doc.rect(xTotal, startY, colTotal, 9);

					doc.text("N°", xRef + colRef / 2, startY + 5.7, { align: "center" });
					doc.text("DESIGNATION", xDesignation + colDesignation / 2, startY + 5.7, { align: "center" });
					doc.text("PRIX UNITAIRE", xUnitPrice + colUnitPrice / 2, startY + 5.7, { align: "center" });
					doc.text("QTE", xQuantity + colQuantity / 2, startY + 5.7, { align: "center" });
					doc.text("TOTAL", xTotal + colTotal / 2, startY + 5.7, { align: "center" });
				};

				drawHeader();
				drawFooter();
				let y = 42;
				drawTableHeader(y);
				y += 9;

				const rows = await Promise.all((proforma.articles || []).map(async (article: any) => {
					const quantity = Number(article?.pivot?.quantity || 0);
					const unitPrice = Number(article?.pivot?.unit_price || article?.unit_price_sale || 0);
					const lineTotal = quantity * unitPrice;
					const designation = [article?.name, article?.description].filter(Boolean).join("\n");
					const imageDataUrl = await resolveArticleImage(article);

					return {
						reference: article?.reference || article?.name || "-",
						designation: designation || "-",
						unitPrice,
						quantity,
						lineTotal,
						imageDataUrl,
					};
				}));

				doc.setFont("helvetica", "normal");
				doc.setFontSize(9);

				for (const row of rows) {
					const wrappedReference = doc.splitTextToSize(String(row.reference), colRef - 4);
					const wrappedDesignation = doc.splitTextToSize(row.designation, colDesignation - 14);
					const wrappedUnitPrice = doc.splitTextToSize(formatAmount(row.unitPrice), colUnitPrice - 4);
					const wrappedQuantity = doc.splitTextToSize(String(row.quantity), colQuantity - 4);
					const wrappedLineTotal = doc.splitTextToSize(formatAmount(row.lineTotal), colTotal - 4);

					const maxLineCount = Math.max(
						wrappedReference.length,
						wrappedDesignation.length,
						wrappedUnitPrice.length,
						wrappedQuantity.length,
						wrappedLineTotal.length,
						1
					);

					const textHeight = maxLineCount * 4.1 + 2;
					const imageHeight = row.imageDataUrl ? 14 : 0;
					const rowHeight = Math.max(11, textHeight, imageHeight + 2);

					if (y + rowHeight > usableBottomY) {
						doc.addPage();
						drawHeader();
						drawFooter();
						y = 42;
						drawTableHeader(y);
						y += 9;
					}

					doc.setDrawColor(0, 0, 0);
					doc.setLineWidth(0.2);
					doc.rect(xRef, y, colRef, rowHeight);
					doc.rect(xDesignation, y, colDesignation, rowHeight);
					doc.rect(xUnitPrice, y, colUnitPrice, rowHeight);
					doc.rect(xQuantity, y, colQuantity, rowHeight);
					doc.rect(xTotal, y, colTotal, rowHeight);

					doc.text(wrappedReference, xRef + 2, y + 5.5);
					doc.text(wrappedDesignation, xDesignation + 2, y + 5.5);

					if (row.imageDataUrl) {
						const imageType = row.imageDataUrl.includes("image/png") ? "PNG" : "JPEG";
						try {
							doc.addImage(row.imageDataUrl, imageType, xDesignation + 2, y + rowHeight - 14, 12, 12);
						} catch {
							// Ignore image rendering failures and keep the row content.
						}
					}

					doc.text(wrappedUnitPrice, xQuantity - 2, y + 5.5, { align: "right" });
					doc.text(wrappedQuantity, xTotal - 2, y + 5.5, { align: "right" });
					doc.text(wrappedLineTotal, margin + tableWidth - 2, y + 5.5, { align: "right" });

					y += rowHeight;
				}

				const totalHT = Number(proforma.total_ht || rows.reduce((sum, row) => sum + row.lineTotal, 0));
				const tvaAmount = totalHT * 0.18;
				const totalTTC = Number(proforma.total_ttc || (totalHT + tvaAmount));

				if (y + 24 + 52 > usableBottomY) {
					doc.addPage();
					drawHeader();
					drawFooter();
					y = 42;
					drawTableHeader(y);
					y += 9;
				}

				const drawTotalLine = (label: string, value: number) => {
					doc.setDrawColor(0, 0, 0);
					doc.setLineWidth(0.2);
					doc.rect(xRef, y, colRef + colDesignation + colUnitPrice + colQuantity, 8);
					doc.rect(xTotal, y, colTotal, 8);
					doc.setFont("helvetica", "bold");
					doc.text(label, xTotal - 2, y + 5.3, { align: "right" });
					doc.text(formatAmount(value), margin + tableWidth - 2, y + 5.3, { align: "right" });
					doc.setFont("helvetica", "normal");
					y += 8;
				};

				drawTotalLine("TOTAL HT", totalHT);
				drawTotalLine("TVA (18%)", tvaAmount);
				drawTotalLine("TOTAL TTC", totalTTC);

				y += 16;
				if (y + 35 > usableBottomY) {
					doc.addPage();
					drawHeader();
					drawFooter();
					y = 70;
				}

				doc.setFont("helvetica", "normal");
				doc.setFontSize(11);
				doc.text("Le Directeur général", pageWidth - margin, y, { align: "right" });
				y += 35;
				doc.setFont("helvetica", "bold");
				doc.text("Éliké MISSIAMEY", pageWidth - margin, y, { align: "right" });

				const safeReference = (proforma.reference || "proforma").replace(/[^a-zA-Z0-9-_]/g, "_");
				doc.save(`proforma-${safeReference}.pdf`);
			} catch (error) {
				console.error("Erreur lors du téléchargement du PDF", error);
				useAlert().showAlert("Une erreur est survenue lors de la génération du PDF", "error");
			}
		},

		async delete(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.PROFORMA_BY_ID, id));

				this.proforma = this.proforma.filter((p) => p.id !== id);
			} catch (error) {
				console.error("Erreur lors de la suppression de la proforma", error);
				throw error;
			}
		},

		cleanStorage() {
			this.proforma = [];
			this.isLoading = false;
			this.isSaving = false;
			this.validationErrors = {};
		}
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: "proforma-store",
		// Optionnel : choisir quelles propriétés persister
		pick: ["proforma"],
	},
});
