Page({
  data: {
    info:{
      roomNo:'',
      name:'',
      ident:'',
      mobile:'',
      time:'',
    },
    visitorTime:360,
    visitorTimeS:'6小时',
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
      visitorTimeS:hour+minute
    })
  },
  //input焦点
  bindNameInput(e) {
    this.setData({
      'info.name': e.detail.value
    });
  },
  bindIdentityInput(e) {
    this.setData({
      'info.identity': e.detail.value
    });
  },
  bindMobileInput(e) {
    this.setData({
      'info.mobile': e.detail.value
    });
  },
  //同住人簿
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
})