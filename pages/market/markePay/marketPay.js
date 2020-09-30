let pay = require('../../../utils/pay.js');
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
    }
  },
  onLoad: function (options) {
    this.init(options);
  },
  onShow: function () {
    
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
  //预支付
  perpay(){
    let param = {
      orderId:this.data.totle.orderId,
      rmdesc:this.data.totle.orderId,
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