const { Sequelize } = require('sequelize');
const sequelize=new Sequelize('node-complete','root','ngzBR931C7iX',{
    host: 'localhost',
    dialect:'mysql'
})
module.exports=sequelize