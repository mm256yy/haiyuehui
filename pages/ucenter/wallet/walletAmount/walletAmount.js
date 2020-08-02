let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');

Page({
  data: {
    moneyShow:true,
    moneyVal:0,
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.init();
  },
  init(){
    util.request(api.MemberGet, 'GET').then(res => {
      let money = res.result.balance*(-1);
      this.setData({
        moneyVal:money,
      });
    }).catch((err) => {
      if(err == "未找到会员信息"){
        wx.showModal({ 
          title: '获取会员失败',
          content: '你未绑定手机号码',
          success: function(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/pages/auth/registerWx/registerWx"
              });
            } else if (res.cancel) {
              wx.navigateBack({ 
                delta: 1  
              });
            }
          }
        })
      }else{
        wx.showModal({title: '错误信息',content: err ,showCancel: false}); 
      }
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