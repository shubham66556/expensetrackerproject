const Sequelize=require('sequelize')

const sequelize= new Sequelize('expensetracker','root','Bharuchcity6@',{
    dialect:'mysql',
    host:'localhost'
})



module.exports=sequelize;