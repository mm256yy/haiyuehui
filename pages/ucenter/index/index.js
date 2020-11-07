
let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');
let check = require('../../../utils/check.js');
let app = getApp();
Page({
  data: {
    ucenter:{
      tou:'/static/images/person.jpg',
      name:'点击登陆',
      vip:'贵宾会员',
      mobile:0,  //判断是否有手机号
      fromMobile:'',
      fromMemberId:'',
      endTime:'',  //津贴剩余时间
      memberAllowanceId:'',  //津贴id
      allowanceMoney:0,  //津贴金额
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
      {img:'/static/images/other/other1.png',text:'身份信息',tap:'goInformation',badge:false},
      {img:'/static/images/other/other8.png',text:'会员权益',tap:'goMember',badge:false},
      {img:'/static/images/other/other2.png',text:'常住人簿',tap:'goOften',badge:false},
      // {img:'/static/images/other/other3.png',text:'邀请下单',tap:'goInvitation',badge:false},
      {img:'/static/images/other/other4.png',text:'隐私条款',tap:'goPrivacy',badge:false},
      // {img:'/static/images/other/other5.png',text:'客服热线',tap:'goService',badge:false},
      {img:'/static/images/other/other9.png',text:'设置',tap:'goSet',badge:false},
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
    user.goToLogin();
  },
  onShow: function () {
    console.log(this.data.ucenter.allowanceMoney)
    this.userInfo();
    this.member();
    this.badge();
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
  //获取会员信息
  member(){
    user.memberGetInfo().then(res => {
      let ucenterNew = {
        tou:this.data.ucenter.tou,
        name:res.result.name,
        vip:res.result.cardLevelName,
        mobile:res.result.mobile,
        fromMobile:res.result.fromMobile?res.result.fromMobile:'',
        fromMemberId:res.result.fromMemberId?res.result.fromMemberId:'',
        endTime:res.result.endTime?res.result.endTime:'',
        memberAllowanceId:res.result.memberAllowanceId?res.result.memberAllowanceId:'',  
        allowanceMoney:res.result.allowanceMoney?res.result.allowanceMoney:0,
      }
      this.setData({
        ucenter:ucenterNew,
        'otherIcon[0].badge':(res.result.name == ''||res.result.name == '微信'?true:false),
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
  //跳转到酒店列表
  goHotelsList(){
    wx.navigateTo({ 
      url: "/pages/customized/hotelsList/hotelsList"
    });
  }
})