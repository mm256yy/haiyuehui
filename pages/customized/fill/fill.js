let check = require('../../../utils/check.js');
let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');

Page({
  data: {
    pics:[
      '/static/images/banner2.jpg',
    ],
    room:{
      hotelId:'',
      hotelName:'',
      roomId:'',
      roomName:'',
      roomPrice:0,
      roomDeposit:0,
      roomOther:0,
      startTime:'',
      startWeek:'',
      endTime:'',
      endWeek:'',
      timeNum:1,
      rmtype:'',
      ratecode:'',
      arr:'',
      dep:'',
      cis:0,
      wrac:999900,  //门市价
      wec0:999900,  //无早
      wec1:999900,  //单早
      wec:999900,  //双早
      wec3:999900,  //三早
      discount:100,
    },
    fill:{
      // roomNum:1,
      // name:'',
      // mobile:'',
      // mobileDisabled:false,
      // cardLevel:'',
      // grade:0,
      // discount:100,
      // scoreTimes:100,
    },
    breakfastUl:[
      // {price:1200,name:'不选早餐',val:'wec0'},
      // {price:1200,name:'单人早餐',val:'wec1'},
      // {price:1200,name:'双人早餐',val:'wec'},
      // {price:1200,name:'三人早餐',val:'wec3'},
    ],
    breakfastChoose:0,
    coupon:{
      couponId:null,
      couponMoney:0, 
      fullMoney:0,
    },
    total:{
      timeNum:1,
      roomPrice:999900,
      roomTotalPrice:999900,
      coupon:0,
      discount:100,
      deposit:50000,
      other:0,
      money:999900,
    }
  },
  onLoad: function (options) {
    
  },
  onReady: function (){
    this.popId = this.selectComponent("#popId");
    this.evaluationId = this.selectComponent("#evaluationId");
    //加载外部事件
    setTimeout(()=>{
      this.popId.funCouponFrist(this.data.breakfastUl[0].price*this.data.room.timeNum)
    },100)
  },
  onShow: function () {
    this.hotelInfo();
    this.userInfo();
    this.pics();
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    if(currPage.data.info){
      this.setData({
        'fill.name':currPage.data.info.name,
        'fill.mobile':currPage.data.info.mobile,
      })
    }
  },
  //酒店信息
  hotelInfo(){
    let calendarNew = wx.getStorageSync("calendar")
    let hotelNew = wx.getStorageSync("hotel")
    let roomrNew = wx.getStorageSync("room")
    // console.log(calendarNew)
    // console.log(hotelNew)
    // console.log(roomrNew)
    let s_t = new Date(calendarNew.startTime)
    let e_t = new Date(calendarNew.endTime)
    let startTime_s = this.dayZero(s_t.getMonth()+1)+'月'+this.dayZero(s_t.getDate())+'日'
    let endTime_s = this.dayZero(e_t.getMonth()+1)+'月'+this.dayZero(e_t.getDate())+'日'
    let arrTime = this.dayZero(s_t.getFullYear())+'-'+this.dayZero(s_t.getMonth()+1)+'-'+this.dayZero(s_t.getDate())
    let depTime = this.dayZero(s_t.getFullYear())+'-'+this.dayZero(e_t.getMonth()+1)+'-'+this.dayZero(e_t.getDate())
    let roomNew = {
      hotelId:hotelNew.id,
      hotelName:hotelNew.name,
      roomId:roomrNew.id,
      roomName:roomrNew.name,
      roomPrice:this.moneyMin(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3),
      roomDeposit:hotelNew.deposit,
      roomOther:0,
      startTime:startTime_s,
      startWeek:util.formatWeek(calendarNew.startTime),
      endTime:endTime_s,
      endWeek:util.formatWeek(calendarNew.endTime),
      timeNum:this.dayNum(calendarNew),
      rmtype:roomrNew.rmtype,
      ratecode:'WEC0',
      arr:arrTime,
      dep:depTime,
      cis:(roomrNew.isCis?1:0), //1是 0否
      wrac:roomrNew.wrac,  //门市价
      wec0:roomrNew.wec0,  //无早
      wec1:roomrNew.wec1,  //单早
      wec:roomrNew.wec,  //双早
      wec3:roomrNew.wec3,  //三早
    }
    let breakfastUlNew = [
      {price:roomrNew.wec0,name:'无早餐',val:'WEC0'},
      {price:roomrNew.wec1,name:'单人早餐',val:'WEC1'},
      {price:roomrNew.wec,name:'双人早餐',val:'WEC'},
      {price:roomrNew.wec3,name:'三人早餐',val:'WEC3'},
    ]
    this.setData({
      room : roomNew,
      breakfastUl:breakfastUlNew,
      breakfastChoose:this.breakfastNum(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3),
    })
  },
  //个人信息
  userInfo(){
    let tel = wx.getStorageSync('userInfoMobile');
    if(tel){  //如果存在
      let fillNew = {};
      //获取手机
      this.setData({
        'fill.mobile':tel,
        'fill.mobileDisabled':false
      });
      //获取名字
      util.request(api.MemberGet, 'GET').then(res => {
        fillNew = {
          roomNum:1,
          name:(res.result.name != null?res.result.name:''),
          mobile:tel,
          mobileDisabled:false,
          cardLevel:res.result.cardLevel,
          grade:util.memberGrade(res.result.cardLevel),
          discount:(res.result.discount?res.result.discount:100),
          scoreTimes:(res.result.scoreTimes?res.result.scoreTimes:100),
        }
        this.setData({
          fill:fillNew,
        });
        
        this.total();
      }).catch((err) => {
        if(err == "未找到会员信息"){
          wx.showModal({ 
            title: '获取会员失败',
            content: '你未绑定手机号码',
            success: function(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "/pages/auth/registerWx/registerWx"
                });
              } else if (res.cancel) {
                wx.navigateBack({ 
                  delta: 1  
                });
              }
            }
          })
        }else{
          wx.showModal({title: '错误信息',content: err ,showCancel: false}); 
        }
      });
    }else{
      console.log("手机号不存在");
      this.setData({
        'fill.mobileDisabled':false
      })
    }
  },
  //早餐选择
  breakfastChoose(e){
    let index = e.currentTarget.dataset.index;
    //传递值进pop
    this.popId.funCouponList(this.data.breakfastUl[index].price*this.data.fill.roomNum*this.data.room.timeNum)
    
    this.setData({
      breakfastChoose: index,
      'room.roomPrice':this.data.breakfastUl[index].price,
      'room.ratecode':this.data.breakfastUl[index].val,
      'coupon.couponMoney':0,
      'coupon.couponId':null,
      'coupon.fullMoney':0,
    });
    
    //重新计算
    this.total();
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
  //总计
  total(){
    let timeNumNew = this.data.room.timeNum;
    let roomPriceNew = this.data.room.roomPrice;
    let roomTotalPriceNew = this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum;
    let depositNew = this.data.room.roomDeposit*this.data.fill.roomNum;
    let couponMoney = this.data.coupon.couponMoney;
    let discountNew = this.data.fill.discount;
    let otherNew = this.data.room.roomOther;
    //总计
    let totalNew = {
      timeNum:timeNumNew,
      roomPrice:roomPriceNew,
      roomTotalPrice:roomTotalPriceNew,
      coupon:couponMoney,
      discount:discountNew,
      deposit:depositNew,
      other:otherNew,
      money:(roomTotalPriceNew-couponMoney+otherNew)*(discountNew/100)+depositNew,
    } 
    console.log(totalNew)
    // this.evaluationId.funTotal(totalNew)
    this.setData({
      total: totalNew
    });
  },
  //立即下单
  placeOrder(){
    if(!check.checkName(this.data.fill.name)){return false};
    if(!check.checkMobile(this.data.fill.mobile)){return false};
    if(!check.checkMoney(this.data.total.money)){return false};
    if(!check.checkMoney(this.data.room.roomPrice)){return false};
    //传递
    let param = {
      hotelId: this.data.room.hotelId,
      money: this.data.total.money,
      rmtype:this.data.room.rmtype,
      rmdesc:this.data.room.roomName,
      ratecode:this.data.room.ratecode,
      roomPrice:this.data.room.roomPrice,
      name:this.data.fill.name,
      mobile:this.data.fill.mobile,
      arr:this.data.room.arr,
      dep:this.data.room.dep,
      deposit:this.data.total.deposit,
      cis:this.data.room.cis,
      memberCouponId:this.data.coupon.couponId,  //优惠劵id
      subtractMoney:this.data.coupon.couponMoney,  //优惠劵减金额
      fullMoney:this.data.coupon.fullMoney,  //优惠劵满金额
      scoreTimes:this.data.fill.scoreTimes,  //积分倍数
      cardLevel:this.data.fill.cardLevel,  //卡等级
      discount:this.data.fill.discount,  //等级折扣
    };
    console.log(param)
    util.request(api.CustomizedHotelsFill ,param, 'POST').then(res => {
      //跳转
      wx.redirectTo({
        url: "/pages/customized/pay/pay?money="+res.result.money+"&orderId="+res.result.orderId+"&rmdesc="+this.data.room.roomName
      })
    }).catch((err) => {
      console.log(err)
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //money
  moneyMin(wec0,wec1,wec,wec3){
    if(util.importantMoney(wec0) != 999900){
      return wec0;
    }else if(util.importantMoney(wec1) != 999900){
      return wec1;
    }else if(util.importantMoney(wec) != 999900){
      return wec;
    }else if(util.importantMoney(wec3) != 999900){
      return wec3;
    }else{
      return 999900
    }
  },
  breakfastNum(wec0,wec1,wec,wec3){
    if(util.importantMoney(wec0) != 999900){
      return 0;
    }else if(util.importantMoney(wec1) != 999900){
      return 1;
    }else if(util.importantMoney(wec) != 999900){
      return 2;
    }else if(util.importantMoney(wec3) != 999900){
      return 3;
    }else{
      return 999900
    }
  },
  //时间
  dayZero(val){
    if(val<=9){
      return "0"+val
    }else{
      return val
    }
  },
  //房间数量
  room(e){
    let type = e.currentTarget.dataset.type
    let numNew = this.data.fill.roomNum
    if(type == 0&&numNew>1){  //减法
      numNew -- ;
    }else if(type == 1){
      numNew ++ ;
    }
    this.setData({
      'fill.roomNum' : numNew
    })
    //重新计算
    this.total()
  },
  //input焦点
  bindNameInput: function(e) {
    this.setData({
      'fill.name': e.detail.value
    });
  },
  bindMobileInput: function(e) {
    this.setData({
      'fill.mobile': e.detail.value
    });
  },
  //获取房间信息
  pics(){
    let param = {
      hotelId:this.data.room.hotelId,
      rmtype:this.data.room.rmtype,
    }
    util.request(api.CustomizedHotelsRoom , param , 'GET').then(res => {
      this.setData({
        pics:res.result.imgList.length == 0?['/static/images/banner2.jpg']:res.result.imgList
      })
    }).catch((err) => {
      console.log(err)
      // wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //跳转到常住人
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
  dayNum(calendarNew){
    let num = calendarNew.endTime-calendarNew.startTime
    return parseInt(num/60/60/24/1000)
  }
})