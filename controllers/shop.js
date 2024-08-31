const Product = require("../models/product");
const Cart = require("../models/cart");
const { Where } = require("sequelize/lib/utils");
const { where } = require("sequelize");

exports.getProducts = async (req, res, next) => {
  const products = await Product.findAll();
  const isLoggedin = req.session.isLoggedin
  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products",
    isAuthenticate:isLoggedin

  });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const isLoggedin = req.session.isLoggedin
  const product = await Product.findByPk(prodId);
  res.render("shop/product-detail", {
    product: product,
    pageTitle: product.title,
    path: "/products",
    isAuthenticate:isLoggedin

  });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.findAll();
  const isLoggedin = req.session.isLoggedin
  console.log('session',req.session.user)
  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    isAuthenticate:isLoggedin

  });
};

exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  const isLoggedin = req.session.isLoggedin  
  const cartProducts = await cart.getProducts();
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: cartProducts,
    isAuthenticate:isLoggedin

  });

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  const products = await cart.getProducts({ where: { id: prodId } });
  let product;
  if (products.length > 0) {
    product = products[0];
  }
  let newquantity = 1;
  if (product) {
    const oldquantity = product.cartItem.quantity;
    newquantity = oldquantity + 1;
    await cart.addProduct(product, {
      through: {
        quantity: newquantity,
      },
    });
    return res.redirect("/cart");
  }
  const productdb = await Product.findByPk(prodId);
  await cart.addProduct(productdb, {
    through: {
      quantity: newquantity,
    },
  });
  return res.redirect("/cart");
};

exports.postCartDeleteProduct = async(req, res, next) => {
  const prodId = req.body.productId;
  const cart = await req.user.getCart();
  const products = await cart.getProducts({ where: { id: prodId } });
  const product = products[0];
  product.cartItem.destroy()
  res.redirect("/cart");
};

exports.postOrder=async(req,res,next)=>{
  try { 
     const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(products.map(product=>{
      product.orderItem={quantity:product.cartItem.quantity}
      return product
    }))
    res.redirect('/orders')
  } catch (error) {
    console.log("error",error)
  }
}


exports.getOrders = async(req, res, next) => {
  const isLoggedin = req.session.isLoggedin  
  const orders = await req.user.getOrders({
    include:['products']
  });
  
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders:orders,
    isAuthenticate:isLoggedin

  });
};

exports.getCheckout = (req, res, next) => {
  const isLoggedin = req.session.isLoggedin
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    isAuthenticate:isLoggedin


  });
};
