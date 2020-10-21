let pay = require('../../../utils/pay.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    shopUl:[
      // {
      //   choose:false,
      //   id:'',
      //   img:'/static/images/logo.png',
      //   name:'五等广式月饼礼盒装780g中秋礼品送礼大礼包五芳合价月饼礼盒',
      //   salePrice:2400,
      //   num:2,
      //   amount:450
      // },
    ],
    totle:{
      orderId:456454546,
      num:0,
      money:0,
    },
    mode:{
      // balance:0,
      // balanceRadio:false,
    },
    pay:{
      payment:0,
      balance:0,
      total:0,
    },
  },
  onLoad: function (options) {
    this.init(options);
  },
  onShow: function () {
    this.member();
  },
  init(options){
    let shoppingCart = wx.getStorageSync("shopPay");
    let numNew = 0;
    let moneyNew = 0;
    for(let i=0;i<shoppingCart.length;i++){
      numNew += shoppingCart[i].num;
      moneyNew += shoppingCart[i].num*shoppingCart[i].salePrice;
    } 
    let totleNew = {
      orderId:options.orderId,
      num:numNew,
      money:options.money?options.money:moneyNew,
    }
    this.setData({
      shopUl:shoppingCart,
      totle:totleNew
    })
  },
  //会员余额
  member(){
    user.memberGetInfo().then(res => {
      let modeNew = {
        balance:res.result.balance*(-1),
        balanceRadio:false,
      }
      this.setData({
        mode:modeNew
      })
      this.total();
    }).catch((err) => {
      console.log(err)
    });
  },
  //选择支付类型
  bindBalanceSRadio(){
    this.setData({
      'mode.balanceRadio':!this.data.mode.balanceRadio,
    })
    this.total();
  },
  //金额计算
  total(){
    let balanceNew = 0;
    let wayNew = '微信支付'
    if(this.data.totle.money <= this.data.mode.balance&&this.data.mode.balanceRadio){
      balanceNew = this.data.totle.money;
      wayNew = '余额支付';
    }else if(this.data.totle.money>this.data.mode.balance&&this.data.mode.balanceRadio){
      balanceNew = this.data.mode.balance;
      wayNew = '微信支付 + 余额支付';
    }else{
      balanceNew = 0;
      wayNew = '微信支付';
    };
    let totalNew = parseInt(this.data.totle.money) - parseInt(this.data.pay.payment) - parseInt(balanceNew);
    let payNew = {
      payment:0,
      balance:balanceNew,
      total:totalNew,
      way:wayNew,
    };
    this.setData({
      pay : payNew ,
    });
  },
  //预支付
  perpay(){
    let param = {
      orderId:this.data.totle.orderId,
      rmdesc:this.data.totle.orderId,
      balance:this.data.pay.balance,
    }
    console.log(param);
    pay.mallPay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result=1&end=2"
      });
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result=0&end=2"
      });
    });
  },
})