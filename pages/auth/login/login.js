var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
// pages/auth/login/login.js
Page({
  data: {
    agreeRadio:false
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  wxLogin(e) {
    console.log(e.detail)
    if (!this.data.agreeRadio) {
      console.log('请勾选协议')
      util.showErrorToast('请勾选协议');
      return false;
    }
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败1');
      return;
    }
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', e.detail.userInfo);
    user.checkLogin().then(res => {
      console.log(res)
      console.log("then")
      user.loginByWeixin(e.detail.userInfo).then(res => {
        console.log(res)
        app.globalData.hasLogin = true;
        if(res.result.mobile){  //有账号
          wx.setStorageSync('userInfoTel', res.result.mobile);
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
        }else{
          console.log(res)
          wx.navigateTo({ 
            url: "../registerWx/registerWx"
          });
        }
      }).catch((err) => {
        console.log(err)
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败2');
      });
    }).catch((res) => {
      console.log(res)
      console.log("catch")
      user.loginByWeixin(e.detail.userInfo).then(res => {
        console.log(res)
        wx.setStorageSync('userInfo', e.detail.userInfo);
        app.globalData.hasLogin = true;
        if(res.result.mobile){  //有账号
          wx.setStorageSync('userInfoTel', res.result.mobile);
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
        }else{
          console.log(res)
          wx.navigateTo({ 
            url: "../registerWx/registerWx"
          });
        }
      }).catch((err) => {
        console.log(err)
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败2');
      });
    })
  },
  agree(){
    this.setData({
      agreeRadio:!this.data.agreeRadio
    })
  },
  agreeUrl(){
    wx.navigateTo({ 
      url: "../loginAgree/loginAgree"
    });
  }
})