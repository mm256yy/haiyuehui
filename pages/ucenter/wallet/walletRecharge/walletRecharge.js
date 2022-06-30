let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let pay = require('../../../../utils/pay.js');
Page({
  data: {
    moneyNum:'',
    moneyChoose:0,
    moneyUl:[
      {id:1,money:10000,moneyS:'100元',moneyOnS:'100元',recharge:100},
      {id:2,money:20000,moneyS:'200元',moneyOnS:'200元',recharge:200},
      {id:3,money:50000,moneyS:'500元',moneyOnS:'500元',recharge:500},
      {id:4,money:100000,moneyS:'1000元',moneyOnS:'1000元',recharge:1000},
    ],
    ruleUl:[
      // {id:5,money:10000,moneyS:'100元',moneyOnS:'100元',recharge:100},
    ],
    orderId:'',
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.init();
  },
  init(){
    util.request(api.MemberRechargeList , 'GET').then(res => {
      let data = res.result
      let ruleUl = data.map((obj,index)=>{
        return obj = {
          id:5+index,
          money: obj.money,
          moneyS: (obj.money/100) + '元',
          moneyOnS: obj.name,
          recharge: obj.money/100,
        }
      })
      this.setData({
        ruleUl:ruleUl
      })
    }).catch((err) => {});
  },
  //充值调起订单
  successBtn(){
    if(!check.checkMoney(this.data.moneyNum)){return false}
    // if(this.data.moneyNum%100 != 0){
    //   wx.showModal({ title: '失败',content: '金额应该为100的整数倍',showCancel: false });
    //   return false
    // }
    let param = {
      money:(api.testing?Math.round(this.data.moneyNum*100):Math.round(this.data.moneyNum*100)),
    }  
    console.log(param)
    util.request(api.MemberRechargeSubmit , param , 'POST').then(res => {
      console.log(res)
      this.setData({
        rechargeId:res.result
      })
      this.rechargePay(res.result)
    }).catch((err) => {});
  },
  //调起支付
  rechargePay(rechargeId){
    let param = {
      rechargeId:rechargeId
    }
    console.log(param)
    pay.rechargePay(param).then(res => {
      //跳转
      wx.redirectTo({
        url: "/pages/customized/payResult/payResult?result=1&end=1"
      })
    }).catch(() => {
      //跳转
      wx.redirectTo({
        url: "/pages/customized/payResult/payResult?result=0&end=1"
      })
    });
  },
  //快捷选择
  rechargeFast(e){
    let recharge = e.currentTarget.dataset.money;
    let index = e.currentTarget.dataset.index;
    this.setData({
      moneyNum: recharge,
      moneyChoose: index
    })
  },
  //input
  bindMoneyInput(e){
    this.setData({
      'moneyNum': (e.detail.value).replace(/[^\d]/g,'')
    });
  }
})