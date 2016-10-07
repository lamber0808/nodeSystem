/*
  作用：根据不同的环境变量
  运行不同的目录结构：
 set PORT=6000 npm run dev  -> 启动开发环境
 set PORT=7000 npm run dist  ->启动生成环境
	
	这个文件不是真正的web服务器启动文件

 npm run dev
 npm run dist

 */

'use strict'

if(process.env.NODE_ENV.trim()=='dev')
{
	// console.log('开发环境');
	require('./src/app.js');
}
else{
	// console.log('生成环境');
	require('./dist/app.js');
}



