/**
 *
 * Created by Lam on 2016/9/17.
 */
const express = require('express');
const adminCtrl = require('../controller/adminController.js')

//router 就是一个 mini 的 app。router 可以更细的划分 controller
let route = express.Router();

//1.0查找post更新页面，/amdin/list更新页面是get；
//参数可以为空;
route.all('/list/:index?',adminCtrl.getlist);

//2.0添加addd相关路由
route.get('/add',adminCtrl.getadd)
route.post('/add',adminCtrl.postadd)

// 3.0添加edit相关路由
route.get('/editvideo/:vid',adminCtrl.getedit)
route.post('/editvideo',adminCtrl.postedit)


//4.添加删除按钮
route.get('/delvideo/:vid',adminCtrl.getdelvideo)



//暴露route
module.exports = route;
