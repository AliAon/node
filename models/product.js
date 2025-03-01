const {Sequelize,DataTypes}=require('sequelize')
const sequelize=require('../util/database')
const Product=sequelize.define('product',{
  id:{
    type:DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey:true
  },
  title:{
    type:DataTypes.STRING
  },
  price:{
    type:DataTypes.STRING,
    allowNull:false
  },
  imageUrl:{
    type:DataTypes.STRING,
    allowNull:false
  },
  description:{
    type:DataTypes.STRING,
    allowNull:false

  }

})
module.exports=Product