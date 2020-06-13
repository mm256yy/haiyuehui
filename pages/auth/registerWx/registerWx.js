// pages/auth/registerWx/registerWx.js
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  startRegister(){
    wx.navigateTo({ 
      url: "../register/register"
    });
  },
  getPhoneNumber (e) {
    let param = {
      errMsg: e.detail.errMsg,
      iv: e.detail.iv,
      encryptedData:e.detail.encryptedData,
    }
    console.log(param)
    util.request(api.AuthRegisterWx, param, 'POST').then(function(res) {
      console.log(res)
      if (res.status.code === 0) {
        app.globalData.hasLogin = true;
        wx.setStorageSync('userInfoTel', res.result.mobile);
        wx.navigateBack({
          delta: 2  // 返回上一级页面。
        })
      }
    });
  }
})