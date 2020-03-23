const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs');
const https = require('https');
const login = require('./router/login.js');
const sync = require('./router/sync.js');
const options = {
    ca: fs.readFileSync('key/1_root_bundle.crt'),
    key: fs.readFileSync('key/3_www.elric.club.key'),
    cert: fs.readFileSync('key/2_www.elric.club.crt')
};

https.createServer(options, app).listen(443,()=>{
    console.log('----- server on -----');
});
app.use(login);
app.use(sync);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/node_modules/',express.static(path.join(__dirname,'../node_modules/')));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length,token');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


