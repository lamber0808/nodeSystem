/*
  express服务器文件

 */

'use strict'

let PORT  =process.env.PORT;

const express = require('express');

let app = express();

app.listen(PORT,()=>{

	console.log('环境已经启动'+PORT);
});
