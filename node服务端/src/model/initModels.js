/**
 * 
 * Created by Lam on 2016/9/16.
 * 初始化所有的表的模型
 */

module.exports = function (db,models) {
	//初始化userinfo表结构
	models.userinfo = db.define("userinfo", {
		uid:{type:'serial',key:true},
		uname:String,
		upwd:String,
		uqq:String,
		uemail:String,
	});
	
	//初始化videoinfo表的结构
	models.videoinfo = db.define('videoinfo',{
		vid:{type:'serial',key:true},
		vtitle:String,
		vsortno:Number,
		vsummary:String,
		vvideoid:String,
		vremark:String,
		vstatus:Number,
		vimg:String
	})
}


