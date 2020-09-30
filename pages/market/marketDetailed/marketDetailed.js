let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
Page({
  data: {
    bannerUrls:[
      // '/static/images/logo.png',
    ],
    detailed:{
      // id:1,
      // name:'五芳斋月饼礼盒中秋节双蛋黄莲蓉等广式月饼礼盒装780g中秋礼品送礼大礼包五芳合价月饼礼盒',
      // categoryId:2,
      // img:'',
      // price:23000,
      // salePrice:22000,
      // content:'这是一个测试产品打扫打扫打扫的大事',
      // shareUrl:'',
      // introduce:'这是一个测试产品打扫打扫打扫的大事',
      // sort:'',
      // amount:320,  //库存
      // isNew:0, //1 是 0 否
      // isHot:0, //1 是 0 否
      // isOnSale:1, //1 上架 0下架
      // browse:2300,  //浏览量
      // sales:55,
    },
    pop:false,
    goodsNum:1,
  },
  onLoad: function (options) {
    this.init(options)
  },
  onShow: function () {

  },
  init(options){
    let orderId = options.orderId;
    let param = {
      id:orderId
    }
    util.request(api.MallGoodsDetail , param , 'GET').then(res => {
      let data = res.result;
      let detailedNew = {
        id:data.id,
        name:data.title,
        categoryId:data.categoryId,
        img:data.img,
        price:data.price,
        salePrice:data.salePrice,
        content:data.content,
        shareUrl:data.shareUrl,
        introduce:data.instruction,
        sort:data.sort,
        amount:data.amount,  //库存
        isNew:data.isNew, //1 是 0 否
        isHot:data.isHot, //1 是 0 否
        isOnSale:data.isOnSale, //1 上架 0下架
        browse:data.browse,  //浏览量
        sales:data.sales,
      };
      let bannerUrlsNew = [];
      bannerUrlsNew[0] = data.detailImg
      this.setData({
        detailed:detailedNew,
        bannerUrls:bannerUrlsNew,
      })
      console.log(bannerUrlsNew)
    }).catch((err) => {});
  },
  goShopingCart(){
    wx.navigateTo({
      url: "/pages/market/shoppingCart/shoppingCart"
    })
  },
  addShopingCart(){
    let shoppingCartUl = [];
    let isExist = false;
    let index = 0;
    if(wx.getStorageSync("shoppingCart")){
      shoppingCartUl = wx.getStorageSync("shoppingCart");
    }
    console.log(this.data.detailed.id)
    if(shoppingCartUl.length>0){
      for(let i=0;i<shoppingCartUl.length;i++){
        if(shoppingCartUl[i].id == this.data.detailed.id){
          isExist = true;
          index = i;
        }
      }
    }
    console.log(isExist)
    if(isExist){
      shoppingCartUl[index].num += this.data.goodsNum
    }else{
      let shoppingCartLi = {
        choose:false,
        id:this.data.detailed.id,
        name:this.data.detailed.name,
        img:this.data.detailed.img,
        salePrice:this.data.detailed.salePrice,
        amount:this.data.detailed.amount,
        num:this.data.goodsNum,
      }
      shoppingCartUl.push(shoppingCartLi);
    }
    console.log(shoppingCartUl)
    wx.setStorageSync("shoppingCart", shoppingCartUl)
    this.goShopingCart()
  },  
  popShow(){
    this.setData({
      pop:!this.data.pop
    })
  },
  goodsNum(e){
    let val = e.currentTarget.dataset.val;
    let num = this.data.goodsNum
    if(val == 0&&num>1){
      num --
    }else if(val == 1){
      num ++
    }
    this.setData({
      goodsNum : num
    })
  }
})