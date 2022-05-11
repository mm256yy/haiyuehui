
let check = require('../../../../utils/check.js');
Page({
  data: {
    
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },
  goOut(){
    wx.setStorageSync('token', '');
    wx.setStorageSync('userInfo', '');
    wx.switchTab({ 
      url:"/pages/ucenter/index/index"
    })
  },
  debug(){
    let debug = wx.getStorageSync('debug');
    if(debug){ //调试状态
      check.showSuccessToast('关闭')
      wx.removeStorageSync('debug')
    }else{
      check.showSuccessToast('打开')
      wx.setStorageSync('debug', true);
    }
  }
})