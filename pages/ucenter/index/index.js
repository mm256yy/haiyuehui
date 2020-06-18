// pages/ucenter/index/index.js
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    ucenter:{
      tou:'../../../static/images/person.png',
      name:'点击登陆',
      vip:'贵宾会员',
      progressVal:'0',
      progressTop:'1000',
    },
    menuUl:[
      {
        bindtap:'orderList',
        img:'../../../static/images/u-menu1.png',
        text:'我的订单'
      },
      {
        bindtap:'meeting',
        img:'../../../static/images/u-menu5.png',
        text:'会议与团队'
      },
      {
        bindtap:'coupon',
        img:'../../../static/images/u-menu2.png',
        text:'我的劵包'
      },
      {
        bindtap:'wallet',
        img:'../../../static/images/u-menu3.png',
        text:'我的钱包'
      }
      /*{
        bindtap:'',
        img:'../../../static/images/u-menu4.png',
        text:'全民营销'
      },*/
    ],
    memberUl:[
      {
        power:0,
        img:'../../../static/images/power/power0.png',
        text1:'生日特权',
        text2:'免费蛋糕劵'
      },
      {
        power:0,
        img:'../../../static/images/power/power0.png',
        text1:'生日特权',
        text2:'免费蛋糕劵'
      },
      {
        power:0,
        img:'../../../static/images/power/power0.png',
        text1:'生日特权',
        text2:'免费蛋糕劵'
      },
      {
        power:0,
        img:'../../../static/images/power/power0.png',
        text1:'生日特权',
        text2:'免费蛋糕劵'
      },
      {
        power:0,
        img:'../../../static/images/power/power0.png',
        text1:'生日特权',
        text2:'免费蛋糕劵'
      },

    ],
    otherIcon:[
      {img:'../../../static/images/service/service0.png',text:'住房延期'},
      {img:'../../../static/images/service/service1.png',text:'账单查询'},
      {img:'../../../static/images/service/service2.png',text:'我的发票'},
      {img:'../../../static/images/service/service3.png',text:'关于我们'},
      {img:'../../../static/images/service/service4.png',text:'线上买单'},
      {img:'../../../static/images/service/service5.png',text:'迷你吧'},
      {img:'../../../static/images/service/service6.png',text:'快递上楼'},
      {img:'../../../static/images/service/service7.png',text:'打扫服务'},
      {img:'../../../static/images/service/service8.png',text:'客耗品'},
      {img:'../../../static/images/service/service9.png',text:'物品租赁'},
      {img:'../../../static/images/service/service10.png',text:'洗衣服务'},
      {img:'../../../static/images/service/service11.png',text:'叫醒服务'},
    ],
    badge:{
      menu:[0,0,0,0,0]
    }
  },
  onLoad: function () {
  },
  onReady: function () {
  },
  onShow: function () {
    console.log(app.globalData)
    //获取红点
    let badgeNew = app.globalData.badge
    if(badgeNew){
      this.setData({
        badge:badgeNew
      })
      wx.setTabBarBadge({
        index: 1,
        text:'1',
        success: res => { console.log(res) },
        fail: res => { console.error }
      })
    }
    //获取用户信息
    let userInfo = "";
    let ucenterNew = "";
    if(userInfo){
      userInfo = wx.getStorageSync("userInfo") 
    }else if(app.globalData.userInfo){
      userInfo = app.globalData.userInfo
    }else{
      return false
    }
    ucenterNew = {
      tou:userInfo.avatarUrl,
      name:userInfo.nickName,
      vip:'贵宾会员',
      progressVal:'0',
      progressTop:'1000',
    }
    this.setData({
      ucenter:ucenterNew
    })
  },
  onHide: function () {

  },
  //设置
  set(){
    wx.navigateTo({
      url: "../set/set"
    })
  },
  //点击登陆
  sign(){
    wx.navigateTo({
      url: "../../auth/login/login"
    })
  },
  //我的订单
  orderList(){
    this.setData({
      'badge.menu':[0,0,0,0]
    })
    app.globalData.badge = "";
    wx.removeTabBarBadge({
      index: 1,
      success: res => { console.log(res) },
      fail: res => { console.error }
    })
    wx.navigateTo({
      url: "../orderList/orderList"
    })
  },
  //我的劵包
  coupon(){
    util.showErrorToast("暂未开放")
    /*wx.navigateTo({
      url: "../coupon/coupon"
    })*/
  },
  //会议与团队
  meeting(){
    util.showErrorToast("暂未开放")
    /*wx.navigateTo({
      url: "../teamNumber/teamNumber"
    })*/
  },
  //我的钱包
  wallet(){
    util.showErrorToast("暂未开放")
  },
})