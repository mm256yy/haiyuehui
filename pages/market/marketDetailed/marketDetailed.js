let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
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
      // content:'这是一个测试产品打扫打扫打扫的大事',
      // shareUrl:'',
      // introduce:'这是一个测试产品打扫打扫打扫的大事',
      // sort:'',
      // amount:320,  //库存 值为-1 时为不限制
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
      // orgCode:'',  //商品属于哪个部门
      // isSingle:0,  //是否单独购买 1 是(不能加入购物车) 0 否 null 否\
    },
    pop:false,
    goodsNum:1,
    redTip:1,
    buyMode:0, //0 加入购物车 1 立即购买
    numTipShow:0,
    total:{
      // price:23000,  //优惠前
      // salePrice:22000, //优惠后
      // discount:95,  //折扣 
      // money:'',
    },
    specList:[
      // {
      //   name:"颜色",
      //   list:[
      //     {name:'黑色',choose:false,can:true},
      //     {name:'白色',choose:false,can:true}
      //   ]
      // },
    ],
    productList:[
      // {spec:'白色,150ml',price:100,amount:1},
      // {spec:'白色,250ml',price:200,amount:1},
      // {spec:'黑色,150ml',price:300,amount:1},
      // {spec:'黑色,250ml',price:400,amount:1},
    ],
    specChoose:[],
    info:{
      cardLevel:'',
    },
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  onShow: function () {
    this.member();
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
  //会员
  member(){
    user.memberGetInfoStorage().then(res => {
      this.setData({
        'info.cardLevel':res.result.cardLevel
      })
      this.init();
    }).catch((err) => {
      console.log(err)
    });
  },
  init(){
    let param = {
      id:this.data.id,
      cardLevel:this.data.info.cardLevel
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
        content:contentNew, //图片详情
        shareUrl:data.shareUrl,
        introduce:data.instruction,
        sort:data.sort,
        amount:data.amount == -1?'不限制':data.amount,  //库存
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
        orgCode:data.orgCode,
        isSingle:data.isSingle,
      };
      //规格
      let specListNew = '';
      let spec_o_ul = [];
      let spec_o_li = {};
      let spec_i_ul = [];
      let spec_i_li = {};
      if(data.specList){
        for(let i=0;i<data.specList.length;i++){
          for(let j=0;j<data.specList[i].list.length;j++){
            spec_i_li = {
              name:data.specList[i].list[j],
              choose:false,
              can:true,
            }
            spec_i_ul.push(spec_i_li)
          }
          spec_o_li = {
            name:data.specList[i].name,
            list:spec_i_ul,
          }
          spec_i_ul = [];
          spec_o_ul.push(spec_o_li)
        }
        specListNew = spec_o_ul;
      }
      //规格组合
      let productListNew = [];
      let product_o_ul = [];
      let product_o_li = {};
      if(data.productList){
        for(let i=0;i<data.productList.length;i++){
          product_o_li = {
            spec:data.productList[i].spec,
            price:data.productList[i].price,
            amount:data.productList[i].amount == -1?'不限制':data.productList[i].amount,
          }
          product_o_ul.push(product_o_li)
        }
        productListNew = product_o_ul;
      }
      //价格
      let totalNew = {
        price:data.price,
        salePrice:data.salePrice,
        discount:data.discount,
        money:0,
      }
      this.setData({
        detailed:detailedNew,
        total:totalNew,
        specList:specListNew,
        productList:productListNew,
      })
      this.redTipNum();
      this.total();
    }).catch((err) => {});
  },
  //总计
  total(){
    let moneyNew = 0;
    if(this.data.total.discount > 0){
      moneyNew = parseInt(this.data.total.discount)/100*this.data.total.salePrice
    }else{
      moneyNew = this.data.total.salePrice
    }
    
    this.setData({
      'total.money':moneyNew
    })
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
    let can = this.funChooseCan();
    if(can){
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
      if(isExist){  //是否存在同等商品
        shoppingCartUl[index].num += this.data.goodsNum;
      }else{
        let shoppingCartLi = {
          choose:false,
          id:this.data.detailed.id,
          name:this.data.detailed.name,
          img:this.data.detailed.img,
          salePrice:this.data.total.salePrice,
          amount:this.data.detailed.amount,
          num:this.data.goodsNum,
          orgCode:this.data.detailed.orgCode,
          spec:this.data.specChoose.join("$"),
        }
        shoppingCartUl.push(shoppingCartLi);
      }
      wx.setStorageSync("shoppingCart", shoppingCartUl)
      this.popShow(null);
      this.setData({
        redTip:this.data.redTip += this.data.goodsNum
      });
      this.animation();
    }else{
      check.showErrorToast('请选择商品规格')
    }
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
    let can = this.funChooseCan();
    if(can){
      //添加入支付储存
      let shopPayNew = [];
      let shopPayLi = {
        choose:false,
        id:this.data.detailed.id,
        name:this.data.detailed.name,
        img:this.data.detailed.img,
        salePrice:this.data.total.salePrice,
        amount:this.data.detailed.amount,
        num:this.data.goodsNum,
        orgCode:this.data.detailed.orgCode,
        spec:this.data.specChoose.join("$"),
      };
      shopPayNew.push(shopPayLi)
      wx.setStorageSync("shopPay", shopPayNew)

      //跳转
      wx.redirectTo({
        url: "/pages/market/markeConfirm/marketConfirm?discount="+this.data.total.discount
      })
    }else{
      check.showErrorToast('请选择商品规格')
    }
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
    let amount = this.data.detailed.amount
    if(val == 0&&num>1){
      num --
    }else if(val == 1&&(num<amount||amount == "不限制")){
      num ++
    }
    this.setData({
      goodsNum : num
    })
  },
  goWalletRecharge(){
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletRecharge/walletRecharge"
    })
  },
  //规格选择
  funSpecChoose(e){
    let index1 = e.currentTarget.dataset.index1;
    let index2 = e.currentTarget.dataset.index2;
    let specListNew = this.data.specList;
    let specChooseNew = this.data.specChoose;
    for(let i=0;i<specListNew[index1].list.length;i++){
      specListNew[index1].list[i].choose = false;
    }
    specListNew[index1].list[index2].choose = true;
    specChooseNew[index1] = specListNew[index1].list[index2].name;
    this.setData({
      specList:specListNew,
      specChoose:specChooseNew
    })
    //判断生成价格
    let can = this.funChooseCan();
    let productListNew = this.data.productList;
    let salePrice = this.data.total.salePrice;
    if(can){
      for(let i=0;i<productListNew.length;i++){
        if(specChooseNew.join("$") == productListNew[i].spec){
          salePrice = productListNew[i].price
        }
      }
      this.setData({
        'total.salePrice':salePrice
      })
    }
    //判断是否有这个规格组合
    // let name = specListNew[index1].list[index2].name
    // for(let i=0;i<productListNew.length;i++){
    //   if(productListNew[i].spec.split('$')[index1] == name){
    //     for(let j=0;j<specListNew[index1].list.length;j++){
    //       if(specListNew[index1].list[j].name == productListNew[i].spec.split('$')[index1]){

    //       }else{

    //       }
    //     }
    //   }else{

    //   }
    // }
  },
  //判断规格是否全部选中
  funChooseCan(){
    let len = this.data.specList.length;
    let specChooseNew = this.data.specChoose;
    let num = 0;
    for(let i=0;i<len;i++){
      if(specChooseNew[i]){
        num ++
      }
    }
    if(num == len){
      return true;
    }else{
      return false;
    }
  }
})