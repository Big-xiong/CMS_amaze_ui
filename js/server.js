var http = require('http');
var url = require('url');
var querystring = require('querystring');
var mysql = require('mysql');
var express = require('express');
var app = express();
var multer = require('multer');

// 获取数据库信息
var connection;
function createCon(){
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'test'
	});
}
/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});*/

// 创建数据库连接

app.listen(520);

// 上传图片
app.use(express.static('uploads'));
var storage = multer.diskStorage({
	//设置上传后文件路径
	destination: function(req, file, cb) {
		cb(null, './uploads')
	},
	//给上传文件重命名，获取添加后缀名
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		//给图片加上时间戳格式防止重名名
		//比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
		cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
});
var upload = multer({
	storage: storage
});

//单图上传
//app.post('/upload-single', upload.single('logo'), function(req, res, next) {
app.post('/upload-single', upload.any(), function(req, res, next) {
	console.log(req.files);	
	res.append("Access-Control-Allow-Origin","*");
	res.send({
		success:'ok',
		path:req.files
	});
});

app.get('/',function(req,res){
	var param = req.query;
	createCon();
	connection.connect();
	search(req,res,connection);
  	res.append("Access-Control-Allow-Origin", "*");
});

app.get('/mod',function(req,res){
	var param = req.query;
	createCon();
	connection.connect();
	mod(req,res,connection,param);
  	res.append("Access-Control-Allow-Origin", "*");
});

app.get('/modfin',function(req,res){
	var param = req.query;
	createCon();
	connection.connect();
	modfin(req,res,connection,param);
  	res.append("Access-Control-Allow-Origin", "*");
});

app.get('/del',function(req,res){
	var param = req.query;
	createCon();
	connection.connect();
	del(req,res,connection,param);
  	res.append("Access-Control-Allow-Origin", "*");
});

app.get('/add',function(req,res){
	var param = req.query;
	console.log(param);
	createCon();
	connection.connect();
	add(req,res,connection,param);
  	res.append("Access-Control-Allow-Origin", "*");
});

// 保存详情
app.get('/gethtml',function(req,res){
	var param = req.query;
	console.log(param);
	createCon();
	connection.connect();
	gethtml(req,res,connection,param);
  	res.append("Access-Control-Allow-Origin", "*");
});


console.log('开启服务器');

// 函数嵌套，记得做好传参
function search(req,res,connection){
	connection.query('SELECT * FROM shoe', function (error, results, fields) {
	  if (error) throw error;
	  	console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
		connection.end();
	});
}
function gethtml(req,res,connection,param){
	connection.query('UPDATE  shoe set detail="'+param.detail+'" where id="'+param.id+'"', function (error, results, fields) {
	  if (error) throw error;
	  	console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
		connection.end();
	});
}
function mod(req,res,connection,param){
	connection.query('SELECT * FROM shoe where id="'+param.id+'"', function (error, results, fields) {
	  if (error) throw error;
	  	console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
		connection.end();
	});
}
function modfin(req,res,connection,param){
	connection.query('UPDATE  shoe set title="'+param.name+'",price="'+param.price+'",del="'+param.del+'",intro="'+param.intro+'",img="'+param.img+'"where id="'+param.id+'"', function (error, results, fields) {
	  if (error) throw error;
	  	console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
		connection.end();
	});
}
function del(req,res,connection,param){
	connection.query('delete  from shoe where id="'+param.id+'"', function (error, results, fields) {
	  if (error) throw error;
	  	console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
		connection.end();
	});
}
function add(req,res,connection,param){
	connection.query('insert into shoe(title,price,del,intro,img) values("'+param.name+'","'+param.price+'","'+decodeURI(param.del)+'","'+param.intro+'","'+param.img+'")', function (error, results, fields) {
	  if (error) throw error;
	  	console.log('The solution is: ', results);
		res.end(JSON.stringify(results));
		connection.end();
	});
}



