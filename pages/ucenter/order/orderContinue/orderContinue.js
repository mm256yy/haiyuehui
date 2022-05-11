
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
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
    },
    infoPrice:[],
    total:{
      deposit:0,
      coupon:0,
      discount:100,
      other:0,
      money:0,
    },
    member:{
      scoreTimes:100,
      cardLevel:'',
      discount:95,
    },
    coupon:{
      couponId:'',
      couponMoney:0, //获取的优惠劵减的金额
      fullMoney:0,
    },
    orderId:0,
    customShow:false,  //自定义显示
    dayNum:1,  //快捷续住
    continueDay:1,  //最终续住时间
  },
  onLoad: function (options) {
    this.init(options);
    this.userInfo();
  },
  onReady: function (){
    this.popId = this.selectComponent("#popId");
    this.evaluationId = this.selectComponent("#evaluationId");
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
      let orderNew = res.result
      console.log(orderNew)
      this.setData({
        order:orderNew
      })
    }).catch((err) => {});
  },
  //个人信息
  userInfo(){
    user.memberGetInfo().then(res => {
      let memberNew = {
        cardLevel:res.result.cardLevel,
        discount:(res.result.discount?res.result.discount:100),
        scoreTimes:(res.result.scoreTimes?res.result.scoreTimes:100),
      }
      this.setData({
        member:memberNew,
      });
      //加载外部事件
      // this.popId.funCouponFrist(parseInt(this.data.order.roomPrice));
      this.total();
    }).catch((err) => {
      console.log(err)
    });
  },
  //统计
  total(){
    let order = this.data.order
    let param = {
      arr: order.dep,
      dep: this.depTime(order.dep,this.data.continueDay),
      hotelId: order.hotelId
    }
    //日历房
    util.request(api.CustomizedHotelsDetailed , param , 'GET').then(res => {
      let data = res.result
      let infoPrice = '';
      for(let i=0;i<data.length;i++){
        if(data[i].rmtype == order.rmtype){
          infoPrice = this.funInfoPrice(data[i],order.ratecode)
        } 
      }
      let roomTotalPriceNew = 0
      infoPrice = infoPrice.map((obj)=>{
        obj = {
          date:obj.date,
          price:obj.price
        }
        roomTotalPriceNew +=obj.price
        return obj
      })
      let timeNumNew = this.data.continueDay
      let depositNew = 0;
      let couponMoney = 0;
      let discountNew = this.data.member.discount;
      let otherNew = 0;
      //总计
      let totalNew = {
        timeNum:timeNumNew,
        roomTotalPrice:roomTotalPriceNew,
        deposit:depositNew,
        coupon:couponMoney,
        discount:discountNew,
        other:otherNew,
        money:(roomTotalPriceNew-couponMoney+otherNew)*(discountNew/100)+depositNew,
      }
      // this.evaluationId.funTotal(totalNew)
      this.setData({
        infoPrice:infoPrice,
        total:totalNew
      })
    }).catch((err) => {});
  },
  //couponTotal
  // couponTotal(e){
  //   let money = e.detail;
  //   let couponNew = {
  //     couponId:money.couponId,
  //     couponMoney:money.couponMoney, 
  //     fullMoney:money.fullMoney,
  //   };
  //   this.setData({
  //     coupon:couponNew,
  //   });
  //   this.total();
  // },
  //下订单
  placeOrder(){
    let order = this.data.order
    let member = this.data.member
    let param = {
      accnt: order.accnt,
      pid: this.data.orderId,
      days: this.data.continueDay,
      hotelId: order.hotelId,
      money: this.data.total.money,
      rmtype: order.rmtype,
      rmdesc: order.rmdesc,
      ratecode: order.ratecode,
      roomPrice: order.roomPrice,
      name: order.name,
      mobile: order.mobile,
      arr: order.dep,
      dep: this.depTime(order.dep,this.data.continueDay),
      deposit: 0,
      cis: order.isCis?1:0,
      memberCouponId: '', //优惠劵id
      subtractMoney: 0, //优惠劵减金额
      fullMoney: 0, //优惠劵满金额
      scoreTimes: member.scoreTimes, //积分倍数
      cardLevel: member.cardLevel, //卡等级
      discount: member.discount, //等级折扣
      memberAllowanceId: '', //津贴id
      allowanceMoney: 0, //津贴金额
      fromMemberId: 0, //发送津贴人id
      datePrices: this.data.infoPrice, //日历房
      free: 0,
    }
    console.log(param)
    util.request(api.UcenterOrderDaysSubmit , param , 'POST').then(res => {
      wx.redirectTo({
        url: "/pages/customized/pay/pay?money="+res.result.money+"&orderId="+res.result.orderId+"&rmdesc="+this.data.order.roomName
      })
    }).catch((err) => {});
  },
  //快捷选天数
  dayBtn(e){
    let customShowNew = false;
    let day = e.currentTarget.dataset.day;
    if(day == 6){
      customShowNew = true;
    };
    this.setData({
      dayNum:day,
      customShow:customShowNew,
      continueDay:day
    });
    // this.changcoupon(parseInt(this.data.order.roomPrice),day)
    this.total();
  },
  //减
  reduceDay(){
    if(this.data.continueDay>1){
      this.setData({
        continueDay:parseInt(this.data.continueDay)-1
      })
    }
    // this.changcoupon(parseInt(this.data.order.roomPrice),parseInt(this.data.continueDay)-1)
    this.total()
  },
  //加
  addDay(){
    this.setData({
      continueDay:parseInt(this.data.continueDay)+1
    });
    // this.changcoupon(parseInt(this.data.order.roomPrice),parseInt(this.data.continueDay)+1)
    this.total()
  },
  //把金额传递给coupon
  // changcoupon(price,num){
  //   this.popId.funCouponList(price*num);
  //   this.setData({
  //     'coupon.couponMoney':0,
  //     'coupon.couponId':null,
  //   })
  // },
  //pop显示
  infoShow(){
    this.setData({
      infoPop:!this.data.infoPop
    })
  },
  depTime(date,day){
    let intVal = Date.parse(date)
    let intValNew = new Date(intVal + day*24*60*60*1000)
    return intValNew.getFullYear() + '-' + this.dayZero(intValNew.getMonth()+1) + '-' + this.dayZero(intValNew.getDate())
  },
  dayZero(val){
    if(val<=9){
      return "0"+val
    }else{
      return val
    }
  },
  //日历房
  funInfoPrice(data,ratecode){
    //明细日历房
    let infoPriceNew = [];
    if(ratecode == 'WEC0'){
      infoPriceNew = data.wec0s.slice(0, -1);
    }else if(ratecode == 'WEC1'){
      infoPriceNew = data.wec1s.slice(0, -1);
    }else if(ratecode == 'WEC'){
      infoPriceNew = data.wecs.slice(0, -1);
    }else if(ratecode == 'WEC3'){
      infoPriceNew = data.wec3s.slice(0, -1);
    }
    return infoPriceNew
  },
})