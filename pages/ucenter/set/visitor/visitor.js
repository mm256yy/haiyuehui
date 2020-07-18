let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');

Page({
  data: {
    info:{
      roomNo:'',
      name:'',
      ident:'',
      mobile:'',
      time:30,
    },
    hotelId:'',
    visitorTime:30,
    visitorTimeS:'30分钟',
  },
  onLoad: function (options) {
    this.setData({
      hotelId:options.hotelId
    })
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
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.ident)){return false}
    if(!check.checkMobile(this.data.info.mobile)){return false}
    if(this.data.info.roomNo.length == 0){
      wx.showModal({
        title: '错误信息',
        content: '房间号不能为空',
        showCancel: false
      });
      return false;
    }
    let param = {
      hotelId:this.data.hotelId, 
      roomNo:this.data.info.roomNo,
      name:this.data.info.name,
      ident:this.data.info.ident,
      mobile:this.data.info.mobile,
      duration:this.data.info.time,
    }
    console.log(param)
    util.request(api.UcenterVisitorAdd, param , 'POST').then(res => {
      wx.showModal({title: '成功',content: '提交成功' ,showCancel: false , success (res) {
        wx.switchTab({
          url: "/pages/index/index"
        })
      }}); 
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err ,showCancel: false}); 
    });
  },
  //同住人簿
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
})