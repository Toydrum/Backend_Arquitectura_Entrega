import CartsRepository from "../repositories/carts.repository.js";
const cartRepository = new CartsRepository();

class CartController {
  async getCart(req, res){
    try {
        const cartId = req.params.cid;
        //console.log(cartId);
          const cart = await cartRepository.getCartById(cartId)
          res.status(200).json(cart);
    } catch (error) {
      
    }
  }
}


export default CartController;