import {Schema, model} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
		type: Number,
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
	owner: {
		type: Schema.Types.ObjectId,
		ref: "user",
		default: 'admin',
	},
	thumbnails: {
		type: [String],
	},
});

productsSchema.pre('findOne', function (next){
	this.populate('owner');
	next();
})

productsSchema.plugin(mongoosePaginate);

const ProductModel = model("products", productsSchema);

export default ProductModel;