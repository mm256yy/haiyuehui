let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
Page({
  data: {
    moneyShow:true,
    moneyVal:0,
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.member();
  },
  member(){
    user.memberGetInfo().then(res => {
      let money = res.result.balance*(-1);
      this.setData({
        moneyVal:money,
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  //隐藏金额
  moneyHide(){
    this.setData({
      moneyShow:!this.data.moneyShow
    });
  },
  //充值
  moneyRecharge(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletRecharge/walletRecharge"
    });
  },
  //消费记录
  moneyConsume(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletConsume/walletConsume"
    });
  },
  //常见问题
  moneyProblem(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletProblem/walletProblem"
    });
  },
})