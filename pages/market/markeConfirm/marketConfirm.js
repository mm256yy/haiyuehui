let api = require('../../../config/api.js');
let pay = require('../../../utils/pay.js');
let user = require('../../../utils/user.js');
let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
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
      subtotal:0, // 小计
      discount:100,  //zh折扣
      money:0,  //结算
    },
    mode:{
      // balance:0,
      // balanceRadio:false,
    },
    pay:{
      payment:0,
      balance:0,
      total:0,
      remark:'',
    },
    info:{
      mobile:''
    },
  },
  onLoad: function (options) {
    this.setData({
      'totle.discount':check.existValue(options.discount)?options.discount:100
    })
    this.init();
  },
  onShow: function () {
    this.member();
  },
  init(){
    let shoppingCart = wx.getStorageSync("shopPay");
    let numNew = 0;
    let subtotalNew = 0;
    let moneyNew = 0;
    for(let i=0;i<shoppingCart.length;i++){
      numNew += shoppingCart[i].num;
      subtotalNew += shoppingCart[i].num*shoppingCart[i].salePrice;
    } 
    moneyNew = parseInt(subtotalNew*this.data.totle.discount/100);
    let totleNew = {
      orderId:'',
      num:numNew,
      subtotal:subtotalNew,
      discount:parseInt(this.data.totle.discount),
      money:moneyNew,
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
      let infoNew = {
        mobile:res.result.mobile
      }
      this.setData({
        mode:modeNew,
        info:infoNew,
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
  //下单
  preOrder(){
    let shopUlNew = wx.getStorageSync("shopPay");
    let goodsNewUl = [];
    let goodsNewLi = {};
    for(let i=0;i<shopUlNew.length;i++){
      goodsNewLi = {
        goodsId:shopUlNew[i].id,
        unitPrice:shopUlNew[i].salePrice,
        amount:shopUlNew[i].num,
        totalPrice:shopUlNew[i].num*shopUlNew[i].salePrice,
        orgCode:shopUlNew[i].orgCode,
        spec:shopUlNew[i].spec
      }
      goodsNewUl.push(goodsNewLi)
    }
    let param = {
      goods:goodsNewUl,
      mobile:this.data.info.mobile,
      money:this.data.totle.money,
      remark:this.data.pay.remark,
      discount:this.data.totle.discount == 100?'':this.data.totle.discount,
    }
    util.request(api.MallOrderSubmit , param , 'POST').then(res => {
      wx.setStorageSync("shopPay", '');
      //跳转
      wx.redirectTo({
        url: "/pages/market/marketPay/marketPay?money="+this.data.totle.money+"&orderId="+res.result.orderId+"&rmdesc="+res.result.orderId
      })
      // this.perpay(res.result.orderId)
    }).catch((err) => {});
  },
  //预支付
  // perpay(orderId){
  //   let param = {
  //     orderId:orderId,
  //     rmdesc:orderId,
  //     balance:this.data.pay.balance,
  //   }
  //   console.log(param);
  //   pay.mallPay(param).then(res => {
  //     //跳转
  //     wx.navigateTo({
  //       url: "/pages/customized/payResult/payResult?result=1&end=2"
  //     });
  //   }).catch(() => {
  //     //跳转
  //     wx.navigateTo({
  //       url: "/pages/customized/payResult/payResult?result=0&end=2"
  //     });
  //   });
  // },
  //input焦点 
  bindRemarkInput: function(e) { 
    let remarkNew = e.detail.value.substring(0,100);
    this.setData({
      'pay.remark':remarkNew
    })
  },
})