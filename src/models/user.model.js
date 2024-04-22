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
		enum: ["admin", "user"],
		default: "user"
	},

	cart: Object
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;