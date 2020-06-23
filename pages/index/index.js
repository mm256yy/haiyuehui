//index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    bannerUrls:[
      '../../static/images/banner1.jpg',
    ],
    hotelsName:'点击选择酒店',
    hotelsId:'hotelsId',
    startTime:'startTime',
    endTime:'endTime',
    show:{
      startTime:'05月16日',
      startWeek:'今日',
      endTime:'05月18日',
      endWeek:'明日',
      num:1
    },
    calendarShow:false,
  },
  onLoad: function (e) {
    console.log(app.globalData)
  },
  aa(){
    console.log(wx.getStorageSync("hotel"))
  },
  onShow: function (e) {
    this.renderingTime()
  },
  //跳转酒店详情
  hotelsDetailed(){
    wx.navigateTo({
      url: "../customized/hotelsDetailed/hotelsDetailed?hotelsId="+this.data.hotelsId+"&startTime="+this.data.startTime+"&endTime="+this.data.endTime
    })
  },
  //跳转酒店列表
  hotelsList(){
    wx.navigateTo({
      url: "../customized/hotelsList/hotelsList"
    })
  },
  //跳转日历
  calendarShow(){
    wx.navigateTo({
      url: "../pop/calendar/index"
    })
  },
  //跳转日历
  orderTransfer(){
    wx.navigateTo({
      url: "../ucenter/orderTransfer/orderTransfer"
    })
  },
  //进行日历处理
  renderingTime(){
    let calendar = wx.getStorageSync("calendar")  //获取数据
    let d_today = new Date();
    console.log(calendar)
    if(calendar && (calendar.startTime+1000*60*60*24)>=d_today.getTime()){  //判断是否有储存时间/储存时间大于当前时间 --有
      console.log(789)
      let d_today = new Date(calendar.startTime);
      let d_tomorrow = new Date(calendar.endTime);
      console.log(d_today)
      this.setData({
        startTime:this.dayZero(d_today.getFullYear())+'-'+this.dayZero(d_today.getMonth()+1)+'-'+this.dayZero(d_today.getDate()),
        endTime:this.dayZero(d_tomorrow.getFullYear())+'-'+this.dayZero(d_tomorrow.getMonth()+1)+'-'+this.dayZero(d_tomorrow.getDate())
      })
    }else{ //--没有
      let d_tomorrow = new Date(new Date().getTime()+60*60*24*1000);
      let calendarSto = {}
      this.setData({
        startTime:this.dayZero(d_today.getFullYear())+'-'+this.dayZero(d_today.getMonth()+1)+'-'+this.dayZero(d_today.getDate()),
        endTime:this.dayZero(d_tomorrow.getFullYear())+'-'+this.dayZero(d_tomorrow.getMonth()+1)+'-'+this.dayZero(d_tomorrow.getDate())
      })
      calendarSto = {
        startTime:d_today.getTime(),
        endTime:d_tomorrow.getTime()
      }
      wx.setStorageSync("calendar", calendarSto)
    }
    //转化成展示数据
    let calendarNew = wx.getStorageSync("calendar")
    let st_t = new Date(calendarNew.startTime)
    let end_t = new Date(calendarNew.endTime)
    let showNew = {
      startTime:this.dayZero(st_t.getMonth()+1)+'月'+this.dayZero(st_t.getDate())+'日',
      startWeek:this.dayWeek(calendarNew.startTime),
      endTime:this.dayZero(end_t.getMonth()+1)+'月'+this.dayZero(end_t.getDate())+'日',
      endWeek:this.dayWeek(calendarNew.endTime),
      num:this.dayNum(calendarNew)
    }
    console.log(calendarNew)
    this.setData({
      show:showNew
    })
  },
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
