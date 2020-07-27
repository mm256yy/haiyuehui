// pages/ucenter/orderContinue/orderContinue.js
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    pics:[
      '/static/images/banner3.jpg',
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
      coupon:0,
      couponS:'0.00',
      discount:100,
      discountS:10,
      other:0,
      otherS:'0.00',
      money:0,
      moneyS:'0.00'
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
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //个人信息
  userInfo(){
    util.request(api.MemberGet, 'GET').then(res => {
      let memberNew = {
        cardLevel:res.result.cardLevel,
        discount:(res.result.discount?res.result.discount:100),
        scoreTimes:(res.result.scoreTimes?res.result.scoreTimes:100),
      }
      this.setData({
        member:memberNew,
      });
      //加载外部事件
      this.popId.funCouponFrist(parseInt(this.data.order.roomPrice));
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
    //房费
    let roomPriceNew = parseInt(this.data.order.roomPrice)*parseFloat(dayNum);
    //押金
    let depositNew = 0;
    //优惠劵
    let couponMoney = this.data.coupon.couponMoney;
    //会员折扣
    let discountNew = this.data.member.discount;
    //other
    let otherNew = 0;
    //总计
    let totalNew = {
      roomPrice:roomPriceNew,
      roomPriceS:(roomPriceNew/100).toFixed(2),
      deposit:depositNew,
      depositS:(depositNew/100).toFixed(2),
      coupon:couponMoney,
      couponS:(couponMoney/100).toFixed(2),
      discount:discountNew,
      discountS:discountNew/10,
      other:otherNew,
      otherS:(otherNew/100).toFixed(2),
      money:(roomPriceNew-couponMoney+otherNew)*(discountNew/100)+depositNew,
      moneyS:(((roomPriceNew-couponMoney+otherNew)*(discountNew/100)+depositNew)/100).toFixed(2)
    }
    this.setData({
      total:totalNew
    })
  },
  //couponTotal
  couponTotal(e){
    let money = e.detail;
    let couponNew = {
      couponId:money.couponId,
      couponMoney:money.couponMoney, 
      fullMoney:money.fullMoney,
    };
    this.setData({
      coupon:couponNew,
    });
    this.total();
  },
  //下订单
  placeOrder(){
    let param = {
      orderId:this.data.orderId,
      days:this.data.continueDay,
      outHour:(this.data.continueDay == 0?18:14),
      memberCouponId:this.data.coupon.couponId,  //优惠劵id
      subtractMoney:this.data.coupon.couponMoney,  //优惠劵减金额
      fullMoney:this.data.coupon.fullMoney,  //优惠劵满金额
      scoreTimes:this.data.member.scoreTimes,  //积分倍数
      cardLevel:this.data.member.cardLevel,  //卡等级
      discount:this.data.member.discount,  //等级折扣
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
    let day = e.currentTarget.dataset.day;
    if(day == 5){
      customShowNew = true;
    };
    this.setData({
      dayNum:day,
      customShow:customShowNew,
      continueDay:day
    });
    this.changcoupon(parseInt(this.data.order.roomPrice),day)
    this.total();
  },
  //减
  reduceDay(){
    if(this.data.continueDay>1){
      this.setData({
        continueDay:parseInt(this.data.continueDay)-1
      })
    }
    this.changcoupon(parseInt(this.data.order.roomPrice),parseInt(this.data.continueDay)-1)
    this.total()
  },
  //加
  addDay(){
    this.setData({
      continueDay:parseInt(this.data.continueDay)+1
    });
    this.changcoupon(parseInt(this.data.order.roomPrice),parseInt(this.data.continueDay)+1)
    this.total()
  },
  //把金额传递给coupon
  changcoupon(price,num){
    this.popId.funCouponList(price*num);
    this.setData({
      'coupon.couponMoney':0,
      'coupon.couponId':null,
    })
  },
})