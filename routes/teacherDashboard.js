const express = require('express');
const teacherDashboardRoute = express.Router();
const Classes = require('../models/Classes.js');
const Users = require('../models/Users.js');


// /teacherDashboard
teacherDashboardRoute.get('/', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const googleId = req.cookies['user-id'];
        let allClasses = await Classes.find({ classTeacherId: googleId }).lean();
        console.log(allClasses);

        res.render('teacherDashboard', { layout: 'teacherLoggedIn', allClasses: allClasses  });
    } catch (error) {
        res.send(error);
    }
})


// /teacherDashboard/create
teacherDashboardRoute.get('/create', (req, res) => {
    try {
        // passing all the class details in form of array to the template
        res.render('createClass', { layout: 'teacherLoggedIn' });
    } catch (error) {
        res.send(error);
    }
})

// /teacherDashboard/create
// @POST request to create an antity in db
teacherDashboardRoute.post('/create', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        console.log('post request revied');
            
        let classCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3) + '-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3) + '-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3);
        let googleId = req.cookies['user-id'];
        let user = await Users.findOne({ googleId: googleId });

        var newClass = new Classes({
            className: req.body.className,
            classDescription: req.body.classDescription,
            classCode: classCode,
            classTeacher: user['firstName'] + ' ' + user['lastName'],
            classTeacherId: googleId,
            classTeacherImage: user['image'],
        });

        await newClass.save();
        console.log(newClass);
        res.redirect('/teacherDashboard');
    } catch (error) {
        res.send(error);
    }
})
module.exports = teacherDashboardRoute;