let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
let user = require('../../../utils/user.js');

let app = getApp();
Page({
  data: {
    agreeRadio:true,
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //点击登陆
  wxLogin(e){
    console.log(e)
    if (!this.data.agreeRadio) {
      check.showErrorToast('请勾选协议');
      return false;
    }
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      check.showErrorToast('微信登录失败');
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.login(e)
  },
  login(e){
    user.loginByWeixin(e.detail.userInfo).then(res => {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      app.globalData.hasLogin = true;
      if(res.result.mobile){  //有账号
        wx.setStorageSync('userInfoMobile', res.result.mobile);
        wx.setStorageSync('userInfoInviteCode', res.result.inviteCode);
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }else{
        let pages = getCurrentPages();
        if(pages.length <= 1){
          wx.navigateTo({
            url: "/pages/auth/registerWx/registerWx"
          });
        }else{
          wx.redirectTo({
            url: "/pages/auth/registerWx/registerWx"
          });
        }
      }
    }).catch((err) => {
      app.globalData.hasLogin = false;
    });
  },
  //点击协议
  agree(){
    this.setData({
      agreeRadio:!this.data.agreeRadio
    })
  },
  //协议链接
  agreeUrl(){
    wx.navigateTo({ 
      url: "/subpackage/pages/member/memberAgree/memberAgree"
    });
  },
  //登陆取消
  loginCancel(){
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  }
})