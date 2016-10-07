/**
 *
 * Created by Lam on 2016/10/7.
 */
const express = require('express');
let app = express();

app.use(express.static(__dirname));

app.listen(8022,()=>{

    console.log('webapp服务器已经启动 8022');
});

