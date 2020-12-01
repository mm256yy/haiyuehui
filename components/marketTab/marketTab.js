// components/marketTab/marketTab.js
Component({
  properties: {
    tabVal:{
      type:String,
      value:'',
    }
  },
  data: {
    footUl:[
      // {img1:'/static/images/tab/index1.png',img2:'/static/images/tab/index2.png',name:'酒店',bindtap:'goIndex'},
      {img1:'/static/images/tab/mall1.png',img2:'/static/images/tab/mall2.png',name:'商城',bindtap:'goMarket',badge:0},
      {img1:'/static/images/tab/shopingcart1.png',img2:'/static/images/tab/shopingcart2.png',name:'购物车',bindtap:'goShopingCart',badge:0},
      {img1:'/static/images/tab/exchange1.png',img2:'/static/images/tab/exchange2.png',name:'兑换码',bindtap:'goExchange',badge:0},
      {img1:'/static/images/tab/order1.png',img2:'/static/images/tab/order2.png',name:'订单',bindtap:'goOrder',badge:0},
    ]
  },
  ready:function(){
    this.badgeShow();
  },
  methods: {
    //badge
    badgeShow(){
      let badge = wx.getStorageSync('marketBadge');
      let footUlNew = this.data.footUl
      for(let i=0;i<badge.length;i++){
        if(badge[i] > 0){
          footUlNew[i].badge = 1;
        }
      }
      this.setData({
        footUl:footUlNew
      })
    },
    badgeHide(e){
      var arr = e.val
      let footUlNew = this.data.footUl;
      let badge = wx.getStorageSync('marketBadge');
      footUlNew[arr].badge = 0;
      this.setData({
        footUl:footUlNew
      })
      if(badge){
        badge[arr] = 0;
        wx.setStorageSync('marketBadge', badge);
      }
    },
    //商城
    goMarket(){
      wx.redirectTo({
        url: "/pages/market/marketList/marketList"
      })
    },
    //购物车
    goShopingCart(){
      wx.redirectTo({
        url: "/pages/market/shoppingCart/shoppingCart"
      })
    },
    //兑换码
    goExchange(){
      wx.redirectTo({
        url: "/pages/market/marketExchange/marketExchange"
      })
    },
    //订单
    goOrder(){
      wx.redirectTo({
        url: "/pages/market/marketOrderList/marketOrderList"
      })
    },
  }
})
