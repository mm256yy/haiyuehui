var util = require('../../../../utils/util.js');
var check = require('../../../../utils/check.js');
var api = require('../../../../config/api.js');

Page({
  data: {
    moneyNum:'',
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //充值
  successPay(){
    if(!check.checkMoney(this.data.moneyNum)){return false}
    console.log(this.data.moneyNum)
  },
  //input
  bindMoneyInput(e){
    this.setData({
      'moneyNum': (e.detail.value).replace(/[^\d]/g,'')
    });
  }
})