Page({
  data: {

  },
  onShow: function () {
    // wx.reLaunch({
    //   url: "/pages/market/marketList/marketList"
    // })
    wx.switchTab({ //只能用于跳转到tabbar页面,并关闭其他非tabbar页面
      url:"/pages/index/index"
    })
    wx.removeTabBarBadge({  //清除Badge
      index: 1,
    })
    wx.setStorageSync('canGoMarket', 1);
  },
})