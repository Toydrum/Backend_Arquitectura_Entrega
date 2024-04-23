import { Schema, model } from "mongoose";

const ticketsSchema = new Schema({
	code: {
		type: String,
		unique: true,
	},
	purchaseDate: {
		type: String,
	},
	amount: {
		type: Number,
	},
	purchaser: {
		type: String,
	},
});

const TicketModel = model("tickets", ticketsSchema);

export default TicketModel;
