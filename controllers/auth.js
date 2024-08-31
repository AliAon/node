const User = require("../models/user");
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.postLogin = async(req, res, next) => {
  const {email,password,confirmPassword}=req.body
  const user = await User.findOne({
    where:{email:email}
  })
  console.log("user",user)
  // if not exist
  if(!user){
    return res.redirect("/login");
  }
 const isPassword=await bcrypt.compare(password,user.password)
 if(!isPassword){
  return res.redirect("/login");
 }
 req.session.isLoggedin=true
 req.session.user=user


  // res.setHeader('Set-Cookie', 'isLoggedin=true'); // Set the cookie when the user logs in
  res.redirect("/");
};


exports.getLogin = async(req, res, next) => {
  const isLoggedin = req.session.isLoggedin
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticate: isLoggedin
  });
};


exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticate: false

  });
};

exports.postSignup = async(req, res, next) => {
  const {email,password,confirmPassword}=req.body
  const hashedpassword= await bcrypt.hash(password,saltRounds)
  const user = await User.findOne({
    where:{email:email}
  })
  //if exist
  if(user){
    res.redirect("/login");
  }

  //if not exist
  if(!user){
     User.create({
        email:email,
        password:hashedpassword
    }).then((response)=>{
      response.createCart()
      res.redirect("/login");
    }).catch((err)=>{
      console.log('err',err)
    })
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(()=>{
    res.redirect("/login");
  })
  // res.setHeader('Set-Cookie', 'isLoggedin=true'); // Set the cookie when the user logs in
};
