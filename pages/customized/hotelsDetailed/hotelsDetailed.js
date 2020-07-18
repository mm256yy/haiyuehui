let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user');
Page({
  data: {
    isLogin:true,
    time:{
      start:'05月27日',
      end:'05月29日',
      num:'2'
    },
    hotel:{
      id:0,
      name:'暂无酒店名',
      pics:[
        '/static/images/banner1.jpg',
      ],
      address:'暂无地址',
      tel:'暂无电话',
      dining:{},
      gym:{},
      meeting:{},
      room:[
        // {
        //   id:0,
        //   name:'roomName',
        //   img:'/static/images/room.jpg',
        //   avail:1,
        //   rmtype:'HHF',
        //   isCis:false,

        //   wrac:1600,  //门市价
        //   wec0:800,  //无早
        //   wec1:900,  //单早
        //   wec:1000,  //双早
        //   wec3:1100,  //三早
        //   wracS:'16.00',  
        //   wec0S:'8.00',  
        // }
      ]
    },
    room:{
      name:"room"
      //直接拿取
    },
    infoPop:false,
    animationData:{},
    popHeight:0,
  },
  onLoad: function () {
  },
  onShow: function () {
    this.init();
  },
  //初始化时间
  init(){
    let calendar = wx.getStorageSync("calendar")  //获取数据    
    //整合入当前页面
    let timeNew = {
      start:this.dayZero(new Date(calendar.startTime).getMonth()+1)+'月'+this.dayZero(new Date(calendar.startTime).getDate())+'日',
      end:this.dayZero(new Date(calendar.endTime).getMonth()+1)+'月'+this.dayZero(new Date(calendar.endTime).getDate())+'日',
      num:parseInt((new Date(calendar.endTime).getTime()-new Date(calendar.startTime).getTime())/60/60/24/1000)
    }
    //获取酒店信息
    let hotel = wx.getStorageSync("hotel")
    console.log(hotel)
      //判断地址
    let hotelVal = '';
    if(hotel.address == null||hotel.address == 'null'||hotel.address == undefined||hotel.address == ''){
      hotelVal = '暂无地址'
    }else{
      hotelVal = hotel.address;
    }
      //判断电话
    let telVal = '';
    if(hotel.tel == null||hotel.tel == 'null'||hotel.tel == undefined||hotel.tel == ''){
      telVal = '暂无电话'
    }else{
      telVal = hotel.tel
    }
    this.setData({   
      time: timeNew,
      'hotel.id':hotel.id,
      'hotel.name':hotel.name,
    })
    //获取房间信息
    let arrNew = new Date(calendar.startTime).getFullYear() +'-'+ this.dayZero(new Date(calendar.startTime).getMonth()+1)+'-'+this.dayZero(new Date(calendar.startTime).getDate())
    let depNew = new Date(calendar.startTime).getFullYear() +'-'+ this.dayZero(new Date(calendar.endTime).getMonth()+1)+'-'+this.dayZero(new Date(calendar.endTime).getDate())
    let param = {
      arr: arrNew,
      dep: depNew,
      hotelId: hotel.id
    }
    //判断是否登陆
    let isLoginNew = false;
    user.checkLogin().then(res => {
      isLoginNew = true
    }).catch((res) =>{
      isLoginNew = false
    }).then(res=>{
      util.request(api.CustomizedHotelsDetailed, param , 'GET').then(res => {
        let roomNew  = [];
        let roomLi = {};
        for(let i=0;i<res.result.length;i++){
          roomLi = {
            id:0,
            name:res.result[i].name,
            img:(res.result[i].img?res.result[i].img:'/static/images/room.jpg'),
            avail:res.result[i].avail,
            rmtype:res.result[i].rmtype,
            isCis:res.result[i].isCis,

            // priceBefore:res.result[i].price,
            // priceBeforeS:util.money(res.result[i].price),
            // priceVip:res.result[i].pricem,
            // priceVipS:(isLoginNew?util.money(res.result[i].pricem):'？？？'),
            // ratecode:res.result[i].ratecode,
            // ratecodem:res.result[i].ratecodem,

            wrac:util.importantMoney(res.result[i].wrac),  //门市价
            wec0:util.importantMoney(res.result[i].wec0),  //无早
            wec1:util.importantMoney(res.result[i].wec1),  //单早
            wec:util.importantMoney(res.result[i].wec),  //双早
            wec3:util.importantMoney(res.result[i].wec3),  //三早
            wracS:(util.importantMoney(res.result[i].wrac)/100),  
            wec0S:(isLoginNew?(this.moneyMin(res.result[i].wec0,res.result[i].wec1,res.result[i].wec,res.result[i].wec3)/100):'???? '), 
          }
          roomNew.push(roomLi)
        }
        console.log(hotel)
        let hotelNew = {
          id:hotel.id,
          name:hotel.name,   
          pics:(hotel.imgList?hotel.imgList:['/static/images/banner1.jpg']),
          address:hotelVal,
          tel:telVal,
          dining:{},
          gym:{},
          meeting:{},
          room:roomNew
        }
        this.setData({
          hotel:hotelNew,
          isLogin:isLoginNew
        })
      }).catch((err) => {
        wx.showModal({title: '错误信息',content: err,showCancel: false}); 
      });
    })
    console.log(this.data.hotel)
  },
  //判断是否云智住
  isCis(){
    let canCis = [
      {
        hotelId:"H000001",
        room:[0,2,5]
      }
    ]
    let hotelCisNew = this.data.hotel
    for(let i=0;i<canCis.length;i++){
      if(canCis[i].hotelId == this.data.hotel.id){
        for(let j=0;j<canCis[i].room.length;j++){
          hotelCisNew.room[canCis[i].room[j]].isCis = true;
        }
      }
    }
    this.setData({
      hotel:hotelCisNew
    })
  },
  /*选择酒店*/
  goHotelsList(){
    wx.navigateBack({
      delta: 1
    })
  },
  /*选择日历*/ 
  goCalendar(){
    wx.navigateTo({
      url: "/pages/pop/calendar/index"
    })
  },
  //去地图
  goMap(){
    wx.navigateTo({ 
      url: "/pages/customized/hotelsMap/hotelsMap?hotelId="+this.data.hotel.id
    });
  },
  //拨打电话
  goTel(){
    wx.makePhoneCall({
      phoneNumber: this.data.hotel.tel
    })
  },
  //选择房间
  room(e){
    let data = e.currentTarget.dataset;
    if(this.data.hotel.room[data.arr].avail>0){
      wx.setStorageSync("room", this.data.hotel.room[data.arr])
      if(this.data.isLogin){
        wx.navigateTo({
          url: "../fill/fill"
        })
      }else{
        wx.navigateTo({ 
          url: "/pages/auth/login/login"
        });
      }
    }else{  //已满员
      wx.showModal({title: '错误信息',content: '房间已经满房',showCancel: false});
    }
  },
  //pop显示
  infoShow(e){
    //获取房间信息
    let param = {
      hotelId:this.data.hotel.id,
      rmtype:e.currentTarget.dataset.rmtype,
    }
    console.log(param)
    util.request(api.CustomizedHotelsRoom , param , 'GET').then(res => {
      let roomNew = res.result;
      this.setData({
        room:roomNew
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
    //POP
    this.setData({
      infoPop:true
    })
    //获取pop的高度
    let height = null;
    let that = this
    wx.createSelectorQuery().selectAll('#pop').boundingClientRect(function (rect) {
      height = rect[0].height
      let animation = wx.createAnimation({
          duration:1000,
          timingFunction:"ease",  //可以看下表1
      })
      animation.translate(0, -height).step();  //动画过程可以看下表2
      that.setData({
        animationData:animation.export()   //设置完毕
      })
    }).exec();
    
  },
  //pop隐藏
  infoHide(){
    let animation = wx.createAnimation({
        duration:1000,
        timingFunction:"ease",  //可以看下表1
    })
    animation.translate(0, 440).step();  //动画过程可以看下表2
    this.setData({
      animationData:animation.export(),   //设置完毕
      infoPop:false
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