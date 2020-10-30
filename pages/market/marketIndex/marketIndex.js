Page({
  data: {

  },
  onShow: function () {
    wx.reLaunch({
      url: "/pages/market/marketList/marketList"
    })
  },
})