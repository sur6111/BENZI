const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const {MONGODB_URL}=require('./config');

const PORT = 4000;

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL)

mongoose.connection.on('connected',()=>{
    console.log("db connected")
});

mongoose.connection.on("error",(Error)=>{
    console.log("some error while connectng database");
})




require('./models/user');
require('./models/tweet');



app.use(cors());
app.use(express.json());

app.use(require('./rourtes/user_route'));
app.use(require('./rourtes/tweet_route'));
app.use(require('./rourtes/auth_route'));

// app.get('/get',(req,res)=>{
//     res.status(200).json({"msg":"hello Shadab"})
// })


app.listen(7001,()=>{
    console.log("server has started");
});

