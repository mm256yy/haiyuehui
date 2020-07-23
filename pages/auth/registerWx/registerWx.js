// pages/auth/registerWx/registerWx.js
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');
let api = require('../../../config/api.js');
let app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //手机注册
  startRegister(){
    wx.navigateTo({ 
      url: "../register/register"
    });
  },
  //微信注册
  getPhoneNumber (e) {
    let param = {
      errMsg: e.detail.errMsg,
      iv: e.detail.iv,
      encryptedData:e.detail.encryptedData,
    }
    console.log(param)
    util.request(api.AuthRegisterWx, param, 'POST').then(function(res) {
      app.globalData.hasLogin = true;
      app.fristRegister = true;
      wx.setStorageSync('userInfoMobile', res.result.mobile);
      wx.switchTab({ 
        url:"/pages/index/index"
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  }
})