/**

 * Created by Lam on 2016/9/16.
 * 负责处理account相关的所有逻辑
 */

'use strict'
exports.getregister = (req,res)=>{
	//负责将account/register.html模板页面中的内容响应给浏览器
	res.render('account/register.html',{},(err,html)=>{
		res.end(html);
	});
}
//注册路由
exports.postregister = function (req,res) {
	//1.0获取通过浏览器提交上来的数据
	let vname = req.body.vname;
	let vpwd = req.body.vpwd;
	//讲密码md5加密
	vpwd = require('../tools/md5entry.js')(vpwd)
	let vqq = req.body.vqq;
	let vemail = req.body.vemail;
	
	//将这些数据通过req.models.userinfo插入到表userinfo中
	req.models.userinfo.create({
		uname:vname,
		upwd:vpwd,
		uqq:vqq,
		uemail:vemail
	},function (err,user) {
		res.end('<script>alert("注册成功");window.location="/account/login"</script>')
	})
	
}

//登录逻辑
//getlogin：用来获取login.html这个页面相应给浏览器
exports.getlogin = function (req,res) {
	res.render('account/login.html',{},function (err,html) {
		//admin/*这种通配符路径进行提前设置
		res.end(html)
	})
}
exports.postlogin = function (req,res) {
	res.setHeader('Content-Type','text/html;charset=utf8');
	//获取浏览器提交上来的值；
	let uname = req.body.uname;
	let upwd = req.body.upwd;
	let vcodu = req.body.vcode;

	
	//讲vcode与服务器sessino中的字符串比对
	let vcodeFormSession = req.session.vcode;
	if(vcodu!=vcodeFormSession){
		res.end('<script>alert("验证码错误");window.location="/account/login";</script>');
		return;
	}
	
	//验证用户名和密码的正确性；
	//方法将明文密码进行加密比较
	upwd = require('../tools/md5entry')(upwd);
	//检索数据库
	req.models.userinfo.find({uname:uname,upwd:upwd},
		//检索完后返回一个数组；
	function (err,result) {

		//当users数组有值，则表示用户名和密码正确
		if(result.length==0){
			res.end('<script>alert("用户名或者密码错误")</script>')
			return;
		}
		//讲属于当前浏览器的session对象添加一个logined属性值存储为
		//uname这个变量的值；
		req.session.login = uname; //这个标记将来在所有的请求中都要去判断
		
		res.end('<script>alert("用户登录成功")；window.location="/admin/list";</script>')
	})
}

// 生成一个验证码的图片
exports.getvcode = (req,res)=>{
	//1.0 产生一个随机字符串当做验证码,将验证码字符串保存到session中
	//2.0 将验证码变成一个图片
	//3.0 将图片响应回浏览器

	let vcode = parseInt(Math.random()*9000+1000);

	//0.0 将vcode存储到session中 (express-session)
	//将vcode字符串存储到术语当前浏览器的session对象中
	req.session.vcode = vcode.toString();

	let captchapng = require('captchapng');

	let p = new captchapng(80,30,vcode); // width,height,numeric captcha
	p.color(0, 0,0,0);  // First color: background (red, green, blue, alpha)
	p.color(87, 10, 180, 255); // Second color: paint (red, green, blue, alpha)

	let img = p.getBase64();
	let imgbase64 = new Buffer(img,'base64');
	res.writeHead(200, {
		'Content-Type': 'image/png'
	});
	//img src请回过来返回一个图片回去;
	res.end(imgbase64);
}

