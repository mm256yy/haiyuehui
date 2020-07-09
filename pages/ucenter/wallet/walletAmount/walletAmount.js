Page({
  data: {
    moneyShow:true,
    moneyVal:250036,
    moneyValS:'2500.36'
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  moneyHide(){
    this.setData({
      moneyShow:!this.data.moneyShow
    })
  },
  //充值
  moneyRecharge(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletRecharge/walletRecharge"
    })
  },
  //消费记录
  moneyConsume(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletConsume/walletConsume"
    })
  },
  //常见问题
  moneyProblem(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletProblem/walletProblem"
    })
  },
})