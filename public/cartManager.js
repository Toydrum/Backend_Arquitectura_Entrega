


let cartProducts = [];
(async () => {
  const userCartId = document.querySelector('.agregar-producto-btn').getAttribute('data-userCart-id');
  console.log(userCartId);
  const cartGet = await fetch(`/carts/${userCartId}`).then(res => res.json());
  
 if(cartGet.products.length === 0){
  cartProducts = [];
  console.log(cartProducts);
 }else{
  cartProducts = cartGet.products;
  console.log(cartProducts);
 }
    
    
})()


const agregarProductoBtns = document.querySelectorAll('.agregar-producto-btn');
agregarProductoBtns.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    
    const productId = e.target.getAttribute('data-product-id');
    const userCartId = e.target.getAttribute('data-userCart-id');
    const productIndex = cartProducts.findIndex(item => item.product._id === productId);
    //console.log(productIndex);  
    if (productIndex !== -1) {
     
      cartProducts[productIndex].quantity += 1;
      //console.log(cartProducts);
      const postProduct = await fetch(`/carts/${userCartId}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartProducts[productIndex]),
    }).then(res => res.json());
    (async () => {
      const userCartId = document.querySelector('.agregar-producto-btn').getAttribute('data-userCart-id');
      console.log(userCartId);
      const cartGet = await fetch(`/carts/${userCartId}`).then(res => res.json());
      
     if(cartGet.products.length === 0){
      cartProducts = [];
      console.log(cartProducts);
     }else{
      cartProducts = cartGet.products;
      console.log(cartProducts);
     }
        
        
    })()
      
      

    } else {
      
      const productAdded = {product: productId, quantity: 1};
      cartProducts.push(productAdded);
      const postProduct = await fetch(`/carts/${userCartId}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(productAdded),
    }).then(res => res.json());
      console.log(postProduct);
      
    }
    
  
     
  
    })
    
});