let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');

let app = getApp();
Page({
  data: {
    agreeRadio:false
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //点击登陆
  wxLogin(e){
    console.log(e)
    if (!this.data.agreeRadio) {
      util.showErrorToast('请勾选协议');
      return false;
    }
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', e.detail.userInfo);
    this.login(e)
    // user.checkLogin().then(res => {   
    //   this.login(e)
    // }).catch((res) => {
    //   this.login(e)
    // })
  },
  login(e){
    user.loginByWeixin(e.detail.userInfo).then(res => {
      console.log(res)
      wx.setStorageSync('userInfo', e.detail.userInfo);
      app.globalData.hasLogin = true;
      if(res.result.mobile){  //有账号
        wx.setStorageSync('userInfoMobile', res.result.mobile);
        wx.setStorageSync('userInfoInviteCode', res.result.inviteCode);
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
      util.showErrorToast('网络连接失败');
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
      url: "../memberAgree/memberAgree"
    });
  },
})