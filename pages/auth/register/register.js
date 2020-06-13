const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const check = require('../../../utils/check.js');

var app = getApp();
// pages/auth/register/register.js
Page({
  data: {
    mobile: '',
    code: '',
    countdownShow:false,
    countdown:60,
    times:null
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  //发送验证码
  sendCode() {
    let that = this;
    if(!util.checkMobile(this.data.mobile)){return false}

    this.setData({
      countdownShow:true
    })
    let param = {
      mobile: that.data.mobile
    }
    util.request(api.AuthRegisterCaptcha,param,'POST').then(function(res) {
      console.log(res)
      if (res.status.code == 0) {
        wx.showModal({title: '发送成功',content: '验证码已发送',showCancel: false});
      } else {
        wx.showModal({title: '错误信息',content: res.status.message,showCancel: false});
      }
    });
    let timeNum = 60
    let time = setInterval(()=>{
      timeNum = timeNum-1
      if(timeNum<=0){
        clearInterval(time)
        that.setData({
          countdownShow:false
        })
      }else{
        that.setData({
          countdown:timeNum
        })
      }
    },1000)
    
  },
  //input焦点
  bindMobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },
  //点击
  startRegister() {
    var that = this;
    if(!util.checkMobile(this.data.mobile)){return false}
    if (this.data.code.length == 0) {
      wx.showModal({title: '错误信息',content: '验证码不能为空',showCancel: false});
      return false;
    }

    wx.login({
      success: function(res) {
        console.log(res)
        if (!res.code) {
          wx.showModal({title: '错误信息',content: '注册失败',showCancel: false});
        }
        that.requestRegister(res.code);
      }
    });
  },
  //绑定手机号
  requestRegister(wxCode) {
    console.log(wxCode)
    console.log(this.data.code)
    let that = this;
    let param = {
      mobile: that.data.mobile,
      code: that.data.code,
    }
    util.request(api.AuthRegister,param,'POST').then(function(res) {
      console.log(res)
      if (res.status.code == 0) {
        app.globalData.hasLogin = true;
        wx.setStorageSync('userInfoTel', that.data.mobile);
        //wx.setStorageSync('userInfo', res.data.data.userInfo);
        wx.navigateBack({
          delta: 3  // 返回上一级页面。
        })
      } else {
        wx.showModal({title: '错误信息',content: res.status.message,showCancel: false});
      }
    });
  },
})