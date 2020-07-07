var check = require('../../../utils/check.js');
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    pics:[
      '/static/images/banner1.jpg',
    ],
    room:{
      hotelId:'',
      hotelName:'',
      roomId:'',
      roomName:'',
      roomPrice:0,
      roomPriceS:0,
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
      wrac:1600,  //门市价
      wec0:800,  //无早
      wec1:900,  //单早
      wec:1000,  //双早
      wec3:1100,  //三早
    },
    fill:{
      roomNum:1,
      name:'',
      mobile:'',
      mobileDisabled:false,
    },
    breakfastUl:[
      // {price:1200,priceS:'12.00',name:'不选早餐',val:'wec0'},
      // {price:1200,priceS:'12.00',name:'单人早餐',val:'wec1'},
      // {price:1200,priceS:'12.00',name:'双人早餐',val:'wec'},
      // {price:1200,priceS:'12.00',name:'三人早餐',val:'wec3'},
    ],
    breakfastChoose:0,
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
  onShow: function () {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data)  
    if(currPage.data.info){
      this.setData({
        'fill.name':currPage.data.info.name,
        'fill.mobile':currPage.data.info.mobile,
      })
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
  //早餐选择
  breakfastChoose(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      breakfastChoose: index,
      'room.roomPrice':this.data.breakfastUl[index].price,
      'room.roomPriceS':((this.data.breakfastUl[index].price)/100).toFixed(2),
      'room.ratecode':this.data.breakfastUl[index].val,
    });
    //重新计算
    this.total()
  },
  //总计
  total(){
    let totalNew = {
      roomPrice:this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum,
      roomPriceS:((this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum)/100).toFixed(2),
      deposit:this.data.room.roomDeposit*this.data.fill.roomNum,
      depositS:(this.data.room.roomDeposit*this.data.fill.roomNum/100).toFixed(2),
      other:this.data.room.roomOther,
      otherS:((this.data.room.roomOther)/100).toFixed(2),
      money:this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum+this.data.room.roomDeposit*this.data.fill.roomNum+this.data.room.roomOther,
      moneyS:((this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum+this.data.room.roomDeposit*this.data.fill.roomNum+this.data.room.roomOther)/100).toFixed(2)
    } 
    this.setData({
      total: totalNew
    });
  },
  //立即下单
  placeOrder(){
    if(!util.checkName(this.data.fill.name)){return false}
    if(!util.checkMobile(this.data.fill.mobile)){return false}
    if(!util.checkMoney(this.data.total.money)){return false}
    if(!util.checkMoney(this.data.room.roomPrice)){return false}
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
      cis:this.data.room.cis
    }
    console.log(param)
    util.request(api.CustomizedHotelsFill ,param, 'POST').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        //跳转
        wx.redirectTo({
          url: "/pages/customized/pay/pay?money="+res.result.money+"&orderId="+res.result.orderId+"&rmdesc="+this.data.room.roomName
        })
      }else if(res.status.message == "未登录"){
        wx.navigateTo({
          url: "/pages/auth/login/login"
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
      roomPrice:this.moneyMin(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3),
      roomPriceS:(this.moneyMin(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3)/100).toFixed(2),
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
      {price:roomrNew.wec0,priceS:((roomrNew.wec0)/100).toFixed(2),name:'无早餐',val:'WEC0'},
      {price:roomrNew.wec1,priceS:((roomrNew.wec1)/100).toFixed(2),name:'单人早餐',val:'WEC1'},
      {price:roomrNew.wec,priceS:((roomrNew.wec)/100).toFixed(2),name:'双人早餐',val:'WEC'},
      {price:roomrNew.wec3,priceS:((roomrNew.wec3)/100).toFixed(2),name:'三人早餐',val:'WEC3'},
    ]
    this.setData({
      room : roomNew,
      breakfastUl:breakfastUlNew,
      breakfastChoose:this.breakfastNum(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3),
    })
    console.log(this.data.room)
  },
  //个人信息
  userInfo(){
    let tel = wx.getStorageSync('userInfoMobile');
    console.log(tel)
    if(tel){  //如果存在
      //获取手机
      this.setData({
        'fill.mobile':tel,
        'fill.mobileDisabled':false
      })
      //获取名字
      util.request(api.UcenterSetMemberGet, 'GET').then(res => {
        console.log(res)
        if (res.status.code === 0) {
          this.setData({
            'fill.name':(res.result.name != null?res.result.name:'')
          })
        }else if(res.status.message === "请先登录"){
          wx.navigateTo({
            url: "/pages/auth/login/login"
          });
        }
      }).catch((err) => {
        console.log(err)
      });
      console.log(this.data.fill)
    }else{
      console.log("手机号不存在");
      this.setData({
        'fill.mobileDisabled':false
      })
    }
  },
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
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
  dayNum(calendarNew){
    let num = calendarNew.endTime-calendarNew.startTime
    return parseInt(num/60/60/24/1000)
  }
})