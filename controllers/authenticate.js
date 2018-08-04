var db_query = require('../db/executeQuery');
var redis = require('../utils/redis');
const bcrypt = require('bcrypt')

function authenticate(token, next) {
    checkUserRedis(token, (err, result) => {
        if (err) return next(err);
        return next(null, result)
    });
}

function isAuthenticate(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[0];
      req.token = bearerToken;
      authenticate(req.token,(err,commaSeparatedNameAndPass)=>{
          if(err) return res.send(403, err);
          req.user = commaSeparatedNameAndPass;
          return next();
      })
    } else {
      res.send(403,"NoTOKEN");
    }
  }

function checkUser(user, next) {
    if(!user) return next("NoUserObject");
    const query = "SELECT user_id, user_label FROM user_setup WHERE user_Name ='" + user.username + "' AND user_password='" + user.password + "'"
    
    db_query.query(query, function (err, user) {
        if (err) return next(err);
        if (!user.length) return next("USERNOTFOUND");
        return next(null, {user_id:user[0].user_id, user_label: user[0].user_label});
    });
}

function login(postData, next){
    var accessTime = Date.now();
    var commaSeparatedNameAndPass = accessTime + ',' + postData.username + ',' + postData.password;
    checkUser(postData,(err, res)=>{
        if(err) return next(err);
        const data = {
            doctor_id: res.user_id,
            token: generateTocken(postData),
            name: res.user_label
        }
        redis.setData(data.token, commaSeparatedNameAndPass, (err, reply) => {
            if (err) return next(err);
        });
        return next(null, data);
    });
}

function generateTocken(postData) {
    var round = 10;
    const salt = bcrypt.genSaltSync(round)
    const token = bcrypt.hashSync(postData.username + ',' + postData.password, salt)
    return token;
}

function checkUserRedis(token, next) {
    if (!token) return next("NoToken");
    redis.getData(token, (err, result) => {
        if (err) return next(err);
        if (!result) return next("Invald Token");
        const tokenValues = result.split(',');
        const commaSeparatedNameAndPass = Date.now() + ',' + tokenValues[1] + ',' + tokenValues[2];
        redis.setData(token, commaSeparatedNameAndPass, (err, reply) => {
            if (err) return next(err);
            return next(null, result);
        });
    });
}
exports.isAuthenticate = isAuthenticate;
exports.login = login;