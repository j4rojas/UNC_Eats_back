const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models').User;
var cors = require('cors');
const corsOptions = {optionsSuccessStatus: 200}

router.get('/user',(req,res)=> {
    User
    .find()
    .then(user => {
        res.json(user.map(user => {
            return {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                userName: user.userName
            };
        }));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error:'something went wrong'});
    });
});

//new User

router.options("/*", function (req,res, next) {
    console.log("options")
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

router.post('/new', cors(corsOptions), (req, res) => {
    const requiredFields = ['firstName', 'lastName','email', 'userName','password'];
    for (let i=0; i<requiredFields.length; i++) {
        const field= requiredFields[i];
        if (!(field in req.body)) {
            console.log(field);
            console.log(req.body);
            const message = `Missing ${field} in request body`
            console.error(message);
            // return res.status(400).send(message);
        }
    }
    console.log(req.body);
    User
        .findOne({email:req.body.email}) 
        .then(userFind => {
            if(userFind) {
                res.status(400).json({message:'User already exist'});
            } 
            else {
                bcrypt.hash(req.body.password,10, function(err, hash) {
                if (err) {

                    res.status(500).json({message: 'Internal server error', data:err});
                    return
                }
                User
                .create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    userName: req.body.userName,
                    password: hash
                })
                .then(user => res.status(201).json(user.serialize()))
                .catch(err => {
                    console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({message:'Internal server error'});
    });
   
});

router.post('/login',cors(),(req,res)=> {
    console.log(req.body.userName);
    User.findOne({userName:req.body.userName}) 
    .then(userFind => {
        if(!userFind) {
            res.status(400).json({message:'User does not exist', error:true});
            return
        } 
        else {
            if(bcrypt.compareSync(req.body.password, userFind.password)){
                var userObj = {
                    id:userFind._id,
                    email:userFind.email,
                    userName:userFind.userName
                }
                var token = jwt.sign(userObj, 'shhhhh');
                res.status(200).json({message:'login details match',token:token});
                return
            } else {
                res.status(402).json({message:'Password does not match', error:true});
                return
            }
        }
    })
    .catch(err => {
        res.status(500).json({message:'Internal server error'});
    })
})
module.exports = router;
