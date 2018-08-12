
var appointment = require('../controllers/appointment');
var logs = require('../controllers/logs');
var auth = require('../controllers/authenticate');
var errs = require('restify-errors');

module.exports = function(server){

    //server.use(auth.isAuthenticate);

    server.get({ path:'/appointment/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getById(req.params.id,(err,response) => {
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

    server.get({ path:'/patient-detail/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getPatientDetailByOpNumber(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/outpatientlist', version:'1.0.0' },(req, res, next)=>{
        appointment.getOutPatientList(req.query.consultDate,req.query.officeId,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/appointmentlist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getAppointmentListByOpNumber(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/vitallist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getVitalListByConsultId(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/testdetaillist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getTestdetailListByConsultId(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.get({ path:'/examinationdetaillist/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getExaminationDetailListByConsultId(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });


    /***********VERSION 2.0.0 *****************/

    server.post({ path: '/doc-appoint', version: '2.0.0' },(req, res, next)=>{ 
        appointment.getByDoctorId(req.body,(err,response) => {
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
    });
}