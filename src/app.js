import express from "express";
import database from "./database.js";

//Rutes
import productsRouter from './routers/products.router.js'
import cartsRouter from'./routers/carts.router.js'; 




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( "src/public"));




//Rutes
app.use("/products", productsRouter);
app.use("/carts", cartsRouter)






const httpServer = app.listen(8080, () => {
	console.log("Escuchando al puerto 8080");
});
