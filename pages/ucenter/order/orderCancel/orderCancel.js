let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    info:{
      hotelName:'',
      room:'',
      startTimeS:'2020-00-00',
      endTimeS:'2020-00-00',
      total:'',
      orderId:'0'
    },
    choose:[
      {val:'我不再有这个酒店需求',name:'我不再有这个酒店的需求'},
      {val:'我预定的时间需要修改',name:'我预定的时间需要修改'},
      {val:'我找到了更好的入住地方',name:'我找到了更好的入住地方'},
      {val:'展示的酒店与实际不符',name:'展示的酒店与实际不符'}
    ],
    chooseVal:0,
    cause:'我不再有这个酒店需求',
    textarea:'',
    payType:0,  //1 未支付  2已支付
  },
  onLoad: function (options) {
    console.log(options)
    this.init(options)
  },
  onShow: function () {

  },
  //初始化
  init(options){
    let param = {
      orderId:options.orderId
    }
    util.request(api.UcenterOrderDetail ,param, 'GET').then(res => {
      let data = res.result
      let infoNew = {
        hotelName:data.hotelName,
        room:data.rmdesc,
        startTimeS:data.arr,
        endTimeS:data.dep,
        total:data.money,
        orderId:options.orderId
      }
      this.setData({
        info:infoNew,
        payType:options.pay
      })
    }).catch((err) => {});
  },
  //点击选择类型
  radioChange(e){
    this.setData({
      chooseVal:e.currentTarget.dataset.index,
      cause:e.currentTarget.dataset.val
    })
  },
  //点击 1取消订单/ 2退款
  cancel(){
    if(this.data.textarea.length>100){
      wx.showToast({title: "字数过长" ,image:'/static/images/icon_error.png'})
      return false
    }
    let parma = {
      orderId:this.data.info.orderId,
      reason:this.data.cause + ',' + this.data.textarea,
    }
    console.log(parma)
    if(this.data.payType == 1){
      util.request(api.UcenterOrderCancel , parma , 'POST').then(res => {
        wx.showModal({ title: '成功' , content: '订单取消申请成功',showCancel: false , success (res) {
          if (res.confirm) {
            wx.switchTab({ 
              url:"/pages/ucenter/order/orderList/orderList"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }});
      }).catch((err) => {});
    }else if(this.data.payType == 2){
      util.request(api.UcenterOrderRefund , parma , 'POST').then(res2 => {
        wx.showModal({ title: '成功' , content: '订单退款申请成功',showCancel: false , success (res) {
          if (res.confirm) {
            wx.switchTab({ 
              url:"/pages/ucenter/order/orderList/orderList"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }});
      }).catch((err2) => {});
    }
  },
  //input焦点
  bindTextareaInput: function(e) {
    this.setData({
      textarea: e.detail.value
    });
  },
})