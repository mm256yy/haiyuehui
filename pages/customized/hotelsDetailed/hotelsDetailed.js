const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user');
Page({
  data: {
    isLogin:false,
    time:{
      start:'05月27日',
      end:'05月29日',
      num:'2'
    },
    hotel:{
      id:0,
      name:'暂无酒店名',
      pics:[
        '../../../static/images/banner1.jpg',
      ],
      address:'暂无地址',
      tel:'暂无电话',
      dining:{},
      gym:{},
      meeting:{},
      room:[
        /*{
          id:0,
          name:'roomName',
          img:'../../../static/images/room.jpg',
          priceBefore:'0',
          priceBeforeS:'100.00',
          priceVip:'0',
          priceVipS:'100.00',
          avail:1,
          rmtype:'HHF',
          ratecode:'MEMC',
          ratecodem:'OTA5',
          isCis:false,
        }*/
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
    //this.init()
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.init();
    //this.isLogin();
  },
  onHide: function () {

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
      hotelVal = hotel.address
    }
      //判断电话
    let telVal = '';
    console.log(hotel.tel == null||hotel.tel == 'null')
    if(hotel.tel == null||hotel.tel == 'null'||hotel.tel == undefined||hotel.tel == ''){
      telVal = '暂无电话'
    }else{
      telVal = hotel.tel
    }
    console.log(hotelVal)
    this.setData({   
      time: timeNew,
      'hotel.id':hotel.id,
      'hotel.name':hotel.name,
    })
    //判断是否登陆
    let isLoginNew = false;
    user.checkLogin().then(res => {
      isLoginNew = true
    }).catch((res) =>{
      isLoginNew = false
    })
    //获取房间信息
    let arrNew = new Date(calendar.startTime).getFullYear() +'-'+ this.dayZero(new Date(calendar.startTime).getMonth()+1)+'-'+this.dayZero(new Date(calendar.startTime).getDate())
    let depNew = new Date(calendar.startTime).getFullYear() +'-'+ this.dayZero(new Date(calendar.endTime).getMonth()+1)+'-'+this.dayZero(new Date(calendar.endTime).getDate())
    let param = {
      arr: arrNew,
      dep: depNew,
      hotelId: hotel.id
    }
    util.request(api.CustomizedHotelsDetailed, param , 'GET').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        let roomNew  = [];
        let roomLi = {};
        for(let i=0;i<res.result.length;i++){
          roomLi = {
            id:0,
            name:res.result[i].name,
            img:'../../../static/images/room.jpg',
            priceBefore:res.result[i].price,
            priceBeforeS:(res.result[i].price/100).toFixed(2),
            priceVip:res.result[i].pricem,
            priceVipS:(isLoginNew?(res.result[i].pricem/100).toFixed(2):'？？？'),
            avail:res.result[i].avail,
            rmtype:res.result[i].rmtype,
            ratecode:res.result[i].ratecode,
            ratecodem:res.result[i].ratecodem,
            isCis:false
          }
          roomNew.push(roomLi)
        }
        console.log(telVal)
        let hotelNew = {
          id:hotel.id,
          name:hotel.name,   
          pics:[
            '../../../static/images/banner1.jpg',
            '../../../static/images/banner1.jpg',
          ],
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
        //如果存在云入住
        this.isCis()
      } else {
        wx.navigateTo({
          url: "../../auth/login/login"
        })
      }
    }).catch((err) => {
      console.log(err)
    });
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
  //判断是否登陆
  isLogin(){
    user.checkLogin().then(res => {
      this.setData({
        isLogin:true
      })
      //进行页面渲染
      let hotelNew = this.data.hotel
      for(let i=0;i<hotelNew.room.length;i++){
        hotelNew.room[i].priceVipS = (hotelNew.room[i].priceVip/100).toFixed(2)
      }
      console.log(hotelNew)
      this.setData({
        hotel:hotelNew
      })
    }).catch((res) =>{
      console.log(res+'需要登陆');
      this.setData({
        isLogin:false
      })
      //进行页面渲染
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
      url: "../../pop/calendar/index"
    })
  },
  //拨打电话
  goTel(){
    /*wx.makePhoneCall({
      phoneNumber: this.data.hotel.tel
    })*/
  },
  //选择房间
  room(e){
    let data = e.currentTarget.dataset;
    if(this.data.hotel.room[data.arr].avail!=0){
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
      wx.showModal({title: '错误信息',content: '房间已经满员',showCancel: false});
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
      console.log(res)
      if (res.status.code === 0) {
        let roomNew = res.result
        this.setData({
          room:roomNew
        })
      }else{
        //登陆
        wx.navigateTo({
          url: "../../auth/login/login"
        })
      }
    }).catch((err) => {
      console.log(err)
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