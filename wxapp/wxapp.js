'use strict'

const e = require('express');

let app =e();

//这个地址就是将来微信服务器请求我们自己的app服务器的唯一入口
app.all('/check',(req,res)=>{

	console.log(req.method);
	//以后所有请求都是post，所以如何获取到post中的数据
	req.on('data',(bodystr)=>{

	console.log(bodystr.toString());

	//1.0 检查微信服务器发送给公众号服务器的数据载体到底是什么?xml
	/*
		<xml>
		<ToUserName><![CDATA[gh_d673a9c551af]]></ToUserName>
		<FromUserName><![CDATA[op-PQwg2ECkPzuyQqXNr5wa2msA4]]></FromUserName>
		<CreateTime>1474343016</CreateTime>
		<MsgType><![CDATA[text]]></MsgType>
		<Content><![CDATA[h]]></Content>
		<MsgId>6332255037413818956</MsgId>
		</xml>
	 */
	
	//2.0 在nodejs中如何解析xml
	//解决方案：使用第三方包：xml2js 实现
	const parseString = require('xml2js').parseString;
	//自动将xml字符串转换成js对象以result参数的形式传回
	parseString(bodystr.toString(),(err,result)=>{
		/*
			result的格式：
			{ xml:
			   { ToUserName: [ 'gh_d673a9c551af' ],
			     FromUserName: [ 'op-PQwg2ECkPzuyQqXNr5wa2msA4' ],
			     CreateTime: [ '1474343505' ],
			     MsgType: [ 'text' ],
			     Content: [ 'hello' ],
			     MsgId: [ '6332257137652826861' ] } }

		 */
		let txt = result.xml.Content[0];
		if(txt.trim() =='视频教程')
		{
			//响应回去一个你好
			/*
			 根据公众平台api说明，响应回去的格式是：
			 <xml>
				<ToUserName><![CDATA[toUser]]></ToUserName>
				<FromUserName><![CDATA[fromUser]]></FromUserName>
				<CreateTime>12345678</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[你好]]></Content>
				</xml>

			 */
			
			// let resFmt = `
			// 	<xml>
			// 	<ToUserName><![CDATA[${result.xml.FromUserName[0]}]]></ToUserName>
			// 	<FromUserName><![CDATA[${result.xml.ToUserName[0]}]]></FromUserName>
			// 	<CreateTime>12345678</CreateTime>
			// 	<MsgType><![CDATA[text]]></MsgType>
			// 	<Content><![CDATA[你好]]></Content>
			// 	</xml>
			// `;
			// 
			// 
			// 响应一个图文消息回去
			let resFmt = `
				<xml>
				<ToUserName><![CDATA[${result.xml.FromUserName[0]}]]></ToUserName>
				<FromUserName><![CDATA[${result.xml.ToUserName[0]}]]></FromUserName>
				<CreateTime>12345678</CreateTime>
				<MsgType><![CDATA[news]]></MsgType>
				<ArticleCount>1</ArticleCount>
				<Articles>
				<item>
				<Title><![CDATA[学习编程App]]></Title> 
				<Description><![CDATA[从javaScript入门到抢月饼]]></Description>
				<PicUrl><![CDATA[http://odr25de00.bkt.clouddn.com/js.png]]></PicUrl>
				<Url><![CDATA[http://weibiaoapp.ittun.com/index.html]]></Url>
				</item>			
				</Articles>
				</xml>
			`;

			//响应回去
			res.end(resFmt);
		}
		else if(txt.trim() =='京东商城')
		{

			let resFmt = `
				<xml>
				<ToUserName><![CDATA[${result.xml.FromUserName[0]}]]></ToUserName>
				<FromUserName><![CDATA[${result.xml.ToUserName[0]}]]></FromUserName>
				<CreateTime>12345678</CreateTime>
				<MsgType><![CDATA[news]]></MsgType>
				<ArticleCount>1</ArticleCount>
				<Articles>
				<item>
				<Title><![CDATA[京东商城]]></Title> 
				<Description><![CDATA[狂欢双11节]]></Description>
				<PicUrl><![CDATA[http://odr25de00.bkt.clouddn.com/jd.png]]></PicUrl>
				<Url><![CDATA[http://weibiaojd.ittun.com/#/tab/home]]></Url>
				</item>			
				</Articles>
				</xml>
			`;

			//响应回去
			res.end(resFmt);
		}

		console.log(result);

	});

	});


	//验证这个请求确实来源于微信服务器
	
	//经过确认：微信服务器在验证网址的时候是通过get请求将下面4个参数传入到服务器
	//signature	微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
	// timestamp	时间戳
	// nonce	随机数
	// echostr	随机字符串

	//验证的机制：
	/*
		1、微信服务器会将timestamp的值+nonce的值+echostr的值通过加密的方式生成一个密码
		以signature的方式传入到我们的服务器
		2、 我们在此处应该将timestamp的值+nonce的值+echostr的值以微信服务器的相同加密算法
		来得到一个加密值 mysignature
		3、用signature 和 mysignature 的值比较，
		如果相等表示这个请求就是微信服务器的请求，则应该将echostr这个参数的值原样返回
		否则被黑客篡改了

		所以我们在做验证的时候可以简化步骤：
		直接获取echostr中的字符串 res.end()搞定
	 */
	//将来自己的服务器验证的时候，打开这个即可完成
	// let url = req.url; //http://mywx02.ittun.com/check?echostr=hello
	// const uri = require('url');
	// let queryStr = uri.parse(url).query;
	// const qs = require('querystring');
	// let qobj = qs.parse(queryStr);

	// console.log(qobj.echostr);	

	// //响应回去
	// res.end(qobj.echostr);

})


app.listen(6005,()=>{

	console.log('微信app服务器已经启动 6005');
});