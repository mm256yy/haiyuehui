// pages/activity/actList/index.js
Page({
  data: {
    menuUl:[
      {name:' 全部 ',val:0},
      {name:'酒店客房',val:1},
      {name:'餐饮',val:2},
      {name:'礼品',val:3},
    ],
    menuVal:0,
    goodsUl:[
      {img:'/static/images/logo.png',name:'测试产品123123',introduce:'这是一个测试产品打扫打扫打扫的大事',categoryId:'',price:'123',salePrice:'110',content:'',shareUrl:'',},
      {img:'/static/images/logo.png',name:'试产品1试产品1试产品1测试产品123123',introduce:'这是一个测试产品打扫打扫打扫的大事',categoryId:'',price:'66',salePrice:'55',content:'',shareUrl:'',},
      {img:'/static/images/logo.png',name:'测试产品123123',introduce:'这是一个测试产品打扫打扫打扫的大事',categoryId:'',price:'4142',salePrice:'3500',content:'',shareUrl:'',},
      {img:'/static/images/logo.png',name:'测试产品123123',introduce:'这是一个测试产品打扫打扫打扫的大事',categoryId:'',price:'0.23',salePrice:'0.00',content:'',shareUrl:'',},
    ]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  goGoodsDetailed(){
    wx.navigateTo({
      url: "/pages/market/marketDetailed/marketDetailed"
    })
  },
})