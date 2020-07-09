let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    additionType:0,   //0 同住人 1 访客  no2 扫码/分享同住人 3 扫码/分享访客人 4 扫码路人（没有携带参数）
    orderId:0,
    hotelId:0,
    roomNo:0,
    info:{
      name:'',
      identity:'',
      mobile:'',
    }
  },
  onLoad(options) {
    this.setData({
      additionType:options.additionType,
      orderId:options.orderId,
      hotelId:options.hotelId,
      roomNo:options.roomNo
    })
  },
  onShow() {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data.info)  // data中会含有testdata
    this.setData({
      info:currPage.data.info
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
  //添加同住人
  startBtn0(){
    console.log(this.data.info)
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.identity)){return false}
    if(!check.checkMobile(this.data.info.mobile)){return false}

    let param = {
      orderId:this.data.orderId,
      name:this.data.info.name,
      ident:this.data.info.identity,
      mobile:this.data.info.mobile
    }
    console.log(param)
    util.request(api.UcenterOrderAddPerson , param , 'POST').then(res => {
      wx.showModal({ title: '成功',content: '入住成功',showCancel: false , success (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }});
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
    
  },
  //添加访客
  startBtn1(){
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.identity)){return false}
    if(!check.checkMobile(this.data.info.mobile)){return false}

    let param = {
      orderId:this.data.orderId,
      hotelId:this.data.hotelId,
      roomNo:this.data.roomNo,
      name:this.data.info.name,
      ident:this.data.info.identity,
      mobile:this.data.info.mobile
    }
    console.log(param)
    util.request(api.UcenterVisitorAddInfo , param , 'POST').then(res => {
      wx.showModal({ title: '成功',content: '提交成功',showCancel: false , success (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }});
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },  
  //同住人簿
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
})