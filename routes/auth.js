const express = require('express')
const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'alkfjaghioshhhhh';

const fetchuser = require('../middleware/fetchuser');

//Routes 1 : create user : POST "/api/auth/createuser".  singup required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password have been atleast 5 character').isLength({ min: 5 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        // check whether the user with this email exists already
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success, error: "Sorry a user with this email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
    
        user = User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        });

        const data = { 
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true,
        // res.json(user);
        res.status(200).json({success, authToken});  

    // .then(user => res.json(user))
    // .catch(error => console.error(error));
    //    res.status(200).json( user );
    
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
    
});


//Routes 2 : Authenticate a user using : POST "/api/auth/login".  login required

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  
  });

router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userid = req.user.id; 
        const user = await User.findById(userid).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
});



module.exports = router;