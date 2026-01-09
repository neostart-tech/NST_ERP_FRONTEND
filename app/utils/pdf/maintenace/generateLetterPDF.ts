import Swal from "sweetalert2";
import { getClientName, type Client } from "~/models/Client";
import type { Letter } from "~/models/Contract";
import { formatDate } from "@/utils/dateParser";

export const generateLetterPDF = (letterData: Letter, client: Client) => {
	const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Proposition de Contrat de Maintenance</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    color: #2d3748;
                    background: #ffffff;
                    padding: 40px 30px;
                    font-size: 14px;
                }

                .letter-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border: 1px solid #e2e8f0;
                }

                .letterhead {
                    text-align: center;
                    padding: 40px 0;
                    border-bottom: 2px solid #2d3748;
                    margin-bottom: 30px;
                }

                .letterhead h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 10px;
                }

                .letterhead .subtitle {
                    font-size: 16px;
                    color: #4a5568;
                }

                .address-section {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                }

                .date-section {
                    text-align: right;
                    margin-bottom: 20px;
                    color: #4a5568;
                }

                .subject {
                    font-weight: 600;
                    font-size: 16px;
                    margin: 25px 0;
                    color: #2d3748;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .letter-body {
                    line-height: 1.8;
                }

                .proposal-summary {
                    background: #fffaf0;
                    padding: 25px;
                    margin: 25px 0;
                    border-left: 4px solid #ed8936;
                    border-radius: 4px;
                }

                .proposal-summary h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #2d3748;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }

                .summary-item {
                    padding: 12px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }

                .summary-label {
                    font-size: 12px;
                    color: #718096;
                    font-weight: 500;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }

                .summary-value {
                    font-size: 14px;
                    color: #2d3748;
                    font-weight: 600;
                }

                .section {
                    margin: 25px 0;
                    padding: 20px;
                    background: #f7fafc;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }

                .section h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #2d3748;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 8px;
                }

                .section-content {
                    background: white;
                    padding: 15px;
                    border-radius: 4px;
                    white-space: pre-line;
                    line-height: 1.8;
                }

                .interventions-list {
                    margin: 20px 0;
                }

                .intervention-item {
                    padding: 12px;
                    margin: 8px 0;
                    background: white;
                    border-radius: 4px;
                    border-left: 4px solid #4299e1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .intervention-date {
                    font-weight: 600;
                    color: #2d3748;
                }

                .intervention-details {
                    color: #4a5568;
                }

                .signature-section {
                    margin-top: 50px;
                    padding: 30px;
                    background: #f8fafc;
                    border-radius: 8px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                }

                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    color: #718096;
                    font-size: 12px;
                }

                @media print {
                    body {
                        padding: 20px;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #000;
                    background: #fff;
                    -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .letter-container {
                        border: none;
                        box-shadow: none;
                    }

                    .letterhead {
                        padding: 30px 0;
                    }

                    .section {
                        background: #f5f5f5 !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .proposal-summary {
                        background: #fffaf0 !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .address-section {
                        background: #f8f8f8 !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .signature-section {
                        background: #f8f8f8 !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .summary-item, .section-content, .intervention-item {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }

                    .page-break {
                        page-break-before: always;
                    }

                    .no-print {
                        display: none;
                    }

                    .print-only {
                        display: block;
                    }
                }

                .print-only {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="letter-container">
                <div class="letterhead">
                    <h1>PROPOSITION DE CONTRAT DE MAINTENANCE</h1>
                    <div class="subtitle">Votre partenaire informatique de confiance</div>
                </div>

                <div class="address-section">
                    <strong>À l'attention de:</strong><br>
                    ${getClientName(client)}<br>
                    ${letterData.clientContact || client.email || ""}<br>
                    ${client.address || ""}
                </div>

                <div class="date-section">
                    Fait à Paris, le ${new Date().toLocaleDateString("fr-FR", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
                </div>

                <div class="subject">
                    Objet: Proposition de contrat de maintenance informatique
                </div>

                <div class="letter-body">
                    <p style="margin-bottom: 20px;">${letterData.preamble}</p>

                    <div class="proposal-summary">
                        <h3>RÉSUMÉ DE LA PROPOSITION</h3>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <div class="summary-label">Type de contrat</div>
                                <div class="summary-value">${
																	letterData.contractType === "main_oeuvre"
																		? "Main d'œuvre"
																		: "Pièces et main d'œuvre"
																}</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">Formule</div>
                                <div class="summary-value" style="text-transform: capitalize;">${
																	letterData.formula
																}</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">Montant</div>
                                <div class="summary-value">${
																	letterData.amount || "À définir"
																} FCFA</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">Fréquence</div>
                                <div class="summary-value" style="text-transform: capitalize;">${
																	letterData.frequency
																}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h3>PRESTATIONS INCLUSES</h3>
                        <div class="section-content">
                            ${letterData.includedServices.replace(
															/\n/g,
															"<br>"
														)}
                        </div>
                    </div>

                    <div class="section">
                        <h3>ENGAGEMENTS DU PRESTATAIRE</h3>
                        <div class="section-content">
                            ${letterData.providerCommitments.replace(
															/\n/g,
															"<br>"
														)}
                        </div>
                    </div>

                    <div class="section">
                        <h3>ENGAGEMENTS DU CLIENT</h3>
                        <div class="section-content">
                            ${letterData.clientCommitments.replace(
															/\n/g,
															"<br>"
														)}
                        </div>
                    </div>

                    ${
											letterData.equipmentDetails
												? `
                    <div class="section">
                        <h3>PARC INFORMATIQUE CONCERNÉ</h3>
                        <div class="section-content">
                            ${letterData.equipmentDetails.replace(
															/\n/g,
															"<br>"
														)}
                        </div>
                    </div>
                    `
												: ""
										}

                    ${
											letterData.interventions &&
											letterData.interventions.filter((i) => i.date).length > 0
												? `
                    <div class="section">
                        <h3>CALENDRIER DES INTERVENTIONS PRÉVISIONNEL</h3>
                        <div class="interventions-list">
                            ${letterData.interventions
															.filter((i) => i.date)
															.map(
																(intervention) => `
                                <div class="intervention-item">
                                    <span class="intervention-date">${formatDate(
																			intervention.date
																		)}</span>
                                    <span class="intervention-details">${
																			intervention.type
																		} - ${intervention.description}</span>
                                </div>
                            `
															)
															.join("")}
                        </div>
                    </div>
                    `
												: ""
										}

                    <div class="signature-section">
                        <p style="margin-bottom: 20px;">Dans l'attente de votre retour, nous restons à votre disposition pour toute information complémentaire.</p>
                        <p>
                            <strong>Veuillez agréer, Monsieur/Madame, l'expression de nos salutations distinguées.</strong><br><br>
                            <strong style="font-size: 16px; color: #2d3748;">L'Équipe de Maintenance Informatique</strong><br>
                            <em>Votre Société de Maintenance</em>
                        </p>
                    </div>
                </div>

                <div class="footer">
                    <p>Votre Société de Maintenance - 123 Rue de la Technologie - 75001 Paris - Tél: +33 1 23 45 67 89</p>
                    <p>SIRET: 123 456 789 00012 - Document confidentiel</p>
                    <p class="print-only">Document généré le ${new Date().toLocaleDateString(
											"fr-FR"
										)}</p>
                </div>
            </div>
        </body>
        </html>
      `;

	// Ouverture d'une nouvelle fenêtre pour l'impression
	const printWindow = window.open("", "_blank", "width=1000,height=800");
	if (printWindow) {
		printWindow.document.write(content);
		printWindow.document.close();

		// Impression après le chargement
		printWindow.onload = () => {
			setTimeout(() => {
				printWindow.print();
			}, 500);
		};
	} else {
		Swal.fire({
			icon: "error",
			title: "Une erreur est survenue lors de l'impression",
		});
	}
};

