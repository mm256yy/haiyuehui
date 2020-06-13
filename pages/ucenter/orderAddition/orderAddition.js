// pages/ucenter/orderAddition/orderAddition.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const check = require('../../../utils/check.js');
Page({
  data: {
    additionType:0,   //0 同住人 1 访客     no2 扫码/分享同住人 3 扫码/分享访客人 4 扫码路人（没有携带参数）
    orderId:0,
    hotelId:0,
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
    })
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  /*onShareAppMessage(){
    let type = '';
    if(this.data.additionType == 0){  //同住人
      type =  2
    }else if(this.data.additionType == 1){  //访客
      type =  3
    }else{
      return false;
    }
    return {
      title: '海外海酒店申报信息',
      path: '/page/ucenter/orderAddition?additionType='+type+'&orderId='+this.data.orderId,
      imageUrl:'../../../static/images/share.jpg'  //比例是4:5
    }
  },*/
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
  //startBtn
  startBtn0(){
    console.log(this.data.info)
    if(!util.checkName(this.data.info.name)){return false}
    if(!util.checkIdentity(this.data.info.identity)){return false}

    let param = {
      orderId:this.data.orderId,
      name:this.data.info.name,
      ident:this.data.info.identity,
      mobile:this.data.info.mobile
    }
    console.log(param)
    util.request(api.UcenterOrderAddPerson , param , 'POST').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        wx.showModal({ title: '成功',content: '入住成功',showCancel: false , success (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }});
      }else{ //500
        wx.showModal({ title: '错误信息',content: res.status.message,showCancel: false });
      }
    }).catch((err) => {
      console.log(err)
    });
    
  },
  startBtn1(){
    if(!util.checkMobile(this.data.info.mobile)){return false}
    
    let param = {
      hotelId:this.data.hotelId,
      mobile:this.data.info.mobile
    }
    console.log(param)
    util.request(api.UcenterVisitorSendMobile , param , 'POST').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        wx.showModal({ title: '成功',content: '入住成功',showCancel: false , success (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }});
      }else{ //500
        wx.showModal({ title: '错误信息',content: res.status.message,showCancel: false });
      }
    }).catch((err) => {
      console.log(err)
    });
  },  
})