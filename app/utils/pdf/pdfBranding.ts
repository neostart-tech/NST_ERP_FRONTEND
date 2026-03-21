import {jsPDF} from "jspdf";

export interface CompanyFooterInfo {
	companyName: string;
	companyAddress: string;
	companyPhone: string;
	companyEmail: string;
	companyRccm: string;
	companyNif: string;
	companyCnss: string;
	companyFiscalReg: string;
	companyBankName: string;
	companyBankAccount: string;
}

const parseEnv = (value: unknown, fallback: string) => {
	const raw = String(value ?? "").trim();
	if (!raw) return fallback;
	return raw.replace(/^['\"]|['\"]$/g, "").trim();
};

export const getCompanyFooterInfo = (): CompanyFooterInfo => ({
	companyName: parseEnv(import.meta.env.VITE_COMPANY_NAME, "Neo Start Technology"),
	companyAddress: parseEnv(import.meta.env.VITE_COMPANY_ADDRESS, "NST, Quartier Totsi, non-loin de l'agence Yas Totsi"),
	companyPhone: parseEnv(import.meta.env.VITE_COMPANY_PHONE, "+228 90 42 20 20"),
	companyEmail: parseEnv(import.meta.env.VITE_COMPANY_EMAIL, "contact@neostart.tech"),
	companyRccm: parseEnv(import.meta.env.VITE_COMPANY_RCCM, "TG-LFW-012024-B13-00028"),
	companyNif: parseEnv(import.meta.env.VITE_COMPANY_NIF, "1001898766"),
	companyCnss: parseEnv(import.meta.env.VITE_COMPANY_CNSS, "181951"),
	companyFiscalReg: parseEnv(import.meta.env.VITE_COMPANY_FISC_REG, "Reel avec TVA"),
	companyBankName: parseEnv(import.meta.env.VITE_COMPANY_BANK_NAME, "African Lease Togo"),
	companyBankAccount: parseEnv(import.meta.env.VITE_COMPANY_BANK_ACCOUNT, "002008040132-35")
});

export const drawPdfLogo = (
	doc: jsPDF,
	logoDataUrl: string | null,
	options: { margin: number; y: number; width: number; height: number }
) => {
	if (!logoDataUrl) return;
	const logoType = logoDataUrl.includes("image/png") ? "PNG" : "JPEG";
	try {
		doc.addImage(logoDataUrl, logoType, options.margin, options.y, options.width, options.height);
	} catch {
		// Ignore logo rendering issues and continue PDF generation.
	}
};

export const drawPdfFooter = (
	doc: jsPDF,
	options: {
		margin: number;
		pageWidth: number;
		footerTopY: number;
		companyInfo: CompanyFooterInfo;
	}
) => {
	const {margin, pageWidth, footerTopY, companyInfo} = options;
	const blueLineWidth = pageWidth * 0.2;
	const lineStep = 3.6;
	const textStartY = footerTopY + 3.8;

	doc.setDrawColor(37, 99, 235);
	doc.setLineWidth(0.8);
	doc.line(margin, footerTopY, margin + blueLineWidth, footerTopY);

	doc.setTextColor(17, 24, 39);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(7.4);

	const drawLabelValue = (x: number, yPos: number, label: string, value: string) => {
		doc.setFont("helvetica", "normal");
		doc.text(label, x, yPos);
		const labelWidth = doc.getTextWidth(label);
		doc.setFont("helvetica", "bold");
		doc.text(value, x + labelWidth, yPos);
	};

	const drawLabeledChunks = (x: number, yPos: number, chunks: Array<{ label: string; value: string }>) => {
		let cursorX = x;
		chunks.forEach((chunk, index) => {
			doc.setFont("helvetica", "normal");
			doc.text(chunk.label, cursorX, yPos);
			cursorX += doc.getTextWidth(chunk.label);
			doc.setFont("helvetica", "bold");
			doc.text(chunk.value, cursorX, yPos);
			cursorX += doc.getTextWidth(chunk.value);
			if (index < chunks.length - 1) {
				doc.setFont("helvetica", "normal");
				doc.text(" | ", cursorX, yPos);
				cursorX += doc.getTextWidth(" | ");
			}
		});
	};

	doc.setFont("helvetica", "bold");
	doc.text(companyInfo.companyName, margin, textStartY);

	drawLabeledChunks(margin, textStartY + lineStep, [
		{label: "Adresse: ", value: companyInfo.companyAddress},
		{label: "Tel: ", value: companyInfo.companyPhone},
		{label: "Email: ", value: companyInfo.companyEmail}
	]);

	drawLabeledChunks(margin, textStartY + (lineStep * 2), [
		{label: "RCCM: ", value: companyInfo.companyRccm},
		{label: "NIF: ", value: companyInfo.companyNif},
		{label: "CNSS: ", value: companyInfo.companyCnss},
		{label: "Regime: ", value: companyInfo.companyFiscalReg}
	]);

	doc.setFont("helvetica", "normal");
	doc.text("COORDONNEES BANCAIRES (", margin, textStartY + (lineStep * 3));
	const leftPartWidth = doc.getTextWidth("COORDONNEES BANCAIRES (");
	doc.setFont("helvetica", "bold");
	doc.text(companyInfo.companyBankName, margin + leftPartWidth, textStartY + (lineStep * 3));
	const bankNameWidth = doc.getTextWidth(companyInfo.companyBankName);
	doc.setFont("helvetica", "normal");
	doc.text(")", margin + leftPartWidth + bankNameWidth, textStartY + (lineStep * 3));

	drawLabelValue(margin, textStartY + (lineStep * 4), "N° de compte: ", companyInfo.companyBankAccount);
};
