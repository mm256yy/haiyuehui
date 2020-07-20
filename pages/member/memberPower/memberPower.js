let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
let member = require('../../../utils/member.js');
let app = getApp();
Page({
  data: {
    memberCard:[],
    powerUl:[],
    // info:{
    //   avatarUrl:'',
    //   name:'徐顺望',
    //   memberUp:0,
    // },
    memberVal:0,  //滑动会员等级
    introduceVal:'订房折扣9.5折',
    introduceShow:false,
    powerRelease:true, //下拉 / 后缩
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.setData({
      memberCard : member.memberCard,
      powerUl :　member.powerUl,
    })
    // this.init()
    this.funPowerOpacity()
  },
  // init(){
  //   //获取用户信息 / 头像
  //   let userInfo = '';
  //   if(wx.getStorageSync("userInfo")){
  //     userInfo = wx.getStorageSync("userInfo")
  //   }else if(app.globalData.userInfo){
  //     userInfo = app.globalData.userInfo
  //   }
  //   console.log(userInfo)
  //   this.setData({
  //     'info.avatarUrl':userInfo.avatarUrl
  //   })
  //   //获取手机号，并且获取会员信息
  //   let userMobile = wx.getStorageSync('userInfoMobile');
  //   let param = {
  //     mobile : userMobile
  //   }
  //   console.log(param)
  //   util.request(api.UcenterMemberQuery, param , 'GET').then(res => {
  //     // this.setData({
  //     //   'fill.name':(res.result.name != null?res.result.name:'')
  //     // })
  //   }).catch((err) => {
  //     wx.showModal({title: '错误信息',content: err,showCancel: false}); 
  //   });
  // },
  //滑动会员卡
  changeCard(e){
    console.log(e)
    let index = e.detail.current
    this.setData({
      memberVal:index
    })
    this.funPowerOpacity()
  },
  memberProgress(e){
    let index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      memberVal:index
    })
  },
  //会员特权详细
  introduceValShow(e){
    let index = e.currentTarget.dataset.index
    let introduceVal = this.data.powerUl[index].introduce
    this.setData({
      introduceShow:!this.data.introduceShow,
      introduceVal:introduceVal
    })
  },
  //会员特权扩展
  funPowerRelease(){
    this.setData({
      powerRelease:!this.data.powerRelease,
    })
  },
  //会员特权根据会员等级显示
  funPowerOpacity(){
    let powerUl = this.data.powerUl;
    let memberVal = this.data.memberVal;
    console.log(memberVal)
    for(let i=0;i<powerUl.length;i++){
      powerUl[i].use = powerUl[i].grade[memberVal].use;
      powerUl[i].text1 = powerUl[i].grade[memberVal].text1;
      powerUl[i].text2 = powerUl[i].grade[memberVal].text2;
    }
    this.setData({
      powerUl : powerUl
    })
  },
  //跳转到会员信息
  information(){
    wx.navigateTo({ 
      url: "/pages/ucenter/set/information/information"
    });
  },
})