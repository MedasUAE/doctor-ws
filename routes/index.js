// export * from './appointment';

var appointment = require('../controllers/appointment');
var auth = require('../controllers/authenticate');

module.exports = function(server){

    server.post('/login',(req,res,next)=>{
        const post_data = req.body;
        auth.login(post_data, (err, response)=>{
            if(err) return res.send(400, {DisplayMessage:err});
            return res.send(200,{data: response});
        });
    });

    server.use(auth.isAuthenticate);

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
}