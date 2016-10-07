/**
 *
 * Created by Lam on 2016/9/16.
 *  负责MD5加密
 */

//md5加密
//
'use strict'

//entryString:要加密的明文
module.exports = function(entryString){
	const crypto = require('crypto');
	const secret = 'bb'; //加密的盐
	const hash = crypto.createHmac('md5', secret)
		.update(entryString)
		.digest('hex');

	return hash;
}

