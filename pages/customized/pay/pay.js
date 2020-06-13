
const util = require('../../../utils/util.js');
const pay = require('../../../utils/pay.js');
const api = require('../../../config/api.js');
Page({
  data: {
    order:{
      num:'',
      money:0,
      moneyS:'0.00',
      time:'',
      timeS:'',
    },
    pay:{
      discount:0,
      discountS:'0.00',
      coupon:0,
      couponS:'0.00',
      payment:0,
      paymentS:'0.00',
      remainder:0,
      remainderS:'0.00',
      total:0,
      totalS:'0.00'
    },
    rmdescVal:'',
  },
  onLoad: function (options) {
    this.initialize(options)
    this.total()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  initialize(data){
    console.log(data)
    let orderNew = {
      num:data.orderId,
      money:data.money||0,
      moneyS:((data.money||0)/100).toFixed(2),
      time:new Date().getTime(),
      timeS:this.formatDateTime(new Date().getTime()),
    }
    this.setData({
      order:orderNew,
      rmdescVal:data.rmdesc
    })
  },
  total(){
    let totalNew = parseInt(this.data.order.money) + parseInt(this.data.pay.discount) + parseInt(this.data.pay.coupon) + parseInt(this.data.pay.payment) + parseInt(this.data.pay.remainder)
    this.setData({
      'pay.total':totalNew,
      'pay.totalS':(totalNew/100).toFixed(2),
    })
  },
  perpay(){
    let roomrNew = wx.getStorageSync("room");
    console.log(roomrNew)
    let param = {
      orderId:this.data.order.num,
      rmdesc:this.data.rmdescVal,
    }
    console.log(param)
    //跳转
    /*wx.navigateTo({
      url: "../../customized/payResult/payResult?result="+'1'
    })*/
    pay.usePay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result="+'1'
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result="+'0'
      })
    });
  },
  formatDateTime(inputTime) { var date = new Date(inputTime); var y = date.getFullYear(); var m = date.getMonth() + 1; m = m < 10 ? ('0' + m) : m; var d = date.getDate(); d = d < 10 ? ('0' + d) : d; var h = date.getHours(); h = h < 10 ? ('0' + h) : h; var minute = date.getMinutes(); var second = date.getSeconds(); minute = minute < 10 ? ('0' + minute) : minute; second = second < 10 ? ('0' + second) : second; return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; }
})