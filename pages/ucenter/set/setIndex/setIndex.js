
Page({
  data: {
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },
  goInformation(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/information/information"
    });
  },
  goOften(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=0"
    });
  },
  goPrivacy(){
    wx.navigateTo({ 
      url: "/pages/auth/memberAgree/memberAgree"
    });
  } 
})