import {Schema, model} from "mongoose";

//esquema
const productsSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	img: {
		type: String,
	},
	code: {
		type: String,
		required: true,
		unique: true,
	},
	price: {
		type: String,
		required: true,
	},
	stock: {
		type: Number,
	},
	category: {
		type: String,
		required: true,
	},
	status: {
		type: Boolean,
		required: true,
	},
	thumbnails: {
		type: [String],
	},
});

const ProductModel = model("products", productsSchema);

export default ProductModel;