// export * from './appointment';

var appointment = require('../controllers/appointment');
var auth = require('../controllers/authenticate');

module.exports = function(server){

    server.post('/login',(req,res,next)=>{
        const post_data = req.body;
        auth.login(post_data, (err, token)=>{
            if(err) return res.send(400, err);
            return res.send(200,{token: token});
        });
    })

    server.use(auth.isAuthenticate);

    server.get('/appointment/:id',(req, res, next)=>{
        appointment.getById(req.params.id,(err,response) => {
            if(err) return res.send(400, err);
            return res.send(200,response);
        });
    });

    server.post('/doc-appoint',(req, res, next)=>{ 
        appointment.getByDoctorId(req.body,(err,response) => {
            if(err) return res.send(400, err);
            return res.send(200,response);
        });
    })

    server.post('/doc-timeslot', (req, res, next)=>{ 
        appointment.getDoctorSlots(req.body,(err,response) => {
            if(err) return res.send(400, err);
            return res.send(200,response);
        });
    }); 
}