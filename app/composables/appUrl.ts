export const AppUrl = {
	// Url Publiques
	HOME: "/",
	LOGIN: "/auth/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",

	// Tout le reste a besoin d'authentification
	DASHBOARD: "/dashboard",
	WELCOME: "/welcome",
	ABOUT: "/about",
	CLIENTS: "/clients",
	ORDERS: "/orders",
	QUOTES: "/quotes",
	INVOICES: "/invoices",
	TENDERS: "/tenders",
	SUPPLIERS: "/suppliers",
	SALES: "/sales",
	FOLLOWUP: "/followup",
	USERS: "/users",
	TENDERS_DOCUMENTS: "/tenders/documents",
	TENDERS_SUBMISSIONS: "/tenders/submissions",
	TENDERS_PROJECTS: "/tenders/projects",
	SUPPLIERS_CONTACTS: "/suppliers/contacts",
	SUPPLIERS_COMMANDS: "/suppliers/commands",
	SUPPLIERS_CONTRACTS: "/suppliers/contracts",
	SUPPLIERS_DOCUMENTS: "/suppliers/documents",
	SUPPLIERS_INVOICES: "/suppliers/invoices",
	SUPPLIERS_EVALUATIONS: "/suppliers/evaluations",
	MAINTENANCE_TICKETS: "/maintenance/tickets",
	MAINTENANCE_PLANNING: "/maintenance/planning",
	MAINTENANCE_EQUIPMENTS: "/maintenance/equipements",
	MAINTENANCE_CONTRACTS: "/maintenance/contracts",
	MAINTENANCE_REPORTS: "/maintenance/reports",
	MAINTENANCE_DASHBOARD: "/Maintenance/dashboard",

	MAINTENANCE_SAVE_EQUIPMENT: "/Maintenance/SaveEquipment",
	MAINTENANCE_CUSTOMER_FILE: "/Maintenance/CustomerFile",
	MAINTENANCE_MANAGEMENT_CONTRACT_MAINTENANCE: "/Maintenance/ManagementContractMaintenance",
	MAINTENANCE_ADD_TECHNICIAN: "/Maintenance/AddTechnician",
	MAINTENANCE_MANAGEMENT_INVOICES: "/Maintenance/ManagementInvoice",
	MAINTENANCE_REPORTING: "/Maintenance/Reporting",
	MAINTENANCE_REPORTING_BREAK: "/Maintenance/ReportBreak",
	MAINTENANCE_ADD_CUSTOMER: "/Maintenance/AddCustomer",
	MAINTENANCE_MANAGEMENT_INVOICE: "/Maintenance/ManagementInvoice",
	MAINTENANCE_QUOTE: "/Maintenance/Quote",
	MAINTENANCE_TEST: "/Maintenance/test-intervention",


	// Partie gestion de stocks

	DASHBOARD_STOCK: "/gestion-stock/dashboard",
	PRODUCTS_STOCK: "/gestion-stock/products",
	PURSHASE_ORDERS_STOCK: "/gestion-stock/purshase-orders",
	RECEIVING_BATCHES_STOCK: "/gestion-stock/receiving-batches",
	SALE_STOCK: "/gestion-stock/sale",
	SUPPLIERS_STOCK: "/gestion-stock/suppliers",
	SUPPLIER_PRICES_STOCK: "/gestion-stock/supplier-prices",



	// Maintenance Et Contrat
	DASHBOARD_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/dashboard",
	CUSTOMERS_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/customers",
	EQUIPMENT_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/equipments",
	CONTRACTS_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/contracts",
	INVOICES_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/invoices",
	TECHNICIANS_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/technicians",
	QUOTES_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/quotes",
	REPORTING_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/reporting",
	CUSTOMER_FILE_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/customer-file",
	BREAKDOWNS_MAINTENANCE_ET_CONTRACT: "/maintenance-et-contrat/breakdowns",




	// TENDERS
	TENDERS_TASK_FORM: "tenders/task-form"
} as const;