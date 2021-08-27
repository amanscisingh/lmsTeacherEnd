const express = require('express');
const teacherDashboardRoute = express.Router();


// /teacherDashboard
teacherDashboardRoute.get('/', (req, res) => {
    try {
        res.render('teacherDashboard', { layout: 'teacherLoggedIn' });
    } catch (error) {
        res.send(error);
    }
})

module.exports = teacherDashboardRoute;