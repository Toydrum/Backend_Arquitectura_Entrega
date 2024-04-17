import mongoose from "mongoose"

const database = mongoose.connect("mongodb+srv://CoderHouse:CoderHouse@cluster0.vbr08oz.mongodb.net/Ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conectados a la BD"))
    .catch((error) => console.log("Error:", error))

    export default  database;