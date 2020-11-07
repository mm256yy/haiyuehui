let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');     
Page({
  data: {
    id:1,
    detailed:{
      // id:1,
      // name:'五芳斋月饼礼盒中秋节双蛋黄莲蓉等广式月饼礼盒装780g中秋礼品送礼大礼包五芳合价月饼礼盒',
      // categoryId:2,
      // img:'',
      // sliderImg:[],
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
      // noticeLimit:[],
      // noticeRefund:[],
      // noticeDate:[],
      // noticeRule:[],
      // noticePoint:[],
    },
    pop:false,
    goodsNum:1,
    redTip:1,
    buyMode:0, //0 加入购物车 1 立即购买
    numTipShow:0,
    info:{
      mobile:'',
    },
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  onShow: function () {
    // user.goToLogin();
    this.member();
    this.init();
  },
  //点击转发按钮
  onShareAppMessage: function (ops) {
    let that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: (that.data.detailed.name).slice(0,30)+'...',
      imageUrl:that.data.detailed.sliderImg[0],//图片地址
      path:'/pages/market/marketDetailed/marketDetailed?id='+that.data.detailed.id,// 用户点击首先进入的当前页面
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
  },
  init(){
    let param = {
      id:this.data.id
    }
    util.request(api.MallGoodsDetail , param , 'GET').then(res => {
      let data = res.result;
      //轮播图
      let sliderImgNew = data.sliderImg.split(',');
      //订购须知
      let noticeUl = [];
      let noticeLi = [];
      noticeLi = data.orderingInfo.split('|');
      for(let i=0;i<noticeLi.length;i++){
        noticeUl[i] = noticeLi[i].split('\n');
      }
      //图文详情
      let contentNew = data.content.replace(/width="300"/g,'width="100%"').replace(/display: block/g,'display: block;padding-bottom: 10px;').replace(/height="300"/g,'');
      let detailedNew = {
        id:data.id,
        name:data.title,
        categoryId:data.categoryId,
        img:data.img,
        sliderImg:sliderImgNew,
        price:data.price,
        salePrice:data.salePrice,
        content:contentNew, //图片详情
        shareUrl:data.shareUrl,
        introduce:data.instruction,
        sort:data.sort,
        amount:data.amount,  //库存
        isNew:data.isNew, //1 是 0 否
        isHot:data.isHot, //1 是 0 否
        isOnSale:data.isOnSale, //1 上架 0下架
        browse:data.browse,  //浏览量
        sales:data.sales,
        noticeLimit:noticeUl[0],
        noticeRefund:noticeUl[1],
        noticeDate:noticeUl[2],
        noticeRule:noticeUl[3],
        noticePoint:noticeUl[4],
      };
      this.setData({
        detailed:detailedNew,
      })
      this.redTipNum();
      console.log(bannerUrlsNew)
    }).catch((err) => {});
  },
  //会员
  member(){
    user.memberGetInfo().then(res => {
      this.setData({
        'info.mobile':res.result.mobile,
      })
    }).catch((err) => {
      console.log(err);
    });
  },
  //判断商品购物车数量
  redTipNum(){
    let shoppingCartUl = [];
    let num = 0;
    if(wx.getStorageSync("shoppingCart")){
      shoppingCartUl = wx.getStorageSync("shoppingCart");
    }
    if(shoppingCartUl.length>0){
      for(let i=0;i<shoppingCartUl.length;i++){
        if(shoppingCartUl[i].id == this.data.detailed.id){
          num = shoppingCartUl[i].num;
        }
      }
    }
    console.log(num)
    this.setData({
      redTip:num
    })
  },
  //去购物车
  goShopingCart(){
    wx.navigateTo({
      url: "/pages/market/shoppingCart/shoppingCart"
    })
  },
  //添加购物车
  addShopingCart(){
    let shoppingCartUl = [];
    let isExist = false;
    let index = 0;
    if(wx.getStorageSync("shoppingCart")){
      shoppingCartUl = wx.getStorageSync("shoppingCart");
    }
    if(shoppingCartUl.length>0){
      for(let i=0;i<shoppingCartUl.length;i++){
        if(shoppingCartUl[i].id == this.data.detailed.id){
          isExist = true;
          index = i;
        }
      }
    }
    if(isExist){
      shoppingCartUl[index].num += this.data.goodsNum;
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
    wx.setStorageSync("shoppingCart", shoppingCartUl)
    this.popShow(null);
    this.setData({
      redTip:this.data.redTip += this.data.goodsNum
    });
    this.animation();
  },  
  //添加购物车动画效果
  animation(){
    this.setData({
      numTipShow:1,  
    })
    let that = this;
    setTimeout(function(){
      var animation = wx.createAnimation({
        duration:200,
        timingFunction:"ease",  
      })
      animation.translate(-50, 50).opacity(0).step();  
      that.setData({
        animationData:animation.export(),   //设置完毕
      })
      setTimeout(function(){
        animation.translate(0, 0).step();
        that.setData({
          animationData:animation.export()
        })
      },1000)
    },100)
  },
  //立即购买
  buy(){
    let goodsNewUl = [];
    let goodsNewLi = {
      goodsId:this.data.detailed.id,
      // goodsTitle:this.data.detailed.name,
      unitPrice:this.data.detailed.salePrice,
      amount:this.data.goodsNum,
      totalPrice:this.data.goodsNum*this.data.detailed.salePrice
    };
    goodsNewUl.push(goodsNewLi)
    let param = {
      goods:goodsNewUl,
      mobile:this.data.info.mobile,
      money:this.data.goodsNum*this.data.detailed.salePrice
    }
    console.log(param)
    util.request(api.MallOrderSubmit , param , 'POST').then(res => {
      let shopPayNew = [];
      let shopPayLi = {
        choose:false,
        id:this.data.detailed.id,
        name:this.data.detailed.name,
        img:this.data.detailed.img,
        salePrice:this.data.detailed.salePrice,
        amount:this.data.detailed.amount,
        num:this.data.goodsNum,
      };
      shopPayNew.push(shopPayLi)
      wx.setStorageSync("shopPay", shopPayNew)

      //跳转
      wx.redirectTo({
        url: "/pages/market/markePay/marketPay?money="+res.result.money+"&orderId="+res.result.orderId
      })
    }).catch((err) => {});
  },
  //弹窗显示
  popShow(e){
    let mode = 0;
    if(e){
      mode = e.currentTarget.dataset.mode
    }
    this.setData({
      pop:!this.data.pop,
      buyMode:mode
    })
  },
  //商品数量加减
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