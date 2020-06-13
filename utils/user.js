/*用户相关服务*/
const util = require('../utils/util.js');
const api = require('../config/api.js');
/*Promise封装wx.checkSession登陆是否过期*/
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        console.log('checkSession成功')
        resolve(true);
      },
      fail: function() {
        console.log('checkSession失败')
        reject(false);
      }
    })
  });
}
/*Promise封装wx.login*/
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}
/*调用微信登录*/
function loginByWeixin(userInfo) {
  let shareUserId = wx.getStorageSync('shareUserId');
  if (!shareUserId || shareUserId =='undefined'){
    shareUserId = 1;
  }
  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      console.log(res)
      //登录远程服务器
      let pamarLogin = {
        code: res.code,
        userInfo: userInfo,
        shareUserId: shareUserId
      }
      console.log(pamarLogin)
      util.request(api.AuthLoginByWeixin , pamarLogin , 'POST').then(res => {
        console.log(res)
        if (res.status.code === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.result.userInfo);
          wx.setStorageSync('token', res.result.token);
          
          resolve(res);
        } else {
          reject('参数错误+'+res);
        }
      }).catch((err) => {
        reject('服务器未响应+'+err);
      });
    }).catch((err) => {
      reject('本质错误+'+err);
    })
  });
}
/*判断用户是否登录*/
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('token')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      console.log('token'+'失败')
      reject(false);
    }
  });
}
module.exports = {
  loginByWeixin,
  checkLogin,
};