const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  const isLoggedin = req.session.isLoggedin
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticate:isLoggedin

  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = await req.user.createProduct({
    title,
    imageUrl,
    price,
    description,
  });
  console.log("product", product);
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save();
  res.redirect("/");
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  const isLoggedin = req.session.isLoggedin
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  const product = await Product.findByPk(prodId);
  if (!product) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product: product,
    isAuthenticate:isLoggedin

    
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.imageUrl = updatedImageUrl),
        (product.description = updatedDesc);
      return product.save();
    })
    .catch((err) => {
      console.log("err", err);
    });
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  const isLoggedin = req.session.isLoggedin
  const products = await Product.findAll();
  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products",
    isAuthenticate:isLoggedin

  });
};

exports.postDeleteProduct = async(req, res, next) => {
  const prodId = req.body.productId;
  const product= await Product.findByPk(prodId);
  product.destroy()
  res.redirect("/admin/products");
};
