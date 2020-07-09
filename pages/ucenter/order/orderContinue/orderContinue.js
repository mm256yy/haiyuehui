// pages/ucenter/orderContinue/orderContinue.js
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    pics:[
      '/static/images/banner1.jpg',
    ],
    order:{
      hotelId:'',
      hotelName:'',
      roomId:'',
      roomName:'',
      roomNo:'',
      roomPrice:0,
      roomPriceS:'0.00',
    },
    total:{
      roomPrice:0,
      roomPriceS:'0.00',
      deposit:0,
      depositS:'0.00',
      other:0,
      otherS:'0.00',
      total:0,
      totalS:'0.00'
    },
    orderId:0,
    customShow:false,
    dayNum:1,  //快捷续住
    continueDay:1,  //最终时间
  },
  onLoad: function (options) {
    this.init(options);
    
  },
  onShow: function () {

  },
  init(options){
    this.setData({
      orderId:options.orderId
    })
    let param = {
      orderId:options.orderId
    }
    console.log(param)
    util.request(api.UcenterOrderDetail ,param, 'GET').then(res => {
      let data = res.result
      let orderNew = {
        hotelId:data.hotelId,
        hotelName:data.hotelName,
        roomId:'',
        roomName:data.rmdesc,
        roomNo:data.roomNo,
        roomPrice:data.roomPrice,
        roomPriceS:(data.roomPrice/100).toFixed(2),
      }
      console.log(orderNew)
      this.setData({
        order:orderNew
      })
      this.total();
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //统计
  total(){
    let dayNum = null;
    if(this.data.continueDay == 0){
      dayNum = 0.5
    }else{
      dayNum = this.data.continueDay
    }
    let moneyNew = parseInt(this.data.order.roomPrice)*parseFloat(dayNum)
    let totalNew = moneyNew + parseInt(this.data.total.deposit) + parseInt(this.data.total.other)
    this.setData({
      'total.roomPrice':totalNew,
      'total.roomPriceS':(totalNew/100).toFixed(2),
      'total.total':totalNew,
      'total.totalS':(totalNew/100).toFixed(2),
    })
  },
  //下订单
  placeOrder(){
    let param = {
      orderId:this.data.orderId,
      days:this.data.continueDay,
      outHour:(this.data.continueDay == 0?18:14)
    }
    console.log(param)
    util.request(api.UcenterOrderDaysSubmit , param , 'POST').then(res => {
      //跳转
      wx.redirectTo({
        url: "/pages/customized/pay/pay?money="+res.result.money+"&orderId="+res.result.orderId+"&rmdesc="+this.data.order.roomName
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //快捷选天数
  dayBtn(e){
    let customShowNew = false;
    let day = e.currentTarget.dataset.day
    if(day == 5){
      customShowNew = true;
    }
    this.setData({
      dayNum:day,
      customShow:customShowNew,
      continueDay:day
    })
    this.total()
  },
  //减
  reduceDay(){
    if(this.data.continueDay>1){
      this.setData({
        continueDay:this.data.continueDay-1
      })
    }
    this.total()
  },
  //加
  addDay(){
    this.setData({
      continueDay:parseInt(this.data.continueDay)+1
    })
    this.total()
  }
})