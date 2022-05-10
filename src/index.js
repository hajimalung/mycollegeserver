var serverConfig = require('./serverConfig.js');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');


//db connection
var dnConnection = mysql.createConnection(serverConfig.dbConfig);

dnConnection.connect(function(err){
	if(err) throw err;
	console.log("db connected!!!");
});

//sub module listening to services
var services = new express();

services.use(bodyParser.json()); // for parsing application/json
services.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
services.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

services.get('/',function(req,res){
		res.send("<h1>server is up and running....</h1>");
});
services.post('/login',function(req,res){
	console.log(req.body);
	var loginQuery = "SELECT Full_Name,role,email,phone,UUID FROM user_profile,mycollege.identity_view where mycollege.identity_view.userid='"+req.body.userid+"' and mycollege.identity_view.passcode='"+req.body.password+"';";
	dnConnection.query(loginQuery,function(err,result){
		if(err){
			res.status(500).send({'message':err});
		} 
		if(result.length<=0){
			res.status(401).send({'message':'invalid username or password'});
		}else{
			console.log("login respone from db : "+JSON.stringify(result));
			res.status(200).send(result);
		}
	});
});



//main server instance
var app = new express();

app.use('/services',services);

app.get('/',function(req,res){
		res.send("<h1>server is up and running....</h1>");
});
app.listen(serverConfig.server.port,function(){
	console.log(serverConfig.server.name+" server started and listening at port:"+serverConfig.server.port);
});