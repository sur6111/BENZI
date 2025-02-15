const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{
        type:String
        // required:true
    },
    username:{
        type:String
        // required:true
    },
    email:{
        type:String
        // required:true
    },
    password:{
       type:String
    //    required:true 
    },
    profilepicture:{
        type:String
     },
    location:{
        type:String
    },
    role:{
        type:String
        
    },
    
})
    
mongoose.model("UserModel",userSchema);
   
    

    
