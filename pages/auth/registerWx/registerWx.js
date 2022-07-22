
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
    wx.redirectTo({ 
      url: "/pages/auth/register/register"
    });
  },
  //微信注册
  getPhoneNumber (e) {
    let param = {
      errMsg: e.detail.errMsg,
      iv: e.detail.iv,
      encryptedData:e.detail.encryptedData,
    }
    util.request(api.AuthRegisterWx, param, 'POST').then(function(res) {
      app.globalData.hasLogin = true;
      app.fristRegister = true;  //首页弹窗
      app.globalData.badge = {menu:[0,3,0,0]};
      wx.navigateBack({ 
        delta: 1 
      }); 
      wx.setStorageSync('userInfoMobile', res.result.mobile||"未获取到手机号");
    }).catch((err) => {});
  }
})