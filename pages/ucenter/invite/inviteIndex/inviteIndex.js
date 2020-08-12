Page({
  data: {
    inviteActivity:[],
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  inviteCode(){
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteCode/inviteCode"
    })
  },
  inviteIncome(){
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteIncome/inviteIncome"
    })
  },
  inviteList(){
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteList/inviteList"
    })
  },
})