//index.js
let util = require('../../utils/util.js');
let api = require('../../config/api.js');
let app = getApp();

Page({
  data: {
    bannerUrls:[
      '/static/images/banner1.jpg',
      '/static/images/banner3.jpg',
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
  onLoad: function (option) {
    this.invite(option);
  },
  onShow: function (e) {
    let pages = getCurrentPages();
    this.renderingTime();
  },
  //传递邀请人
  invite(option){
    console.log(option);
    if(option.inviteCode){
      wx.setStorageSync('othersInviteCode', option.inviteCode);
    }else{
      let scene = decodeURIComponent(option.scene).toString().split('=');
      let inviteCode = scene[1];
      wx.setStorageSync('othersInviteCode', inviteCode);
    }
  },
  //跳转酒店详情
  hotelsDetailed(){
    wx.navigateTo({
      url: "/pages/customized/hotelsDetailed/hotelsDetailed?hotelsId="+this.data.hotelsId+"&startTime="+this.data.startTime+"&endTime="+this.data.endTime
    });
  },
  //跳转酒店列表
  hotelsList(){
    wx.navigateTo({
      url: "/pages/customized/hotelsList/hotelsList"
    });
  },
  //跳转日历
  calendarShow(){
    wx.navigateTo({
      url: "/pages/pop/calendar/index"
    });
  },
  //跳转日历
  orderTransfer(){
    wx.navigateTo({
      url: "/pages/ucenter/order/orderTransfer/orderTransfer"
    });
  },
  //进行日历处理
  renderingTime(){
    let calendar = wx.getStorageSync("calendar");  //获取数据
    let d_today = new Date();
    //console.log(calendar);
    if(calendar && (calendar.startTime+1000*60*60*24)>=d_today.getTime()){  //判断是否有储存时间/储存时间大于当前时间 --有
      let d_today = new Date(calendar.startTime);
      let d_tomorrow = new Date(calendar.endTime);
      this.setData({
        startTime:this.dayZero(d_today.getFullYear())+'-'+this.dayZero(d_today.getMonth()+1)+'-'+this.dayZero(d_today.getDate()),
        endTime:this.dayZero(d_tomorrow.getFullYear())+'-'+this.dayZero(d_tomorrow.getMonth()+1)+'-'+this.dayZero(d_tomorrow.getDate())
      });
    }else{ //--没有
      let d_tomorrow = new Date(new Date().getTime()+60*60*24*1000);
      let calendarSto = {};
      this.setData({
        startTime:this.dayZero(d_today.getFullYear())+'-'+this.dayZero(d_today.getMonth()+1)+'-'+this.dayZero(d_today.getDate()),
        endTime:this.dayZero(d_tomorrow.getFullYear())+'-'+this.dayZero(d_tomorrow.getMonth()+1)+'-'+this.dayZero(d_tomorrow.getDate())
      });
      calendarSto = {
        startTime:new Date(new Date().toLocaleDateString()).getTime(),
        endTime:new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000,
      }
      wx.setStorageSync("calendar", calendarSto);
    }
    //转化成展示数据
    let calendarNew = wx.getStorageSync("calendar");
    let st_t = new Date(calendarNew.startTime);
    let end_t = new Date(calendarNew.endTime);
    let showNew = {
      startTime:this.dayZero(st_t.getMonth()+1)+'月'+this.dayZero(st_t.getDate())+'日',
      startWeek:util.formatWeek(calendarNew.startTime),
      endTime:this.dayZero(end_t.getMonth()+1)+'月'+this.dayZero(end_t.getDate())+'日',
      endWeek:util.formatWeek(calendarNew.endTime),
      num:this.dayNum(calendarNew)
    };
    this.setData({
      show:showNew
    });
  },
  dayZero(val){
    if(val<=9){
      return "0"+val;
    }else{
      return val;
    };
  },
  dayNum(calendarNew){
    let num = calendarNew.endTime-calendarNew.startTime;
    return parseInt(num/60/60/24/1000);
  },
  UrlDecode(str){
    let ret="";
    for(let i=0;i<str.length;i++){
      let chr = str.charAt(i);
      if(chr == "+"){
        ret+=" ";
      }else if(chr=="%"){
        let asc = str.substring(i+1,i+3);
        if(parseInt("0x"+asc)>0x7f){
          ret+=asc2str(parseInt("0x"+asc+str.substring(i+4,i+6)));
          i+=5;
        }else{
          ret+=asc2str(parseInt("0x"+asc));
        i+=2;
        };
      }else{
        ret+= chr;
      };
    };
    return ret;
  },
});
