let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    chooseDate:0,
    total:{
      money:0,
      todayMoney:0,
      todayNum:0,
      historyMoney:0,
      historyNum:0,
    },
    orderBonusUl:[
      // {type:'注册首单',time:'2020-06-12 12:06:06',money:'6600'},
    ],
  },
  onLoad: function (options) {
    this.member();
    this.incomeList();
  },
  onShow: function () {

  },
  //获取会员信息
  member(){
    user.memberGetInfo().then(res => {
      this.setData({
        'total.money' : (res.result.bonus?res.result.bonus:0)
      })
    }).catch((err) => {
      console.log(err)
    });
  },
  //收益列表
  incomeList(){
    let date = new Date();
    let chooseDateNew = date.getFullYear()+'-'+ util.formatNumber(date.getMonth() + 1)
    let param = {
      startDate:chooseDateNew+'-01', 
      endDate:this.endDate(chooseDateNew)+'-01',
      pageSize:5,
      pageNo:1,
    }
    console.log(param)
    util.request(api.MemberInviteOrderBonus , param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let data = res.result.records
      if(data.length != 0){ 
        for(let i=0;i<data.length;i++){
          o_li = {
            type:data[i].reason,
            time:data[i].createTime,
            money:data[i].bonus?data[i].bonus:0,
          }
          o_ul.push(o_li)
        }
      }
      console.log(o_ul)
      this.setData({
        orderBonusUl:o_ul,
      })
    }).catch((err) => {});
  },
  //收益详情
  incomeMost(){
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteRecord/inviteRecord"
    })
  },
  //新手攻略
  goStrategy(){
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteStrategy/inviteStrategy"
    })
  },
  endDate(endDate){
    let endDateNew = endDate.split("-");
    if(endDateNew[1] == '12'){
      return (parseInt(endDateNew[0])+1) + '-01'
    }else{
      if(parseInt(endDateNew[1])+1<10){
        return endDateNew[0] + '-0' + (parseInt(endDateNew[1])+1)
      }else{
        return endDateNew[0] + '-' + (parseInt(endDateNew[1])+1)
      }
    }
  },
})