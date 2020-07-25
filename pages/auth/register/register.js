let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
let app = getApp();

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
  onShow: function () {

  },
  //发送验证码
  sendCode() {
    let that = this;
    if(!check.checkMobile(this.data.mobile)){return false}

    this.setData({
      countdownShow:true
    })
    let param = {
      mobile: that.data.mobile
    }
    util.request(api.AuthRegisterCaptcha,param,'POST').then(function(res) {
      wx.showModal({title: '发送成功',content: '验证码已发送',showCancel: false});
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
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
    let that = this;
    if(!check.checkMobile(this.data.mobile)){return false}
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
      app.globalData.hasLogin = true;
      app.fristRegister = true; //首页弹窗
      app.globalData.badge = {menu:[0,0,3,0]};
      wx.setStorageSync('userInfoMobile', that.data.mobile);
      //wx.setStorageSync('userInfo', res.data.data.userInfo);
      wx.switchTab({ 
        url:"/pages/index/index"
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
})