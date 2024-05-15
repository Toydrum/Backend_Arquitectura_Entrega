import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},

	lastname: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	age: {
		type: Number,
		required: true,
	},
	rol:{
		type: String,
		enum: ["admin", "user", "premium"],
		default: "user"
	},

	resetToken:{
		token: String,
		expire: Date
	},

	cart: {
		type: mongoose.Schema.Types.ObjectId,
				ref: "carts",
				required: true,
	}
});

userSchema.pre('findOne', function (next){
	this.populate(['cart', {path:'cart', populate: {path:'products.product'}}]);
	
	next();
})

const UserModel = mongoose.model("user", userSchema);

export default UserModel;