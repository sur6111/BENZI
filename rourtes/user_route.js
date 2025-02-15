const express = require('express');
const router = express.Router();
const brcyptjs = require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');

const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel')
const protectRoute=require("../middleware/protectResource");
router.post("/createuser", (req, res) => {
    const {  name,username, email, password,profilepicture, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "one or more fields is empty" })
    }
    UserModel.findOne({ email: email })
        .then((userInDB => {
            if (userInDB) {
                return res.status(400).json({ error: "user with this email already exist" })
            }
            brcyptjs.hash(password,16)
                .then((hashedPassword) => {
                    const user = new UserModel({
                         name,username, email, password: hashedPassword,profilepicture,role
                    });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed up Successfully!" });

                        }).catch((err) => {
                            console.log(err);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
        }))
        .catch((error) => {
            console.log(error)
        })

})
router.get("/allusers" ,(req,res)=>{
    UserModel.find().populate("_id name profilepicture")
    .then((dbpost) => {
        res.status(200).json({users:dbpost})
    }).catch((err) => {
        console.log(err);
    })
})
router.delete("/deleteuser/:_id",protectRoute,(req,res)=>{
    UserModel.findOne({_id: req.params._id})
    .populate("email", "_id")
     .exec((error, postFound)=>{
        if(error || !postFound){
        return res.status(400).json({error:"id does't exist"})
        }
      else{
       
            postFound.remove()
            .then((data) => {
                res.status(201).json({result:data});
            }).catch((err) => {
                console.log(err)
        
            });
        }
      
    })
})

//register a user
router.post("/registration", (req, res) => {
    const {  name,username, email, password,profilepicture, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "one or more fields is empty" })
    }
    UserModel.findOne({ email: email })
        .then((userInDB => {
            if (userInDB) {
                return res.status(400).json({ error: "user with this email already exist" })
            }
            brcyptjs.hash(password,16)
                .then((hashedPassword) => {
                    const user = new UserModel({
                         name,username, email, password: hashedPassword,profilepicture,role
                    });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed up Successfully!" });

                        }).catch((err) => {
                            console.log(err);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
        }))
        .catch((error) => {
            console.log(error)
        })

})

router
    .route("/editprofile/:id")
    // Get Single user
    .get((req, res) => {
        UserModel.findById(
            req.params.id,
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data);
                }
            });
    })
 
    // Update Profile Data
    .put((req, res, next) => {
        UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            (error, data) => {
                if (error) {
                  
                    console.log(error);
                } else {
                    res.json(data);
                    console.log("Student updated successfully !");
                }
            }
        );
    });
  //follow a person
    router.put("/follow",protectRoute,(req,res)=>{
        UserModel.findByIdAndUpdate(req.body._id,{
            $push:{follow:req.body._id}
        },
        {
            new:true //returns updates record
        }).populate("_id name profilepicture")
        .exec((error, result)=>{
            if(error){
                return res.status(400).json({error:error})
            }else{
                res.json(result)
            }
        })
    })
    //unfollow a person
    router.put("/unfollow",protectRoute,(req,res)=>{
        UserModel.findByIdAndUpdate(req.body._id,{
            $pull:{follow:req.body._id}
        },
        {
            new:true //returns updates record
        }).populate("_id name profilepicture")
        .exec((error, result)=>{
            if(error){
                return res.status(400).json({error:error})
            }else{
                res.json(result)
            }
        })
    })
    //login 
router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({ error: "one or more fields is empty" })
    }
    UserModel.findOne({email: email})
    .then((userInDB) => {
        if(!userInDB){
        return res.status(401).json({ error: "invalid credential not email" }) 
    }
    brcyptjs.compare(password,userInDB.password)
    .then((didMtach) => {
        if(didMtach){
           const jwtToken=jwt.sign({_id:userInDB._id},JWT_SECRET)
           const userInfo={"name":userInDB.name, "email":userInDB.email,"id":userInDB._id, "profilepicture":userInDB.profilepicture,"role":userInDB.role}
           res.status(200).json({result:{token:jwtToken,user:userInfo}})

            res.status(200).json({result:"user login successfully!"})
        }else{
            return res.status(401).json({ error: "invalid credential" }) 
        }
        
    }).catch((err) => {
        console.log(err)
        
    });
        
    }).catch((err) => {
        console.log(err)
    });
})

module.exports=router;