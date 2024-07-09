import express from 'express';
import ViewsController from '../controllers/views.controller.js';
import {jwtDecode} from 'jwt-decode';
import generarUProductos from '../utils/faker.js';
import UserController from '../controllers/user.controller.js';
import CartsRepository from '../repositories/carts.repository.js';
const cartRepository = new CartsRepository();
const viewsController = new ViewsController();



//const userRepository = new UserRepository();
const router = express.Router();


router.get("/login", (req, res) =>{
  res.render("login")
})

router.get("/register", (req, res)=>{
  res.render("register");
})

router.get("/products", (req, res) =>{
  res.render("realTimeProducts")
})

router.get("/mokingproducts", (req,res)=>{
  const products = [];

  for(let i =0; i<10; i++) {
    products.push(generarUProductos());
  };
  console.log(products)
  res.render("mockingProducts", {products: products});
})

router.get("/loggertest", (req,res)=>{
  req.logger.fatal("x_x");
  req.logger.error("error");
  req.logger.warning("warning, check your code");
  req.logger.info("no errors detected");
  req.logger.http("ruta"); 

  res.send("Logs generated")
})

router.get("/reset-password", viewsController.renderResetPassword);


router.get('/confirmation', (req,res)=>{
  res.render('sendConfirmation')
})

router.get("/change-password/:token?", (req,res)=>{
  res.render("passwordChange")
})

router.get("/addProduct", async (req,res)=>{
  try {
    const user = req.cookies["coderCookieToken"];
		const userDecoded = jwtDecode(user);
    const cartId = userDecoded.cart;
   
    const cart = await cartRepository.getCartById(cartId);
    if(cart.products.length === 0){
      return res.redirect("/products")
    }
    const cartF = cart.products = cart.products.map(product => {
      
     const productN = product.product.toObject();
     productN.quantity = product.quantity;
      return productN; 
    });
    const suma = cartF.reduce((acum, product) => {
      return acum + product.price * product.quantity;
    }, 0);
   
   
    res.render("addProduct",  
      {
        user: userDecoded,
        cartSel: cartF,
        cid: cartId,
        total: suma
      });

  } catch (error) {
    console.log(error);
  }
})  

export default router;