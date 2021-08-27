const express = require('express');
const authRoute = express.Router();
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID.toString();
const client = new OAuth2Client(CLIENT_ID);
const User = require('../models/Users.js');

// /auth/login
authRoute.post('/login', (req, res)=> {
    try {
        let token = req.body.token;
        let userid;

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID, 
            });
            const payload = ticket.getPayload();
            userid = payload['sub'];
            let userData = await User.findOne({googleId: userid});
            console.log(payload);
            if (userData == null) {
                // create a new User
                console.log('userNot Found');

                let newUser = new User({
                    googleId: userid,
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    image : payload.picture,
                    email: payload.email,
                    designation: 'teacher',
                });

                await newUser.save();
                console.log('data updated in Users db');
            }

        }
    
        verify()
        .then(()=> {
            // Storing token and googleId in the cookie storage
            res.cookie('session-cookie', token);
            res.cookie('userid', userid);
            res.send("success");
        })
        .catch(console.error);
    } catch (error) {
        res.send(error);
    }
})



module.exports = authRoute;