let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
let member = require('../../../utils/member.js');
let app = getApp();
Page({
  data: {
    info:{
      avatarUrl:'/static/images/person.jpg',
      name:'默认',
      points:0,
      money:0,
      moneyS:'0.00',
      couponNum:0,
      arr:'',
      dep:'2020-12-12',
      cardNo:'1500615615',
      card:{
        baImg:'card5',
        nameC:'贵宾卡',
        nameE:'Common Member',
        upRule:'注册即会员',
        validityRule:'长久',
      },
    },
    memberCard:[],
    powerUl:[],
    powerUlShow:[
      {img:'power0',text1:'订房折扣',text2:'9.5折'},
      {img:'power3',text1:'积分奖励',text2:'1倍'},
      {img:'power22',text1:'免费取消',text2:''},
      {img:'power18',text1:'延迟退房',text2:'14:00'},
    ],
    couponUl:[
      // {
      //   type:0,
      //   typeS:'领取',
      //   val:'300',
      //   valMax:'369',
      //   limit:'杭州海外海国际酒店',
      // },
      // {
      //   type:1,
      //   typeS:'使用',
      //   val:'300',
      //   valMax:'369',
      //   limit:'杭州海外海国际酒店',
      // },
      // {
      //   type:2,
      //   typeS:'已过期',
      //   val:'300',
      //   valMax:'369',
      //   limit:'杭州海外海国际酒店',
      // }
    ],
    introduceShow:false,
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.memberInfo();
    this.init();
    this.memberCard();
  },
  //init
  init(){
    this.setData({
      memberCard : member.memberCard,
      powerUl : member.powerUl,
      'info.card' : member.memberCard[0],
    });
    
  },
  //会员信息 头像/名字
  memberInfo(){
    //头像
    let userInfo = "";
    if(wx.getStorageSync("userInfo")){
      userInfo = wx.getStorageSync("userInfo") 
    }else if(app.globalData.userInfo){
      userInfo = app.globalData.userInfo
    }else{
      return false
    }
    console.log(userInfo)
    this.setData({
      'info.avatarUrl':userInfo.avatarUrl,
      'info.name':userInfo.name != null?userInfo.name:'',
    })
    // //获取到当前的手机号
    // let tel = wx.getStorageSync('userInfoMobile');
    // if(tel){  //如果存在
    //   util.request(api.MemberGet, 'GET').then(res => {
    //     this.setData({
    //       'info.name':res.result.name != null?res.result.name:'',
    //     })
    //   }).catch((err) => {
    //     wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    //   });
    // }else{
    //   wx.navigateTo({
    //     url: "/pages/auth/login/login"
    //   })
    // }
  },
   //会员卡信息
  memberCard(){
    let infoNew = {};
    util.request(api.MemberGet, 'GET').then(res => {
      console.log(res)
      infoNew = {
        avatarUrl:this.data.info.avatarUrl,
        name:res.result.name,
        points:res.result.points,
        money:res.result.arbal*(-1),
        moneyS:(res.result.arbal*(-1)/100).toFixed(2),
        couponNum:0,
        arr:res.result.arr,
        dep:res.result.dep,
        cardNo:res.result.cardno,
        card:member.memberCard[this.typeDes(res.result.type_des)],
      }
      this.setData({
        info:infoNew 
      })
      console.log(this.data.info)
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err ,showCancel: false}); 
    });
  },
  //会员等级变化
  memberGrade(grade){
    let powerUlShowNew = [
      {img:'power0',text1:'订房折扣',text2:member.powerUl[0].grade[grade].text2},
      {img:'power1',text1:'餐饮折扣',text2:member.powerUl[1].grade[grade].text2},
      {img:'power2',text1:'娱乐折扣',text2:member.powerUl[2].grade[grade].text2},
      {img:'power3',text1:'积分奖励',text2:member.powerUl[3].grade[grade].text2},
    ]
    this.setData({
      powerUlShow:powerUlShowNew,
      'info.card':member.memberCard[grade]
    })
  },
  //跳转到会员信息
  information(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/information/information"
    });
  },
  //更多权益
  powerMost(){
    wx.navigateTo({ 
      url: "/pages/member/memberPower/memberPower"
    });
  },
  //我的余额
  walletAmount(){
    wx.navigateTo({ 
      url: "/pages/ucenter/wallet/walletAmount/walletAmount"
    });
  },
  //优惠劵
  coupon(){
    wx.navigateTo({ 
      url: "/pages/ucenter/coupon/coupon"
    });
  },
  //会员特权详细
  introduceValShow(e){
    let index = e.currentTarget.dataset.index
    let introduceVal = this.data.powerUlShow[index].text1
    this.setData({
      introduceShow:!this.data.introduceShow,
      introduceVal:introduceVal
    })
  },
  //会员名字转换
  typeDes(val){
    if(val == "贵宾卡"){
      return 0;
    }else if(val == "银卡"){
      return 1;
    }else if(val == "金卡"){
      return 2;
    }else if(val == "白金卡"){
      return 3;
    }else if(val == "黑金卡"){
      return 4;
    }else{
      return 0;
    }
  }
})