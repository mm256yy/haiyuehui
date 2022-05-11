let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    moneyMax:'',//100
    moneyNum:'',//1
  },
  onLoad: function (options) {
    this.setData({
      moneyMax:options.moneyMax
    })
  },
  onShow: function () {

  },
  //提现全部
  totlaMoney(){
    let money = this.data.moneyMax
    this.setData({
      moneyNum:(money/100).toFixed(2)
    })
  },
  successBtn(){
    let num = this.data.moneyNum*100;
    let max = this.data.moneyMax;
    if(num == 0){
      check.showErrorToast('提现金额不能为零')
      return false;
    }else if(num == ''||!num||num<1){
      console.log(num)
      check.showErrorToast('请输入提现金额')
      return false;
    }else if(num > max){
      check.showErrorToast('提现的金额高于可提现金额')
      return false;
    }
    util.request(api.HongbaocashOut+'?money='+num , 'GET').then(res => {
      console.log(res)
      //跳转
      wx.redirectTo({
        url: "/pages/customized/payResult/payResult?result=2&end=5"
      });
    }).catch((err) => {
      console.log(err)
      //跳转
      wx.redirectTo({
        url: "/pages/customized/payResult/payResult?result=3&end=5"
      });
    });
  },
  //input
  bindMoneyInput(e){
    this.setData({
      // 'moneyNum': (e.detail.value).replace(/[^\d]/g,'')
      'moneyNum': (e.detail.value)
    });
  }
})