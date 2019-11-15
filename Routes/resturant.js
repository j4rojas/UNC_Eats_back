const express = require('express');
const router = express.Router();
const Resturant = require('../models').Resturant;
const jwt = require('jsonwebtoken');
var cors = require('cors');


function verifyToken (req,res,next) {
    const token = req.params.token;
    console.log(token); //check if this is the correct token
    if(!token) {
        res.status(400).json({message:'token not provided'});
        return
    }
    jwt.verify(token, 'shhhh', (error, userObj) => {
        if(error) {
            res.status(400).json({message:'invalid token'});
            return
        }
        req.user=userObj
        next()
    })
}

router.options("/*", function (req,res, next) {
    console.log("options")
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

router.get('/', (req, res) => {
    res.json({
        message: 'testing get endpoint',
    })
});
    
router.get('/all',cors(),(req, res) => {
   console.log('all resturants');
   Resturant
   .find()
   .then(resturants => res.json(resturants))
   .catch(err => {
       console.error(err);
       res.status(500).json({message:'Internal server error'})
   });
});  

router.get('/one/:id/:token',verifyToken,(req,res) => {
    Resturant 
    .findById(req.params.id)
    .then(resturant => {
        if(resturant.user===req.user.id) {
        res.json(resturant.serialize())
        }
        else {
            res.status(400).json({message:'User does not belong to resturant'})
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({message:'Internal server error'})
    });
});

router.get('/resturant',(req,res)=> {
    const filters = {};
    const queryableFields = ['title', 'address', 'comment'];
    queryableFields.forEach(field => {
        if(req.query[field]) {
            filters[field] = req.query[field];
        }
    });
    Resturant
        .find(filters)
        .then(resturant => res.json(
            Resturant.map(resturant => resturant.serialize())
        ))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
        });
});

router.post('/new/:token', cors(),(req, res) => {  
    verifyToken(req, res);
    console.log(req.body);
    const requiredFields = ['title', 'address','comment'];
    for (let i=0; i<requiredFields.length; i++) {
        const field= requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Resturant
        .create({
            // user: req.user.id,
            title: req.body.title, 
            CafeImage: req.body.CafeImage,                                  
            address: req.body.address,
            comment: req.body.comment
        })
        .then(resturant => res.status(201).json(resturant.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.delete('/one/:id/:token',cors(),(req,res)=> {
    Resturant
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        });
});
module.exports = router;

//get all resturants and put on screen
//create user
//delete resturant

