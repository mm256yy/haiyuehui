let member = require('../../../utils/member.js');
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
    let memberCard = {}
    if(options.member == '黑金卡'){
      memberCard = member.memberCard
    }else{
      memberCard = member.memberCard.splice(0,4);
    }
    console.log(memberCard)
    this.setData({
      memberCard : memberCard,
    })
  },
  onShow: function () {
    this.setData({
      powerUl :　member.powerUl,
    })
    // this.init()
    this.funPowerOpacity()
  },
  //滑动会员卡
  changeCard(e){
    let index = e.detail.current
    this.setData({
      memberVal:index
    })
    this.funPowerOpacity()
  },
  memberProgress(e){
    let index = e.currentTarget.dataset.index;
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