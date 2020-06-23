
Page({
  data: {
    info:{
      identity:0,
      name:'',
    }
  },
  onLoad: function (options) {
    this.init();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  init(){
  },
  goInformation(){
    wx.navigateTo({ 
      url: "../information/information"
    });
  },
  goOften(){
    wx.navigateTo({ 
      url: "../oftenList/oftenList"
    });
  },
  goPrivacy(){
    wx.navigateTo({ 
      url: "../../../auth/loginAgree/loginAgree"
    });
  } 
})