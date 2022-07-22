let util = require('../../../../utils/util.js');
let member = require('../../../utils/member.js');
let user = require('../../../../utils/user.js');
Page({
  data: {
    info:{
      avatarUrl:'/subpackage/images/person.jpg',
      name:'未登录',
      points:0,  //积分数量
      money:0,
      moneyS:'0.00',
      couponNum:0,
      arr:'',
      dep:'2021-12-12',
      levelsEndTime:'', //黑金卡过期时间
      cardNo:'1500615615',
      discount:95,  //95%  会员打折
      scoreTimes:100,  //1.5倍 积分倍数
      fromMemberId:'',  //邀请人会员号
      fromMobile:'',  //邀请人手机号
      endTime:'',  //津贴剩余时间
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
      // {img:'power0',text1:'订房折扣',text2:'9.5折'},
      // {img:'power3',text1:'积分奖励',text2:'1倍'},
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
    this.init();
  },
  onShow: function () {
    this.memberInfo();
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
    }else{
      return false;
    }
    console.log(userInfo)
    this.setData({
      'info.avatarUrl':userInfo.avatarUrl,
      'info.name':userInfo.name != null?userInfo.name:'',
    });
  },
   //会员卡信息
  memberCard(){
    let infoNew = {};
    let grade = 0;
    let discountNew = 100;
    let scoreTimesNew = 100;
    user.memberGetInfo().then(res => {
      grade = util.memberGrade(res.result.cardLevel);
      discountNew = res.result.discount?res.result.discount:100;
      scoreTimesNew = res.result.scoreTimes?res.result.scoreTimes:100;
      infoNew = {
        avatarUrl:this.data.info.avatarUrl,
        name:res.result.name,
        points:res.result.points,
        money:res.result.balance*(-1),
        moneyS:(res.result.balance*(-1)/100).toFixed(2),
        couponNum:0,
        arr:res.result.arr,
        dep:res.result.dep,
        levelsEndTime:res.result.levelsEndTime,
        cardNo:res.result.cardno,
        card:member.memberCard[grade],
        discount:discountNew,  
        scoreTimes:scoreTimesNew,
        fromMemberId:res.result.fromMemberId?res.result.fromMemberId:'',  //邀请人会员号
        fromMobile:res.result.fromMobile?res.result.fromMobile:'',  //邀请人手机号
        endTime:res.result.endTime?res.result.endTime:'',  //津贴剩余时间
      }
      let powerUlShowNew = [
        {img:'power0',text1:'订房折扣',text2:(discountNew/10)+'折'},
        {img:'power22',text1:'订单',text2:"免费取消"},
        {img:'power21',text1:'会员',text2:"生日礼"},
        {img:'power4',text1:'入住退房',text2:"免查房"},
      ]
      this.setData({
        info:infoNew,
        powerUlShow:powerUlShowNew,
      })
    }).catch((err) => {
      console.log(err)
    });
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
      url: "/subpackage/pages/member/memberPower/memberPower?member="+this.data.info.card.nameC
    });
  },
  //我的余额
  walletAmount(){
    wx.navigateTo({ 
      url: "/pages/ucenter/wallet/walletAmount/walletAmount"
    });
  },
  //我的积分
  goPointsMarket(){
    wx.navigateTo({ 
      url: "/pages/ucenter/points/pointsMarket/pointsMarket"
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
})