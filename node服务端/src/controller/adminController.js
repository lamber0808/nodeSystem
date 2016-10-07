/**
 *
 * Created by Lam on 2016/9/17.
 */

//admin/list列表的get请求
exports.getlist = function (req, res) {
  //分页设置====================================
	//获取a标签传过来的索引；
	let index  = req.params.index||1;
	
	//查找数据库设置，
	//offset：表示从第几条开始查找，
	//count:表示查找的条数
	let count = 3;
	let offsetValue = (index-1)*count;
	
	//获取数据库表videoinfo的总条数
	let pageArr = [];
	req.models.videoinfo.count({},function (err,data) {
		//计算总页数
		let roecount = data/count
		roecount = roecount<1?1:Math.ceil(roecount);
		for(let i=1; i<=roecount;i++){
			pageArr.push(i);
		}
	})

	
	
	
	//获取查询的内容
	let titleVal = req.body.vtitle;
	let queryValue = '';
	//定义查询条件
	let where = {};
	//查出的内容不给空的时候
	if (titleVal) {
		titleVal  = "%"+titleVal+"%"
		where = {vtitle: orm.like(titleVal)};
		queryValue = titleVal;
	}
	//定义查询条件，如果没有内容默认为显示全部{};
	//从第几开始，取多少条
	req.models.videoinfo.find(where, {offset:offsetValue,limit:count},function (err, list) {
		if (err) {
			res.end(err.toString());
			return
		}
		let pagecount = pageArr.length;

		//将页面渲染以后响应给浏览器
		res.render('admin/videolist.html', {array: list,pageArr:pageArr,pagecount:pagecount}, function (err, html) {
			res.end(html)
		})
	})
}
exports.getadd = function (req, res) {
	//views文件夹已经设置了环境变量，不能再加根目录/，根目录是根据app.js算起
	res.render('./admin/videoadd.html', {}, function (err, html) {
		res.end(html)
	})
}

//负责将数据插入到表videoinfo中
exports.postadd = function (req, res) {
	//1.0获取浏览器请求body中的所有值
	let vtitle = req.body.vtitle;
	let vsortno = req.body.vsortno;
	let vsummary = req.body.vsummary;
	let vvideoid = req.body.vvideoid;
	let vremark = req.body.editorValue;


	//将值入库
	req.models.videoinfo.create({
		vtitle: vtitle,
		vsortno: vsortno,
		vsummary: vsummary,
		vremark: vremark,
		vstatus: 0,
		vvideoid: vvideoid
	}, function (err, item) {
		res.setHeader('Content-Type', 'text/html;charset=utf8');
		res.end('<script>alert("新增成功");window.location="/admin/list";</script>')
	})
}

exports.getdelvideo = function (req,res) {
   // console.log(req.url);
	//获取id
	let vid = req.params.vid;
	let resObj = {status:0,message:''};

	req.models.videoinfo.get(vid,(err,user)=>{
		user.remove((err)=>{
			resObj.status = 1;
			resObj.message = '删除失败';
			res.end(JSON.stringify(resObj));
			return;
		});
		resObj.message = '数据删除成功'
		res.end(JSON.stringify(resObj));
	});
}
exports.getedit = function (req,res) {
	//获取vid的值
	let vid = req.params.vid;
	//2.0根据vid找到数据
	req.models.videoinfo.get(vid,function (err,item) {
		//查找回来的是一个对象;
		//item的格式：{vid:,vtitle,vdorton}
		res.render('admin/videoedit.html',item,function (err,html) {
		 if(err){
			 res.end(err)
			 return;
		 }
			res.end(html)
		})
	})
}
//在编辑页面保存数据
exports.postedit = function (req,res) {
	//获取表单中的值
	//这里技巧，设置一个隐藏的input为了提交id上来；
	let vid = req.body.vid;
	let vtitle = req.body.vtitle;
	let vsortno = req.body.vsortno;
	let vsummary = req.body.vsummary;
	let vvideoid = req.body.vvideoid;
	let vremark = req.body.editorValue;

    //========查询然后更新=================	
	
	//查询出要更新的这条数据
	req.models.videoinfo.get(vid,function (error,item) {
	    //返回的是一个对象
		//修改值
		item.vtitle = vtitle;
		item.vsortno = vsortno;
		item.vsummary = vsummary;
		item.vvideoid = vvideoid;
		item.vremark = vremark;
		
		//修改数据后保存数据
		item.save(function (error) {
			if(error)
			{
				res.end(error);
				return;
			}
			res.setHeader('Content-Type', 'text/html;charset=utf8');
			res.end("<script>alert('数据更新成功');window.location='/admin/list';</script>");
		})
		
	})
}


