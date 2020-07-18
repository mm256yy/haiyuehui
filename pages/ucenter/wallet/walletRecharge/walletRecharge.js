let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let pay = require('../../../../utils/pay.js');
Page({
  data: {
    moneyNum:'',
    moneyLi:0,
    moneyUl:[
      {money:10000,moneyS:'100元',recharge:100},
      {money:20000,moneyS:'200元',recharge:200},
      {money:30000,moneyS:'300元',recharge:300},
      {money:50000,moneyS:'500元',recharge:500},
      {money:200000,moneyS:'两千元',recharge:2000},
      {money:1000000,moneyS:'一万元',recharge:10000},
      {money:5000000,moneyS:'五万元',recharge:50000},
      {money:10000000,moneyS:'十万元',recharge:100000},
    ],
    orderId:'',
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //充值调起订单
  successBtn(){
    if(!check.checkMoney(this.data.moneyNum)){return false}
    if(this.data.moneyNum%100 != 0){
      wx.showModal({ title: '失败',content: '金额应该为100的整数倍',showCancel: false });
      return false
    }
    let param = {
      money:(api.testing?1:this.data.moneyNum*100),
    }
    console.log(param)
    util.request(api.MemberRechargeSubmit , param , 'POST').then(res => {
      console.log(res)
      this.setData({
        rechargeId:res.result
      })
      this.rechargePay(res.result)
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //调起支付
  rechargePay(rechargeId){
    let param = {
      rechargeId:rechargeId
    }
    console.log(param)
    pay.rechargePay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result=1&end=1"
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result=0&end=1"
      })
    });
  },
  //快捷选择
  rechargeFast(e){
    let recharge = e.currentTarget.dataset.money;
    let index = e.currentTarget.dataset.index;
    this.setData({
      moneyNum:recharge,
      moneyLi:index +1
    })
  },
  //input
  bindMoneyInput(e){
    this.setData({
      'moneyNum': (e.detail.value).replace(/[^\d]/g,'')
    });
  }
})