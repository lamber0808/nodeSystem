/*
	gulp.task()
	gulp.src();
	gulp.pipe();
	gulp.dest();

	gulp.watchFile()

 */

'use strict'

const gulp = require('gulp');

//2.0 定义任务,gulp默认执行名称为default的任务
//将来我们只需要执行：gulp所有任务全部搞定
gulp.task('defalut',['es6toes5','mincss','imagemin','htmlmin','copyfile'],()=>{

	console.log('所有任务执行完毕');

});

//3.0 es6toes5的任务 和js压缩任务
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

/*
 注意点：
  1、在gulp.src里面一定要加上第二个参数{base:'src'},
  如果不加则不会讲src中的原有目录结构拷贝到dis中

  2、uglify是不支持es6语法的，所以必须先调用.pipe(babel({presets: ['es2015']}))
  后再调用.pipe(uglify()) 否则报错
 */
gulp.task('es6toes5',()=>{

	gulp.src(['./src/controller/*.js'
		,'./src/model/*.js','./src/routes/*.js'
		],{base:'src'})
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify()) //压缩js （一定是要先转成es5语法以后再压缩）
	.pipe(gulp.dest('dist'));

	console.log('es6转es5完毕，并且压缩js完毕');
});

//4.0 css的压缩 （	https://www.npmjs.com/package/gulp-clean-css）
//将当前css生成 manifest.json 文件
const rev = require('gulp-rev');  //将文件md5化
const mincss = require('gulp-clean-css');
//注意点：编写的顺序一定是按照这个顺序来
gulp.task('mincss',()=>{

	gulp.src('./src/statics/css/*.css',{base:'src'})
	.pipe(mincss({compatibility: 'ie8'}))
	.pipe(rev())
	.pipe(gulp.dest('dist'))
	.pipe(rev.manifest()) //自动生成一个 manifest.json文件
    .pipe(gulp.dest('./src/rev/'));
    
});


//5.0 图片的压缩 (不失真的压缩)
const imagemin = require('gulp-imagemin');
gulp.task('imagemin',()=>{

	 gulp.src('src/statics/images/*.*',{base:'src'})
    .pipe(imagemin())
    .pipe(gulp.dest('dist'))

});

//6.0 html压缩
const htmlmin = require('gulp-htmlmin');
const revCollector = require('gulp-rev-collector');
 
 //collapseWhitespace: true:表示将html结构中的空白行，空格等这些给压缩掉
gulp.task('htmlmin', function() {
  // return gulp.src('./src/views/*.html',{base:'src'})
  //   .pipe(htmlmin({collapseWhitespace: true}))
  //   .pipe(gulp.dest('dist'));
 	
 	gulp.src(['src/rev/**/*.json', './src/views/*.html'],{base:'src'})
        .pipe(revCollector())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});


//7.0 css的md5化
/*
  将css文件进行MD5的步骤：
  1、调用一个插件 const rev = require('gulp-rev');  
  来将css文件名进行md5化 （mincss）

  2、(htmlmin)调用另外一个插件const revCollector = require('gulp-rev-collector');
  来将 所有指定的html文件中的site.css重命名
	pipe(revCollector()) ->自动去找'src/rev/星星/*.json'中的 "statics/css/site.css"
	作为键将html中有 "statics/css/site.css" 的所有值替换为：statics/css/site-33fa5f7d18.css

 */

//8.0 将static中的bowersrc文件夹全部拷贝到dist中
gulp.task('copyfile',()=>{
	gulp.src('./src/statics/bowersrc/**/*.*',{base:'src'})
	.pipe(gulp.dest('dist'));
});
