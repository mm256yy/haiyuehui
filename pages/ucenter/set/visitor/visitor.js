let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');

Page({
  data: {
    info:{
      roomNo:'',
      name:'',
      ident:'',
      mobile:'',
      time:'30',
    },
    visitorTime:30,
    visitorTimeS:'30分钟',
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //拖动
  sliderChang(e){
    let val = e.detail.value;
    let hour = parseInt(val/60) == 0?'':(parseInt(val/60)+'小时');
    let minute = val%60 == 0?'':(val%60+'分钟')
    this.setData({
      'info.time' : e.detail.value,
      visitorTimeS:hour+minute
    })
  },
  //input焦点
  bindNameInput(e) {
    this.setData({'info.name' : e.detail});
  },
  bindIdentInput(e) {
    this.setData({'info.ident': e.detail});
  },
  bindMobileInput(e) {
    this.setData({'info.mobile': e.detail});
  },
  bindRoomInput(e){
    this.setData({'info.roomNo': e.detail});
  },
  //确认信息
  visitorBtn(){

    console.log(this.data.info)
  },
  //同住人簿
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
})