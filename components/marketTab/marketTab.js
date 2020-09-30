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
      {img1:'/static/images/tab/index1.png',img2:'/static/images/tab/index2.png',name:'酒店',bindtap:'goIndex'},
      {img1:'/static/images/tab/mall1.png',img2:'/static/images/tab/mall2.png',name:'商城',bindtap:'goMarket'},
      {img1:'/static/images/tab/shopingcart1.png',img2:'/static/images/tab/shopingcart2.png',name:'购物车',bindtap:'goShopingCart'},
      {img1:'/static/images/tab/order1.png',img2:'/static/images/tab/order2.png',name:'订单',bindtap:'goOrder'},
    ]
  },
  methods: {
    //酒店首页
    goIndex(){
      wx.switchTab({
        url: "/pages/index/index"
      })
    },
    //商城
    goMarket(){
      wx.switchTab({
        url: "/pages/market/marketList/marketList"
      })
    },
    //购物车
    goShopingCart(){
      wx.navigateTo({
        url: "/pages/market/shoppingCart/shoppingCart"
      })
    },
    //订单
    goOrder(){
      wx.navigateTo({
        url: "/pages/market/marketOrderList/marketOrderList"
      })
    },
  }
})
