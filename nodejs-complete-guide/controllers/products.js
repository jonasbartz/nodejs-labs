const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
  }

  exports.postAddProducts = (req, res, next) => {
    const product = new Product(req.body.title);
    console.log(req.body.pageTitle);
    product.save();
    res.redirect('/');
  }

  exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();
    console.log(products);
    res.render('shop', {
      pageTitle: 'Shop',
      prods: products,
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  }