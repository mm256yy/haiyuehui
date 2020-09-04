
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
  } 
})