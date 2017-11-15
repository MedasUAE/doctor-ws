var appointment = require('../controllers/appointment');

module.exports = function(server){
    server.get('/appointment/:docId',(req, res, next)=>{
        appointment.getById(req.params.docId,(err,response) => {
            // response.username = req.username;
            // response.auth = req.authorization;
            res.send(200,response);
            return next();
        });
    })
}