
var appointment = require('../controllers/appointment');
var logs = require('../controllers/logs');
var auth = require('../controllers/authenticate');
var errs = require('restify-errors');

module.exports = function(server){

    //server.use(auth.isAuthenticate);

    server.get({ path:'/patientlist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getPatientListByMobileNo(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/officelist', version:'1.0.0' },(req, res, next)=>{
        appointment.getOfficeList((err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });
    server.get({ path:'/departmentlist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getDepartmentList(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/doctorlist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getDoctorlistByDepartmentId(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/slotlist', version:'1.0.0' },(req, res, next)=>{
        appointment.getSlotlistByDateAndDoctorId(req.query.date,req.query.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.post({ path: '/savepatient', version: '1.0.0' },(req, res, next)=>{ 
        appointment.savepatient(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    })



}