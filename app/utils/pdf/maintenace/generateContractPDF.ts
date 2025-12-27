import { getClientDisplayName, type Client } from "~/models/Client";
import type { Contract } from "~/models/Contract";
import { formatDate } from "@/utils/dateParser";

export const generateContractPDF = (contract: Contract, client: Client) => {
	const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Contrat de Maintenance #${contract.reference_number}</title>
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

                .header {
                    text-align: center;
                    padding: 40px 0;
                    border-bottom: 2px solid #2d3748;
                    margin-bottom: 30px;
                }

                .header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 10px;
                }

                .header .reference {
                    font-size: 16px;
                    color: #4a5568;
                    font-weight: 500;
                }

                .parties {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                }

                .party {
                    flex: 1;
                }

                .party:first-child {
                    margin-right: 40px;
                }

                .party h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #2d3748;
                    border-bottom: 1px solid #cbd5e0;
                    padding-bottom: 5px;
                }

                .party p {
                    margin-bottom: 8px;
                    color: #4a5568;
                }

                .contract-details {
                    margin: 30px 0;
                    padding: 25px;
                    background: #fffaf0;
                    border-left: 4px solid #ed8936;
                    border-radius: 4px;
                }

                .contract-details h2 {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #2d3748;
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }

                .detail-item {
                    padding: 12px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }

                .detail-label {
                    font-size: 12px;
                    color: #718096;
                    font-weight: 500;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }

                .detail-value {
                    font-size: 14px;
                    color: #2d3748;
                    font-weight: 600;
                }

                .services-section {
                    margin: 30px 0;
                }

                .services-section h2 {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #2d3748;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 8px;
                }

                .services-content {
                    background: #f7fafc;
                    padding: 20px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    white-space: pre-line;
                    line-height: 1.8;
                }

                .interventions-section {
                    margin: 30px 0;
                }

                .interventions-section h2 {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #2d3748;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 8px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 12px;
                }

                th {
                    background: #2d3748;
                    color: white;
                    padding: 12px 8px;
                    text-align: left;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                td {
                    padding: 10px 8px;
                    border-bottom: 1px solid #e2e8f0;
                }

                tr:nth-child(even) {
                    background: #f8fafc;
                }

                .signatures {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 60px;
                    padding-top: 30px;
                    border-top: 2px solid #e2e8f0;
                }

                .signature-block {
                    text-align: center;
                    flex: 1;
                }

                .signature-block:first-child {
                    margin-right: 40px;
                }

                .signature-line {
                    border-top: 1px solid #2d3748;
                    margin: 40px 0 10px 0;
                }

                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    color: #718096;
                    font-size: 12px;
                }

                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .status-active { background: #c6f6d5; color: #276749; }
                .status-pending { background: #fefcbf; color: #744210; }
                .status-expired { background: #fed7d7; color: #c53030; }

                @media print {
                    body {
                        padding: 20px;
                    }
                    .header {
                        padding: 30px 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="letter-container">
                <div class="header">
                    <h1>CONTRAT DE MAINTENANCE INFORMATIQUE</h1>
                    <div class="reference">Référence: ${
											contract.reference_number
										}</div>
                </div>

                <div class="parties">
                    <div class="party">
                        <h3>LE PRESTATAIRE</h3>
                        <p><strong>Votre Société de Maintenance</strong></p>
                        <p>Adresse: 123 Rue de la Technologie</p>
                        <p>75001 Paris, France</p>
                        <p>Téléphone: +33 1 23 45 67 89</p>
                        <p>Email: contact@votresociete.fr</p>
                        <p>SIRET: 123 456 789 00012</p>
                    </div>

                    <div class="party">
                        <h3>LE CLIENT</h3>
                        <p><strong>${getClientDisplayName(client)}</strong></p>
                        <p>Contact: ${contract.contact}</p>
                        ${
													client.address
														? `<p>Adresse: ${client.address}</p>`
														: ""
												}
                        ${
													client.phone
														? `<p>Téléphone: ${client.phone}</p>`
														: ""
												}
                        ${client.email ? `<p>Email: ${client.email}</p>` : ""}
                    </div>
                </div>

                <div class="contract-details">
                    <h2>DÉTAILS DU CONTRAT</h2>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">Formule</div>
                            <div class="detail-value" style="text-transform: capitalize;">${
															contract.formula
														}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Période</div>
                            <div class="detail-value">${formatDate(
															contract.start_date
														)} au ${formatDate(contract.end_date)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Montant</div>
                            <div class="detail-value">${
															contract.amount
														} FCFA</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Fréquence</div>
                            <div class="detail-value" style="text-transform: capitalize;">${
															contract.frequency
														}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Statut</div>
                            <div class="detail-value">
                                <span class="status-badge ${
																	contract.status === "actif"
																		? "status-active"
																		: contract.status === "en_attente"
																		? "status-pending"
																		: "status-expired"
																}">
                                    ${getStatusText(contract.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="services-section">
                    <h2>PRESTATIONS INCLUSES</h2>
                    <div class="services-content">
                        ${contract.services.replace(/\n/g, "<br>")}
                    </div>
                </div>

                ${
									contract.interventions && contract.interventions.length > 0
										? `
                <div class="interventions-section">
                    <h2>CALENDRIER DES INTERVENTIONS</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${contract.interventions
															.map(
																(intervention) => `
                                <tr>
                                    <td><strong>${formatDate(
																			intervention.date
																		)}</strong></td>
                                    <td style="text-transform: capitalize;">${
																			intervention.type
																		}</td>
                                    <td>${intervention.description}</td>
                                    <td>
                                        <span class="status-badge ${
																					intervention.status === "done"
																						? "status-active"
																						: intervention.status === "planned"
																						? "status-pending"
																						: "status-expired"
																				}">
                                            ${getInterventionStatusText(
																							intervention.status
																						)}
                                        </span>
                                    </td>
                                </tr>
                            `
															)
															.join("")}
                        </tbody>
                    </table>
                </div>
                `
										: ""
								}

                ${
									contract.notes
										? `
                <div class="services-section">
                    <h2>NOTES IMPORTANTES</h2>
                    <div class="services-content" style="background: #fed7d7; border-left: 4px solid #c53030;">
                        ${contract.notes.replace(/\n/g, "<br>")}
                    </div>
                </div>
                `
										: ""
								}

                <div class="signatures">
                    <div class="signature-block">
                        <p>Pour le Prestataire</p>
                        <div class="signature-line"></div>
                        <p>Nom et signature</p>
                        <p>Fait à Paris, le ${new Date().toLocaleDateString(
													"fr-FR"
												)}</p>
                    </div>

                    <div class="signature-block">
                        <p>Pour le Client</p>
                        <div class="signature-line"></div>
                        <p>Nom et signature</p>
                        <p>Cachet et date</p>
                    </div>
                </div>

                <div class="footer">
                    <p>Document généré le ${new Date().toLocaleDateString(
											"fr-FR",
											{
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											}
										)}</p>
                    <p>Ce document a une valeur contractuelle</p>
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
	}
};

export const getStatusText = (status: string): string => {
	const statusMap = {
		active: "Actif",
		pending: "En attente",
		inactive: "Inactif",
		expired: "Expiré",
	} as Record<string, string>;
	return statusMap[status] || status;
};

export const getInterventionStatusText = (status: string): string => {
	const statusMap = {
		planned: "Planifié",
		done: "Effectué",
		urgent: "Urgent",
		canceled: "Annulé",
	} as Record<string, string>;
	return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
	const colorMap = {
		active: '#48bb78',
		pending: '#4f83c8ff',
		inactive: '#a0aec0',
		expired: '#f56565'
	} as Record<string, string>;
	return colorMap[status] || '#a0aec0';
}
