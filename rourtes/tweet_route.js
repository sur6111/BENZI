const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostModel = mongoose.model('PostModel')
const protectRoute=require("../middleware/protectResource");
//view all posts
router.get("/allpost",(req,res)=>{
    PostModel.find()
    .populate("tweetBy","_id name profilepicture")
    .then((dbpost) => {
        res.status(200).json({posts:dbpost})
    }).catch((err) => {
        console.log(err);
    });
});

//all post only from logged in user
router.get("/myallpost",protectRoute,(req,res)=>{
    PostModel.find({tweetBy:req.user._id})
    .populate("tweetBy","_id name profilepicture")
    .then((dbpost) => {
        res.status(200).json({posts:dbpost})
    }).catch((err) => {
        console.log(err);
    });
})





//for anything post to tweeter clone app
router.post("/createpost",protectRoute,(req,res)=>{
    const {title,image,youtube,fdescription,ldescription,xdescription,hashtags}=req.body;
    if(!title || !image){
        return res.status(400).json({error:"one or more mandiatrory fields are empty"})
    }
    req.user.password=undefined;

    const postObj=new PostModel({title:title ,image:image ,youtube:youtube,fdescription:fdescription,ldescription:ldescription,xdescription:xdescription,hashtags:hashtags})
    postObj.save()
    .then((newPost) => {
        res.status(201).json({post:newPost});
    }).catch((err) => {
        console.log(err)

    });


})
//for delete post
router.delete("/deletepost/:postId",protectRoute,(req,res)=>{
    PostModel.findOne({_id: req.params.postId})
    .populate("tweetBy", "_id")
     .exec((error, postFound)=>{
        if(error || !postFound){
        return res.status(400).json({error:"post does't exist"})
        }
        if(postFound.tweetBy._id.toString() === req.user._id.toString()){
            postFound.remove()
            .then((data) => {
                res.status(201).json({result:data});
            }).catch((err) => {
                console.log(err)
        
            });
        
        }
    })
})

//for like post
router.put("/like",protectRoute,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },
    {
        new:true //returns updates record
    }).populate("tweetBy","_id name")
    .exec((error, result)=>{
        if(error){
            return res.status(400).json({error:error})
        }else{
            res.json(result)
        }
    })
})
//for retweet post
router.put("/retweet",protectRoute,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $push:{retweet:req.user._id}
    },
    {
        new:true //returns updates record
    }).populate("retweet","_id name")
    .exec((error, result)=>{
        if(error){
            return res.status(400).json({error:error})
        }else{
            res.json(result)
        }
    })
})




//for unlike post
router.put("/unlike",protectRoute,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },
    {
        new:true //returns updates record
    }).populate("tweetBy","_id name")
    .exec((error, result)=>{
        if(error){
            return res.status(400).json({error:error})
        }else{
            res.json(result)
        }
    })
})


//for comment on tweet
router.put("/comment",protectRoute,(req,res)=>{
  const comment={commentText:req.body.commentText,commentedBy:req.user._id}

  PostModel.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true 
  }).populate("comments.commentedBy","_id name")//comment ou=wner
  .exec((error,result)=>{
    if(error){
        return res.status(400).json({error:error})
    }else{
        res.json(result)
    }
  })

})


module.exports=router;
