var check = require('../../../utils/check.js');
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    pics:[
      '../../../static/images/banner1.jpg',
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
      ratecodem:'',
      arr:'',
      dep:'',
    },
    fill:{
      roomNum:1,
      name:'',
      mobile:'',
      mobileDisabled:true,
    },
    breakfast:{
      need:false,
      id:1,
      num:1,
      price:6000,
      priceS:'60.00'
    },
    total:{
      roomPrice:0,
      roomPriceS:'0.00',
      deposit:0,
      depositS:'0.00',
      other:0,
      otherS:'0.00',
      money:0,
      moneyS:'0.00'
    }
  },
  onLoad: function (options) {
    this.hotelInfo();
    this.userInfo();
    this.total();
    console.log(this.data.total.moneyS)
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  onHide: function () {

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
  //早餐劵选择
  breakfastChoose(){
    let need = this.data.breakfast.need
    this.setData({
      'breakfast.need': !need
    });
    //重新计算
    this.total()
  },
  //早餐劵数量
  breakfast(e){
    let type = e.currentTarget.dataset.type
    let numNew = this.data.breakfast.num
    if(type == 0&&numNew>1){  //减法
      numNew -- ;
    }else if(type == 1){
      numNew ++ ;
    }
    this.setData({
      'breakfast.num' : numNew
    })
    //重新计算
    this.total()
  },
  //总计
  total(){
    console.log(this.data.room)
    let bfPrice = 0
    if(this.data.breakfast.need){  //存在早餐
      bfPrice = this.data.breakfast.num*this.data.breakfast.price
    }else{
      bfPrice = 0
    }
    console.log(this.data.room.roomPrice)
    console.log(this.data.fill.roomNum)
    let totalNew = {
      roomPrice:this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum,
      roomPriceS:((this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum)/100).toFixed(2),
      deposit:this.data.room.roomDeposit*this.data.fill.roomNum,
      depositS:(this.data.room.roomDeposit*this.data.fill.roomNum/100).toFixed(2),
      other:this.data.room.roomOther + bfPrice,
      otherS:((this.data.room.roomOther + bfPrice)/100).toFixed(2),
      money:this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum+this.data.room.roomDeposit*this.data.fill.roomNum+this.data.room.roomOther+bfPrice,
      moneyS:((this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum+this.data.room.roomDeposit*this.data.fill.roomNum+this.data.room.roomOther+bfPrice)/100).toFixed(2)
    } 
    console.log(totalNew)
    this.setData({
      total: totalNew
    });
  },
  //立即下单
  placeOrder(){
    if(!util.checkName(this.data.fill.name)){return false}
    if(!util.checkMobile(this.data.fill.mobile)){return false}
    
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
    }
    console.log(param)
    util.request(api.CustomizedHotelsFill ,param, 'POST').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        //跳转
        wx.redirectTo({
          url: "../../customized/pay/pay?money="+res.result.money+"&orderId="+res.result.orderId+"&rmdesc="+this.data.room.roomName
        })
      }else if(res.status.message == "未登录"){
        wx.navigateTo({
          url: "../../auth/login/login"
        })
      }else{
        wx.showModal({title: '错误信息', content: res.status.message ,showCancel: false});
      }
    }).catch((err) => {
      console.log(err)  //{errMsg: "request:fail timeout"}
    });
    
  },
  //酒店信息
  hotelInfo(){
    let calendarNew = wx.getStorageSync("calendar")
    let hotelNew = wx.getStorageSync("hotel")
    let roomrNew = wx.getStorageSync("room")
    console.log(calendarNew)
    console.log(hotelNew)
    console.log(roomrNew)
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
      roomPrice:roomrNew.priceVip,
      roomDeposit:hotelNew.deposit,
      roomOther:0,
      startTime:startTime_s,
      startWeek:this.dayWeek(calendarNew.startTime),
      endTime:endTime_s,
      endWeek:this.dayWeek(calendarNew.endTime),
      timeNum:this.dayNum(calendarNew),
      rmtype:roomrNew.rmtype,
      ratecode:roomrNew.ratecode,
      ratecodem:roomrNew.ratecodem,
      arr:arrTime,
      dep:depTime,
    }
    this.setData({
      room : roomNew
    })
  },
  //个人信息
  userInfo(){
    let tel = wx.getStorageSync('userInfoTel');
    console.log(tel)
    if(tel){  //如果存在
      this.setData({
        'fill.mobile':tel,
        'fill.mobileDisabled':true
      })
      console.log(this.data.fill)
    }else{
      console.log("手机号不存在");
      this.setData({
        'fill.mobileDisabled':false
      })
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
  dayWeek(val){
    let week = ['周日','周一','周二','周三','周四','周五','周六']
    return week[new Date(val).getDay()]
  },
  dayNum(calendarNew){
    let num = calendarNew.endTime-calendarNew.startTime
    return parseInt(num/60/60/24/1000)
  }
})