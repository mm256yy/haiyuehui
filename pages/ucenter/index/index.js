
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');
let check = require('../../../utils/check.js');
let app = getApp();
Page({
  data: {
    isLogin:false,
    ucenter:{
      tou:'/static/images/person.jpg',
      name:'点击登陆',
      vip:'贵宾会员',
      mobile:0,  //判断是否有手机号
    },
    menuUl:[
      // {
      //   bindtap:'orderList',
      //   img:'/static/images/u-menu1.png',
      //   text:'我的订单'
      // },
      {
        bindtap:'wallet',
        img:'/static/images/u-menu3.png',
        text:'我的钱包'
      },
      {
        bindtap:'coupon',
        img:'/static/images/u-menu2.png',
        text:'我的劵包'
      },
      {
        bindtap:'meeting',
        img:'/static/images/u-menu5.png',
        text:'会议与团队'
      },
      {
        bindtap:'goInvitation',
        img:'/static/images/u-menu4.png',
        text:'全民营销'
      },
    ],
    otherIcon:[
      {img:'/static/images/other/other1.png',text:'身份信息',tap:'goInformation'},
      {img:'/static/images/other/other8.png',text:'会员权益',tap:'goMember'},
      {img:'/static/images/other/other2.png',text:'常住人簿',tap:'goOften'},
      // {img:'/static/images/other/other3.png',text:'邀请下单',tap:'goInvitation'},
      {img:'/static/images/other/other4.png',text:'隐私条款',tap:'goPrivacy'},
      // {img:'/static/images/other/other5.png',text:'客服热线',tap:'goService'},
      {img:'/static/images/other/other9.png',text:'设置',tap:'goSet'},
    ],
    serviceIcon:[
      {img:'/static/images/service/service0.png',text:'住房延期'},
      {img:'/static/images/service/service1.png',text:'账单查询'},
      {img:'/static/images/service/service2.png',text:'我的发票'},
      {img:'/static/images/service/service3.png',text:'关于我们'},
      {img:'/static/images/service/service4.png',text:'线上买单'},
      {img:'/static/images/service/service5.png',text:'迷你吧'},
      {img:'/static/images/service/service6.png',text:'快递上楼'},
      {img:'/static/images/service/service7.png',text:'打扫服务'},
      {img:'/static/images/service/service8.png',text:'客耗品'},
      {img:'/static/images/service/service9.png',text:'物品租赁'},
      {img:'/static/images/service/service10.png',text:'洗衣服务'},
      {img:'/static/images/service/service11.png',text:'叫醒服务'},
    ],
    badge:{
      menu:[0,0,0,0]
    },
  },
  onLoad: function () {
    this.login();
  },
  onShow: function () {
    this.userInfo();
    this.member();
    this.badge();
  },
  //判断登陆
  login(){
    // 判断登录
    user.checkLogin().then(res => {
      
    }).catch((res) =>{
      console.log('需要登陆');
      wx.navigateTo({ 
        url: "/pages/auth/login/login"
      });
    })
  },
  //登陆后获取用户信息
  userInfo(){
    let userInfo = "";
    if(wx.getStorageSync("userInfo")){
      userInfo = wx.getStorageSync("userInfo"); 
      this.setData({
        'ucenter.tou':userInfo.avatarUrl,
        'ucenter.name':userInfo.nickName,
      });
    }else{
      let ucenterNew = {
        tou:'/static/images/person.jpg',
        name:'点击登陆',
        vip:'贵宾会员',
        mobile:0,  
      }
      this.setData({
        ucenter:ucenterNew
      })
      return false;
    }
  },
  //判断是否有绑定手机号
  member(){
    user.memberGetInfo().then(res => {
      this.setData({
        'ucenter.name':res.result.name,
        'ucenter.vip':res.result.cardLevelName,
        'ucenter.mobile':res.result.mobile,
      })
    }).catch((err) => {
      console.log(err)
    });
  },
  //红点
  badge(){
    let badgeNew = app.globalData.badge;
    if(badgeNew){
      this.setData({
        badge:badgeNew
      });
      wx.setTabBarBadge({
        index: 2,
        text:'1',
        success: res => { console.log(res) },
        fail: res => { console.error }
      });
    }
  },
  //设置
  set(){
    wx.navigateTo({
      url: "/pages/ucenter/set/setIndex/setIndex"
    })
  },
  //点击登陆
  sign(){
    wx.navigateTo({
      url: "/pages/auth/login/login"
    })
  },
  //绑定手机号码
  goRegisterWx(){
    wx.navigateTo({
      url: "/pages/auth/registerWx/registerWx"
    })
  },
  //我的订单
  orderList(){
    this.cleanBadge();
    wx.navigateTo({
      url: "/pages/ucenter/order/orderList/orderList"
    })
  },
  //我的劵包
  coupon(){
    this.cleanBadge();
    wx.navigateTo({
      url: "/pages/ucenter/coupon/coupon"
    })
  },
  //我的钱包
  wallet(){
    wx.navigateTo({ 
      url: "/pages/ucenter/wallet/walletAmount/walletAmount"
    });
  },
  //全民营销
  goInvitation(){
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteIndex/inviteIndex"
    })
  },
  //会议与团队
  meeting(){
    check.showErrorToast("暂未开放")
    /*wx.navigateTo({
      url: "/pages/ucenter/teamNumber/teamNumber"
    })*/
  },
  goMember(){
    wx.navigateTo({ 
      url: "/pages/member/memberIndex/memberIndex"
    });
  },
  //个人信息
  goInformation(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/information/information"
    });
  },
  //同住人簿
  goOften(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=0"
    });
  },
  //隐私条款
  goPrivacy(){
    wx.navigateTo({ 
      url: "/pages/member/memberAgree/memberAgree"
    });
  }, 
  goSet(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/setIndex/setIndex"
    });
  },
  //客服热线
  goService(){
    wx.makePhoneCall({
      phoneNumber:'057188173811'
    })
  },
  //清除红点
  cleanBadge(){
    this.setData({
      'badge.menu':[0,0,0,0]
    })
    app.globalData.badge = "";
    wx.removeTabBarBadge({
      index: 2,
      success: res => { console.log(res) },
      fail: res => { console.error }
    })
  },
})