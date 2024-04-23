import express from 'express';
const router = express.Router();


router.get("/login", (req, res) =>{
  res.render("login")
})


router.get("/register", (req, res)=>{
  res.render("register");
})

router.get("/current", (req, res)=>{
  res.render("current");
})

router.get("/products", (req, res) =>{
  res.render("realTimeProducts")
})


export default router;