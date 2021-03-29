let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    hotelId:0,
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
        // '/static/images/banner1.jpg',
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
        //   hasSale:'', //是否有优惠信息
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
    quickDownVal:0,  //0 收缩 1 展开 2 隐藏 3显示
  },
  onLoad: function (option) {
    this.setData({
      hotelId:option.hotelId,
    })
  },
  onShow: function () {
    this.renderingTime(); //日历
    this.funHotelId(this.data.hotelId);
  },
  // 获取id
  funHotelId(hotelId){
    let hotelsLi = {};
    util.request(api.CustomizedHotelsList, 'GET').then(res => {
      for(let i=0;i<res.result.length;i++){
        if(res.result[i].id == hotelId){
          hotelsLi = {
            id:res.result[i].id,
            name:res.result[i].name,
            img:res.result[i].imgList != null?res.result[i].imgList[0]:'/static/images/banner2.jpg',
            address:res.result[i].address,
            deposit:res.result[i].deposit,
            tel:res.result[i].tel,
            cis:res.result[i].cis,
            imgList:res.result[i].imgList,
          }
        }
      }
      wx.setStorageSync("hotel", hotelsLi);
      this.getAllowance();
      this.init();
    }).catch((err) => {});
  },
  //获取津贴
  getAllowance(){
    let inviteCode = wx.getStorageSync('othersInviteCode')
    console.log(inviteCode);
    if(inviteCode != ""&&inviteCode != undefined){
      let param = {
        inviteCode:inviteCode,
      };
      util.request(api.MemberInviteSendAllowance , param , 'GET').then(res => {
        wx.showModal({title: '恭喜',content: "成功获取5元津贴",showCancel: false}); 
        wx.setStorageSync('othersInviteCode', "");
      }).catch((err) => {});
    }
  },
  //初始化
  init(){
    //获取酒店信息
    let hotel = wx.getStorageSync("hotel");
    if(hotel){
      hotel = wx.getStorageSync("hotel");
    }else{
      wx.navigateTo({
        url: "/pages/customized/hotelsList/hotelsList"
      })
    }
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
      'hotel.id':hotel.id,
      'hotel.name':hotel.name,
    })
    //获取房间信息
    let calendar = wx.getStorageSync("calendar")
    let arrNew = new Date(calendar.startTime).getFullYear() +'-'+ this.dayZero(new Date(calendar.startTime).getMonth()+1)+'-'+this.dayZero(new Date(calendar.startTime).getDate())
    let depNew = new Date(calendar.endTime).getFullYear() +'-'+ this.dayZero(new Date(calendar.endTime).getMonth()+1)+'-'+this.dayZero(new Date(calendar.endTime).getDate())
    let param = {
      arr: arrNew,
      dep: depNew,
      hotelId: hotel.id
    }
    //判断是否登陆
    let isLoginNew = false;
    user.checkLogin().then(res => {
      isLoginNew = true;
    }).catch((res) =>{
      isLoginNew = false;
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
            wrac:util.importantMoney(res.result[i].wrac),  //门市价
            wec0:util.importantMoney(res.result[i].wec0),  //无早
            wec1:util.importantMoney(res.result[i].wec1),  //单早
            wec:util.importantMoney(res.result[i].wec),  //双早
            wec3:util.importantMoney(res.result[i].wec3),  //三早
            wracS:(util.importantMoney(res.result[i].wrac)/100),  
            wec0S:(isLoginNew?(this.moneyMin(res.result[i].wec0,res.result[i].wec1,res.result[i].wec,res.result[i].wec3)/100):'???? '), 
            wec0s:res.result[i].wec0s,
            wec1s:res.result[i].wec1s,
            wecs:res.result[i].wecs,
            wec3s:res.result[i].wec3s,
            hasSale:res.result[i].hasSale,
          }
          roomNew.push(roomLi)
        }
        let hotelNew = {
          id:hotel.id,
          name:hotel.name,   
          pics:(hotel.imgList?hotel.imgList:['/static/images/banner2.jpg']),
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
      }).catch((err) => {});
    })
  },
  //时间
  renderingTime(){
    let calendar = wx.getStorageSync("calendar")  //获取数据    
    //整合入当前页面
    let timeNew = {
      start:this.dayZero(new Date(calendar.startTime).getMonth()+1)+'月'+this.dayZero(new Date(calendar.startTime).getDate())+'日',
      end:this.dayZero(new Date(calendar.endTime).getMonth()+1)+'月'+this.dayZero(new Date(calendar.endTime).getDate())+'日',
      num:parseInt((new Date(calendar.endTime).getTime()-new Date(calendar.startTime).getTime())/60/60/24/1000)
    }
    this.setData({
      time: timeNew,
    })
  },
  /*选择酒店*/
  goHotelsList(){
    let pages = getCurrentPages();
    if(pages.length == 1){
      wx.navigateTo({
        url: "/pages/customized/hotelsList/hotelsList"
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /*选择日历*/ 
  goCalendar(){
    wx.navigateTo({
      url: "/pages/customized/calendar/calendar"
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
      wx.showToast({title: "房间已经满房" ,image:'/static/images/icon_error.png'})
    }
  },
  //pop显示
  infoShow(e){
    //获取房间信息
    let param = {
      hotelId:this.data.hotel.id,
      rmtype:e.currentTarget.dataset.rmtype,
    }
    util.request(api.CustomizedHotelsRoom , param , 'GET').then(res => {
      let roomNew = res.result;
      this.setData({
        room:roomNew
      })
    }).catch((err) => {});
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
          timingFunction:"linear",  
      })
      animation.translate(0, -height).step();  
      that.setData({
        animationData:animation.export()   
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
  //个人中心
  goUser(){
    wx.switchTab({ 
      url:"/pages/ucenter/index/index"
    })
  },
  //订单列表
  goOrder(){
    wx.switchTab({ 
      url:"/pages/ucenter/order/orderList/orderList"
    })
  },
  //首页
  goIndex(){
    wx.switchTab({ 
      url:"/pages/index/index"
    })
  },
  //去商城
  goMarket(){
    wx.redirectTo({ 
      url:"/pages/market/marketList/marketList"
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