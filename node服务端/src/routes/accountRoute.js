/**
 *
 * Created by Lam on 2016/9/16.
 */

const express = require('express');
//讲accountController.js导入;
let accountCtrl = require('../controller/accountController.js')
let route = express.Router();

//进入注册页面get请求

//提交表单是post请求
route.get('/register',accountCtrl.getregister);
route.post('/register',accountCtrl.postregister);

//登录路由
route.get('/login',accountCtrl.getlogin)
route.post('/login',accountCtrl.postlogin)
route.get('/vcode',accountCtrl.getvcode)

//暴露route
module.exports = route;
