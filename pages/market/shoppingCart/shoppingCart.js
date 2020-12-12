let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');
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
      //   amount:450,
      //   orgCode:'',
      //   spec:'',
      // },
    ],
    info:{
      mobile:'',
    },
    totle:{
      choose:false,
      money:0,
    },
    manageType:false,
    haveChoose:true,
  },
  onLoad: function (options) {
    user.goToLogin();
  },
  onShow: function () {
    this.member();
    this.init();
  },
  init(){
    let shoppingCart = wx.getStorageSync("shoppingCart");
    this.setData({
      shopUl:shoppingCart
    })
    this.totleMoney();
    this.istotleChoose();
  },
  //会员
  member(){
    user.memberGetInfoStorage().then(res => {
      this.setData({
        'info.mobile':res.result.mobile,
      })
    }).catch((err) => {
      console.log(err);
    });
  },
  //管理
  manage(){
    this.setData({
      manageType:!this.data.manageType
    })
  },
  //单选
  goodsChoose(e){
    let index = e.currentTarget.dataset.index;
    let shopUlNew = this.data.shopUl;
    shopUlNew[index].choose = !shopUlNew[index].choose
    this.setData({
      shopUl : shopUlNew
    })
    //判断是否全选
    this.istotleChoose();
    this.totleMoney();
  },
  //全选
  totleChoose(){
    let totleVal = null;
    let shopUlNew = this.data.shopUl;
    if(!this.data.totle.choose){
      totleVal = true;
    }else{
      totleVal = false;
    }
    for(let i=0;i<shopUlNew.length;i++){
      shopUlNew[i].choose = totleVal;
    }
    this.setData({
      shopUl : shopUlNew,
      'totle.choose' : !this.data.totle.choose
    })
    this.totleMoney();
    this.istotleChoose();
  },
  //判断是否全选 / 是否有一个选择
  istotleChoose(){
    let shopUlNew = this.data.shopUl;
    let len = shopUlNew.length;
    let num = 0;
    let val = false;
    let have = false;
    for(let i=0;i<len;i++){
      if(shopUlNew[i].choose){
        num ++;
        have = true
      }
    }
    if(num == len&&len != 0){
      val = true;
    }else{
      val = false;
    }
    this.setData({
      'totle.choose':val,
      haveChoose:have
    })
  },
  //计算钱
  totleMoney(){
    let shopUlNew = this.data.shopUl;
    let totleMoney = 0;
    for(let i=0;i<shopUlNew.length;i++){
      if(shopUlNew[i].choose){
        totleMoney += shopUlNew[i].salePrice*shopUlNew[i].num
      }
    }
    this.setData({
      'totle.money':totleMoney
    })
  },
  //加减数量
  goodsNum(e){
    let val = e.currentTarget.dataset.val;
    let index = e.currentTarget.dataset.index;
    let shopUlNew = this.data.shopUl;
    let num = shopUlNew[index].num;
    let amount = shopUlNew[index].amount;
    if(val == 0&&num>1){
      shopUlNew[index].num --
    }else if(val == 1&&(num<amount||amount == "不限制")){
      shopUlNew[index].num ++
    }
    wx.setStorageSync("shoppingCart", shopUlNew)
    this.setData({
      shopUl : shopUlNew
    })
    this.totleMoney();
  },
  //提交订单
  goPay(){
    let shopUlNew = this.data.shopUl;
    let goodsNewUl = [];
    let goodsNewLi = {};
    for(let i=0;i<shopUlNew.length;i++){
      if(shopUlNew[i].choose){
        goodsNewLi = {
          goodsId:shopUlNew[i].id,
          // goodsTitle:shopUlNew[i].name,
          unitPrice:shopUlNew[i].salePrice,
          amount:shopUlNew[i].num,
          totalPrice:shopUlNew[i].num*shopUlNew[i].salePrice,
          orgCode:shopUlNew[i].orgCode,
          spec:shopUlNew[i].spec,
        }
        goodsNewUl.push(goodsNewLi)
      }
    }
    if(goodsNewUl.length <= 0){
      check.showErrorToast('请勾选商品');
      return false;
    }
    //删除购物车/添加入支付储存
    let shopPayNew = [];
    for(let i=0;i<goodsNewUl.length;i++){
      for(let j=0;j<shopUlNew.length;j++){
        if(goodsNewUl[i].goodsId == shopUlNew[j].id&&goodsNewUl[i].spec == shopUlNew[j].spec){
          shopPayNew.push(shopUlNew[j])
          shopUlNew.splice(j,1);
        }
      }
    }
    wx.setStorageSync("shoppingCart", shopUlNew);
    wx.setStorageSync("shopPay", shopPayNew)

    //跳转
    wx.redirectTo({
      url: "/pages/market/markeConfirm/marketConfirm"
    })
  },
  //删除
  goDel(){
    let that = this
    wx.showModal({    
      title: '删除',
      content: '删除购物车商品',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let shopUlNew = that.data.shopUl;
          for(let i=shopUlNew.length-1;i>=0;i--){
            if(shopUlNew[i].choose){
              shopUlNew.splice(i,1);
            }
          }
          wx.setStorageSync("shoppingCart", shopUlNew);
          that.onShow();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})