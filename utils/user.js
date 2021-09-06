/*用户相关服务*/
let util = require('../utils/util.js');
let api = require('../config/api.js');
let app = getApp();
// /*Promise封装wx.checkSession登陆是否过期*/
// function checkSession() {
//   return new Promise(function(resolve, reject) {
//     wx.checkSession({
//       success: function() {
//         console.log('checkSession成功')
//         resolve(true);
//       },
//       fail: function() {
//         console.log('checkSession失败')
//         reject(false);
//       }
//     })
//   });
// }
/*Promise封装wx.login*/
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
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
  let inviteCode = wx.getStorageSync('othersInviteCode');
  if (!inviteCode || inviteCode =='undefined'){
    shareUserId = '';
  }
  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      console.log(res)
      //登录远程服务器
      let pamarLogin = {
        code: res.code,
        userInfo: userInfo,
        shareUserId: shareUserId,
        inviteCode:inviteCode
      }
      console.log(pamarLogin)
      util.request(api.AuthLoginByWeixin , pamarLogin , 'POST').then(res => {
        //存储用户信息
        wx.setStorageSync('userInfo', res.result.userInfo);
        wx.setStorageSync('token', res.result.token);
        
        resolve(res);
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
    util.request(api.AuthCheckToken , 'POST').then(res => {
      resolve(res);
    }).catch((err) => {
      wx.setStorageSync('userInfo', '');
      wx.setStorageSync('token', '');
      reject(true);
    });
  });
}
/*获取会员信息 不会存储 （经常用在下订单页面，需要更新用户信息）*/
function memberGetInfo(){
  let iswhiteList = util.whiteList();
  return new Promise(function(resolve, reject) {
    util.request(api.MemberGet , 'GET').then(res => {
      getApp().globalData.memberInfo = res;
      resolve(res);
    }).catch((err) => {
      if((err == "未找到会员信息"||err == "请先绑定手机号")&&iswhiteList){  //白名单
        // wx.showModal({title: '错误信息',content: "尚未绑定手机号" ,showCancel: false}); 
      }else if((err == "未找到会员信息"||err == "请先绑定手机号")&&(!iswhiteList)){
        wx.showModal({ 
          title: '获取会员失败',
          content: '尚未绑定手机号',
          success: function(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/pages/auth/registerWx/registerWx"
              });
            } else if (res.cancel) {
              wx.navigateBack({ delta: 1 });
            }
          }
        })
      }else{
        reject(err);
      }
    });
  });
}; 
/*获取会员信息  并且储存（常用在拿到简单的会员信息页面）*/
function memberGetInfoStorage(){
  let that = this;
  return new Promise(function(resolve, reject) {
    let memberInfo = getApp().globalData.memberInfo;
    if(memberInfo){
      resolve(memberInfo);
    }else{
      that.memberGetInfo().then(res => {
        resolve(res);
      }).catch((err) => {
        reject(err)
      });
    }
  });
}; 
//跳转登陆验证
function goToLogin(){
  checkLogin().then(res => {
    console.log('已经登陆')
  }).catch((res) =>{
    console.log(res+'需要登陆');
    wx.setStorageSync('userInfo', '');
    wx.navigateTo({ 
      url: "/pages/auth/login/login"
    });
  })
};
module.exports = {
  loginByWeixin,
  checkLogin,
  memberGetInfo,
  memberGetInfoStorage,
  goToLogin,
};