/*
  express服务器文件

 */

'use strict'

let PORT  =process.env.PORT;

const express = require('express');
const orm = require('orm');
const ueditor = require("ueditor");
global.orm = orm;
let app = express();

//导入express-session包：用来存放专门术语某个浏览器的数据
const session = require('express-session');
app.use(session({
	secret: 'cz02', //安全密码,这个可以随意更改
	resave: false,
	saveUninitialized: true
}));


//导入body-parser实现获取请求报文体的数据
const  bodyParser = require('body-parser')
app.use(bodyParser());//将bodyparser作为第三方包加载到
//express框架中（express的中间件，那么req就能用）

//链接mysql数据库同时同时还所有表的模型
app.use(orm.express("mysql://root:@127.0.0.1:3306/nodesystem", {
	define: function (db, models, next) {
		let modelObj = require('./model/initModels.js')
		modelObj(db,models);
		next();
	}
}));

//1.0 设置当前项目的模板引擎为xtpl
let xtpl = require('xtpl');
app.set('views',__dirname+'/views');
//将来xtpl模板引擎自动去views文件夹中查找所有的模板文件
//将我们的xtpl扩展名称改成html结尾的模板
app.set('view engine', 'html');
//将来碰到html结尾的模板请自动使用xtpl.reanderFile去解析
//将来在这个系统中解析模板的写法改变为
//：res.render('模板路径',传入的对象,(err,content)=>{})
app.engine('html',xtpl.renderFile);



//2.0 设置静态资源
app.use(express.static(__dirname+'/statics'));

//利用all设置中文编码
app.all('/account/*',(req,res,next)=>{
	res.setHeader('Content-Type','text/html;clarset=utf8')
	next();
})
//1.导入注册路由模块和adminlist
let accountRoute = require('./routes/accountRoute.js');
let adminRoute = require('./routes/adminRoute.js');
app.use('/account',accountRoute);
app.use('/admin',adminRoute);

// 在这里统一设定api下面的所有请求都是可以允许跨域的
app.all('/api/*',(req,res,next)=>{
	//设置跨域请求
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

	next();
});

const apiRoute = require('./routes/apiRoute.js');
app.use('/api',apiRoute);


const path = require('path');
//加载富文本编辑器的路由
//设置statics静态文件
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'statics'), function (req, res, next) {
	// ueditor 客户发起上传图片请求
	if (req.query.action === 'uploadimage') {
		var foo = req.ueditor;

		var imgname = req.ueditor.filename;

		var img_url = '/images/ueditor/';
		res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
		res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
	}
	//  客户端发起图片列表请求
	else if (req.query.action === 'listimage') {
		var dir_url = '/images/ueditor/';
		res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
	}
	// 客户端发起其它请求
	else {
		// console.log('config.json')
		res.setHeader('Content-Type', 'application/json');
		//url的跳转
		res.redirect('/ueditor/nodejs/config.json');
	}
}));

app.listen(PORT,()=>{
	console.log('环境已经启动'+PORT);
});
