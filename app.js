const express=require('express')
const path=require('path')
const bodyParser=require('body-parser')

const sequelize=require('./signupbackend/util/database')

const cors=require('cors')

const authRoutes=require('./signupbackend/routes/auth')

const app=express();

app.use(bodyParser.json());



app.use(cors());

app.use('/user',authRoutes);

sequelize.sync()
.then(()=>{
    app.listen(8000)
})
.catch(err=>{
    console.log(err)
})



