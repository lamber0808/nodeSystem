/**
 * 
 * Created by Lam on 2016/9/19.
 */

const  express = require('express');
const apiCtrl = require('../controller/apiController.js')
let route = express.Router();


//移动app要访问的路径
route.get('/getvideos',apiCtrl.getvideos);

//获取某个id对应的视频数据
route.get('/getvideo/:vid',apiCtrl.getvideobyvid);
module.exports = route;
