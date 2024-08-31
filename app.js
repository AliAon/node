const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session=require('express-session')
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const sequelize=require("./util/database");
const Product = require('./models/product');
const User=require("./models/user");
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store:new SequelizeStore({
        db:sequelize
    })
}))



//Set Current User
app.use(async(req,res,next)=>{
  const user=await User.findByPk(1)
  req.user=user
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);

//Relationships

//Product
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
User.hasMany(Product)

//Cart
Cart.belongsTo(User)
User.hasOne(Cart)
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})

//Order
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{through:OrderItem})


sequelize
.sync().then(()=>{
    app.listen(3000);
})

.catch((err)=>{
    console.log(err)

})


