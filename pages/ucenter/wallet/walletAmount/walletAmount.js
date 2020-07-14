Page({
  data: {
    moneyShow:true,
    moneyVal:0,
    moneyValS:'0.00'
  },
  onLoad: function (options) {
    this.setData({
      moneyVal:parseInt(options.amount),
      moneyValS:(parseInt(options.amount)/100).toFixed(2),
    })
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