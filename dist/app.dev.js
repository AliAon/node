"use strict";

var path = require('path');

var express = require('express');

var bodyParser = require('body-parser');

var errorController = require('./controllers/error');

var app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

var adminRoutes = require('./routes/admin');

var shopRoutes = require('./routes/shop');

var sequelize = require("./util/database");

var Product = require('./models/product');

var User = require("./models/user");

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findByPk(1));

        case 2:
          user = _context.sent;
          req.user = user;
          req.next();

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404); //Relationships

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});
User.hasMany(Product);
sequelize.sync().then(function _callee2() {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (User.findByPk(1)) {
            _context2.next = 5;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(User.create({
            name: 'Ali',
            email: 'aon094944@gmail.com'
          }));

        case 3:
          user = _context2.sent;
          return _context2.abrupt("return", user);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}).then(function () {
  console.log("reslut", result);
  app.listen(3000);
})["catch"](function (err) {
  console.log(err);
});