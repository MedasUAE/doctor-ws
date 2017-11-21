var restify = require('restify');
var plugins = require('restify').plugins;
const corsMiddleware = require('restify-cors-middleware')
var mysql = require('mysql');

var config = require('./config/config');

// Database connection
db = mysql.createConnection(config.db);
db.connect((err)=>{
    if(err) throw err;
    console.log("DB '", config.db.database, "' Connected.");
});

// server started
var server = restify.createServer();
server.use(plugins.bodyParser({ mapParams: false })); //for body data 
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['API-Token-Expiry']
  })
  
  server.pre(cors.preflight)
  server.use(cors.actual)

// server.use(plugins.authorizationParser()); //basic autherization
// server.use(auth.isAuthenticate);

server.listen(config.port,()=>{    
    require('./routes')(server);
    console.log("Server started on port: ", config.port);
});