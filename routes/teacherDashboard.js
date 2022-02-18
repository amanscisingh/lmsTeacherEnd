const express = require('express');
const teacherDashboardRoute = express.Router();
const Classes = require('../models/Classes.js');
const Users = require('../models/Users.js');
const Assignments = require('../models/Assignments.js');
const mongoose = require('mongoose');
const ScheduledClasses = require('../models/ScheduledClasses.js');


// /teacherDashboard
teacherDashboardRoute.get('/', async(req, res) => {
    try {
        // passing all the class details in form of array to the template
        const email = req.cookies['email'];
        let allClasses = await Classes.find({ classTeacherEmail: email }).lean();
        
        let allScheduledClasses = await ScheduledClasses.find({ classTeacherEmail: email }).lean();
        console.log(allScheduledClasses);

        res.render('teacherDashboard', { layout: 'teacherLoggedIn', allClasses: allClasses , allScheduledClasses: allScheduledClasses});
    } catch (error) {
        res.send(error);
    }
})


// /teacherDashboard/create
teacherDashboardRoute.get('/create', (req, res) => {
    try {
        // passing all the class details in form of array to the template
        res.render('createClass', { layout: 'blank' });
    } catch (error) {
        res.send(error);
    }
})

// /teacherDashboard/:classCode
teacherDashboardRoute.get('/:classCode', async(req, res) => {
    try {
        // passing all the class details in form of array to the template
        const classCode = req.params.classCode;
        let classInfo = await Classes.findOne({ classCode: classCode }).lean();
        let allAssignmentsandTests = await Assignments.find({ classCode: classCode }).lean();
        let allAssignments = [];
        let allTests = [];
        for (let i = 0; i < allAssignmentsandTests.length; i++) {
            if (allAssignmentsandTests[i].type == 'assignment') {
                allAssignments.push(allAssignmentsandTests[i]);
            } else {
                allTests.push(allAssignmentsandTests[i]);
            }
        }

        let allScheduledClasses = await ScheduledClasses.find({ classCode: classCode }).lean();

        res.render('classDashboard', { layout: 'singleClass', classInfo: classInfo, classCode, allAssignments: allAssignments, allTests: allTests, allScheduledClasses: allScheduledClasses });
    } catch (error) {
        res.send(error);
    }
});


// /teacherDashboard/create
// @POST request to create an antity in db
teacherDashboardRoute.post('/create', async(req, res) => {
    try {
        // passing all the class details in form of array to the template
        console.log('post request revied');

        let classCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3) + '-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3) + '-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3);
        let email = req.cookies['email'];
        let user = await Users.findOne({ email: email });
        // console.log(user);

        var newClass = new Classes({
            className: req.body.className,
            classDescription: req.body.classDescription,
            classCode: classCode,
            classTeacher: user['firstName'] + ' ' + user['lastName'],
            classTeacherEmail: email,
            classTeacherImage: user['image'] || 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + user['firstName'] + '+' + user['lastName'] + "&size=96",
        });

        await newClass.save();
        // console.log(newClass);
        res.redirect('/teacherDashboard');
    } catch (error) {
        res.send(error);
    }
})


// teacherDashboard/:classCode/create
teacherDashboardRoute.get('/:classCode/create', async(req, res) => {
    try {
        res.render('createAssignment', { layout: 'blank' })
    } catch (error) {
        res.send(error);
    }
})


// teacherDashboard/:classCode/create
// @POST 
teacherDashboardRoute.post('/:classCode/create/:filename', async(req, res) => {
    try {
        const classCode = req.params.classCode;
        const fileUploadName = req.params.filename;
        const title = req.body.title;
        const description = req.body.description;
        const totalMarks = req.body.totalMarks;
        const deadline = req.body.deadline;
        const email = req.cookies['email'];

        let newAssignment = new Assignments({
            classCode: classCode,
            fileUploadName: fileUploadName,
            title: title,
            description: description,
            totalMarks: totalMarks,
            deadline: deadline,
            profEmail: email,
        });

        await newAssignment.save();

        res.redirect('/teacherDashboard/' + classCode);


    } catch (error) {
        res.send(error);
    }
});



// teacherDashboard/:classCode/:assignmentId
teacherDashboardRoute.get('/:classCode/assignment/:assignmentId', async(req, res) => {
    try {
        const classCode = req.params.classCode;
        const assignmentId = mongoose.Types.ObjectId(req.params.assignmentId);
        let assignment = await Assignments.findOne({ _id: assignmentId }).lean();
        console.log(assignment);

        res.render('assignmentDashboard', { layout: 'teacherLoggedIn', classCode, assignment: assignment });
    } catch (error) {
        res.send(error);
    }
});


// teacherDashboard/:classCode/scheduleClass
teacherDashboardRoute.get('/:classCode/scheduleClass', async(req, res) => {
    try {
        let classCode = req.params.classCode;
        // console.log(classCode);
        res.render('scheduleClass', { layout: 'blank' })
    } catch (error) {
        console.error(error);
        res.send(error);
    }
})


// teacherDashboard/:classCode/scheduleClass
// @POST
teacherDashboardRoute.post('/:classCode/scheduleClass', async(req, res) => {
    try {
        let classCode = req.params.classCode;

        let newScheduledClass = new ScheduledClasses({
            classCode: classCode,
            title: req.body.title,
            description: req.body.description,
            startTime: req.body.startTime,
            duration: req.body.duration,
            classLink: req.body.classLink,
            classPassword: req.body.classPassword,
            classTeacherEmail: req.cookies['email'],
        });

        await newScheduledClass.save();

        res.send(newScheduledClass);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
})



//  teacherDashboard/:studentEmail/:assignmentId
// @POST
teacherDashboardRoute.post('/:studentEmail/:assignmentId', async(req, res) => {
    try {
        let studentEmail = req.params.studentEmail;
        let assignmentId = mongoose.Types.ObjectId(req.params.assignmentId);
        let assignment = await Assignments.findOne({ _id: mongoose.Types.ObjectId(assignmentId) }).lean();
        
        let allSubmissions = assignment.allSubmissions;
        let cnt=0;
        for (let i = 0; i < allSubmissions.length; i++) {
            cnt++;
            if (allSubmissions[i].studentInfo.studentEmail === studentEmail) {
                allSubmissions[i].submission.marksAssigned = req.body.marksAssigned;
                break;
            } 
            
        }
        if(cnt == allSubmissions.length) {
            res.send('Student not found');
        } else {
            assignment.allSubmissions = allSubmissions;
            await Assignments.updateOne({ _id: mongoose.Types.ObjectId(assignmentId) }, assignment, {new: true});

            res.redirect('/teacherDashboard/' + assignment.classCode  + '/assignment/' + assignmentId);

        }
        console.log(cnt, allSubmissions.length);

        
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});


module.exports = teacherDashboardRoute;