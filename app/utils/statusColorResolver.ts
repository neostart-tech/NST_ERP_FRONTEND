type Status = "pending" | "delivered" | "canceled";

export const resolveStatusColor = (status: Status) => {
	switch (status) {
		case "pending":
			return "bg-yellow-200 text-yellow-800";
		case "delivered":
			return "bg-green-200 text-green-800";
		case "canceled":
			return "bg-red-200 text-red-800";
		default:
			return "bg-blue-200 text-blue-800";
	}
};
