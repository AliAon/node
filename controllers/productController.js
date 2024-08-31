const Product = require("../models/products");
exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.pug'));
  res.render("add-product.pug");
};

exports.addProduct = (req, res, next) => {
  console.log(req.body);
  const product=new Product(req.body.title)
  product.save()
  res.redirect("/");
};

exports.getProducts= (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.pug'));
    const products=Product.fetchAll()
    res.render('shop.pug',{prods:products})
  }
