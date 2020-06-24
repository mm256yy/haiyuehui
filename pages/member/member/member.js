let util = require('../../../utils/util.js');
let app = getApp();
Page({
  data: {
    memberCard:[
      {
        baImg:'/static/images/card5.png',
        nameC:'贵宾卡',
        nameE:'Common Member',
        upRule:'年消费满2000元<br/>官方渠道预定间夜量达5',
        validityRule:'长久',
      },
      {
        baImg:'/static/images/card2.png',
        nameC:'银卡',
        nameE:'Silver Member',
        upRule:'年消费满10000元<br/>官方渠道预定间夜量达30',
        validityRule:'一年',
      },
      {
        baImg:'/static/images/card3.png',
        nameC:'金卡',
        nameE:'Gold Member',
        upRule:'年消费满50000元<br/>官方渠道预定间夜量达150',
        validityRule:'一年',
      },
      {
        baImg:'/static/images/card6.png',
        nameC:'白金卡',
        nameE:'Platinum Member',
        upRule:'年消费满100000元<br/>官方渠道预定间夜量达300',
        validityRule:'一年',
      },
      {
        baImg:'/static/images/card7.png',
        nameC:'黑金卡',
        nameE:'Diamond Member',
        upRule:'',
        validityRule:'一年',
      }
    ],
    memberGrade:[
      {
        id:0,
        name:'贵宾卡',
        val1:'1000积分',
      },
      {
        id:1,
        name:'银卡',
        val1:'5000积分',
      },
      {
        id:2,
        name:'金卡',
        val1:'5000积分',
      },
      {
        id:3,
        name:'白金卡',
        val1:'10000积分',
      },
      {
        id:4,
        name:'黑金卡',
        val1:'100000积分',
      },
    ],
    privilegeUl:[
      {
        img:'/static/images/power/power0.png',
        text1:'订房折扣',
        text2:'9.5折',
        grade:0,
      },
      {
        img:'/static/images/power/power1.png',
        text1:'积分奖励',
        text2:'一倍积分',
        grade:0,
      },
      {
        img:'/static/images/power/power14.png',
        text1:'延迟退房',
        text2:'14:00',
        grade:0,
      },
      {
        img:'/static/images/power/power15.png',
        text1:'宽带上网',
        text2:'免费无线',
        grade:0,
      },
      {
        img:'/static/images/power/power2.png',
        text1:'夜床服务',
        text2:'夜床服务',
        grade:0,
      },
      {
        img:'/static/images/power/power6.png',
        text1:'免查房',
        text2:'免查房',
        grade:0,
      },
      {
        img:'/static/images/power/power7.png',
        text1:'免费取消',
        text2:'提前72小时',
        grade:0,
      },
      {
        img:'/static/images/power/power8.png',
        text1:'迎宾糕点',
        text2:'入住首日送达',
        grade:1,
      }
    ],
    info:{
      avatarUrl:'',
      memberUp:0,
      scoring:3200,
    },
    memberVal:0,
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    this.ready()
  },
  onShow: function () {

  },
  ready(){
    console.log(app.globalData.userInfo)
    //获取用户信息
    let userInfo = '';
    if(wx.getStorageSync("userInfo")){
      userInfo = wx.getStorageSync("userInfo")
    }else if(app.globalData.userInfo){
      userInfo = app.globalData.userInfo
    }
    console.log(userInfo)
    this.setData({
      'info.avatarUrl':userInfo.avatarUrl
    })
  },
  //滑动会员卡
  changeCard(e){
    console.log(e)
    let index = e.detail.current
    this.setData({
      memberVal:index
    })
  }
})