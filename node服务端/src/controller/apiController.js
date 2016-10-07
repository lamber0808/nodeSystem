/**
 *
 * Created by Lam on 2016/9/19.
 */

exports.getvideos = function (req,res) {
	//约定前台返回一个JSON数据；
	let resObj = {status:0,message:''};
	req.models.videoinfo.find({vstatus:0},function (error,datas) {
		//查询后返回的是一个数组；
		if(error){
			resObj.status = 1; //失败的状态
			resObj.message = error.message;
			res.end(JSON.stringify(resObj))
			return
		}
		//成功的返回
		resObj.message = datas;
		/*
		 json是什么样的：
		 resObj：{status:0,message:[
		 {img:'',vid:,vtitle:,vsortno:,vvideoid:,vsummary:,vremark:},
		 {}
		 ]}
		 */
		res.end(JSON.stringify(resObj));
	})
}
//获取单挑视频数据
exports.getvideobyvid = function (req,res) {
	//获取vid的值;
	let vid = req.params.vid
	let sql = 'select vvideoid,vremark from videoinfo where vid='+vid;
	let resObj = {status:0,message:''};
	req.db.driver.execQuery(sql,(err,datas)=>{
		if(err)
		{
			resObj.status = 1;
			resObj.messsage=err.message;
			res.end(JSON.stringify(resObj));
			return;
		}

		//正常数据的返回
		resObj.message = datas;
		res.end(JSON.stringify(resObj));
	});


}
