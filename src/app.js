import express from "express";
import database from "./database.js";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import manejadorErrores from "./middleware/error.js";
import addLogger from "./services/loggers/logger.js";



//Rutes
import productsRouter from './routers/products.router.js';
import cartsRouter from'./routers/carts.router.js'; 
import usersRouter from './routers/users.router.js';
import viewsRouter from './routers/views.router.js';




const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( "./src/public"));
app.use(cookieParser());
app.use(passport.initialize());
app.use(addLogger);
initializePassport();

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutes
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);
app.use("/views",viewsRouter)

//middleware para errores
app.use(manejadorErrores);





const httpServer = app.listen(8080, () => {
	console.log("Escuchando al puerto 8080");
});
