const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const colors=require('colors');
const dotenv=require("dotenv");
const connectDB=require('./config/db.js');


dotenv.config();

const userRoutes = require('./routes/userRoutes'); 
const blogRoutes=require('./routes/blogRoutes');



connectDB();

const app=express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/blog',blogRoutes);

const PORT=process.env.PORT || 8080

app.listen(8080,()=>{
    console.log(
        `server Running on ${process.env.DEV_MODE} port no ${PORT}`.bgCyan.white);
});