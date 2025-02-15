const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;


const postSchema=mongoose.Schema({
   title:{
        type:String,
        required:true
    },
  ldescription:{
    type:String,
  },
  xdescription:{
    type:String,
  },
  fdescription:{
    type:String,
  },
  hashtags:
  {
    type:String,
  },
    youtube:[
       {
           type:String
       }
     ],
  
    image:{
        type:String,
        required:true
    },
   
    
});

mongoose.model("PostModel",postSchema);