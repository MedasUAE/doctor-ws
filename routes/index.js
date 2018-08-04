
var appointment = require('../controllers/appointment');
var logs = require('../controllers/logs');
var auth = require('../controllers/authenticate');
var errs = require('restify-errors');

module.exports = function(server){

    server.post('/login',(req,res,next)=>{
        const post_data = req.body;
        auth.login(post_data, (err, response)=>{
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data: response});
        });
    });

    //server.use(auth.isAuthenticate);

    server.get({ path:'/appointment/:id', version:'1.0.0' },(req, res, next)=>{
        appointment.getById(req.params.id,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,response);
        });
    });

    server.post({ path: '/doc-appoint', version: '1.0.0' },(req, res, next)=>{ 
        appointment.getByDoctorId(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data:response.list});
        });
    });

    server.post({ path: '/doc-timeslot', version: '1.0.0' }, (req, res, next)=>{
        appointment.getDoctorSlots(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data:response});
        });
    }); 

    server.get({path:'/getlog', version:'1.0.0'}, (req, res, next)=>{
        logs.getlog(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data:response});
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
            return res.send(200,{data:response});
        });
    });

    server.post({ path: '/doc-timeslot', version: '2.0.0' }, (req, res, next)=>{ 
        appointment.getDoctorSlots(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data:response});
        });
    });
    
    server.post({ path: '/week-appoint', version: '2.0.0' },(req, res, next)=>{ 
        appointment.getWeeklyAppointment(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data:response});
        });
    });

    server.post({ path: '/month-appoint', version: '2.0.0' },(req, res, next)=>{ 
        appointment.getMonthlyAppointment(req.body,(err,response) => {
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data:response});
        });
    });

   
}