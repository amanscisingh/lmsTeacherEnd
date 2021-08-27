const express  = require('express');
const apiRoute = express.Router();

// /api:email
apiRoute.get('/:email', async (req, res) => {
    try {
        let email = req.params.email;
        console.log(email);
        res.json({email: email});

    } catch (error) {
        res.send(error);
    }
});

module.exports = apiRoute;