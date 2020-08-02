// pages/ucenter/orderTransfer/orderTransfer.js
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let pay = require('../../../../utils/pay.js');
let app = getApp();
Page({
  data: {
    processNum:1,
    transferType:'', //1 ota 2 小程序
    processUl:[
      {img:'team7.png',text:'选择类型'},
      {img:'team6.png',text:'编号填写'},
      {img:'team4.png',text:'接入订单'},
    ],
    hotelsUl: [
      /*{hotelId:'02',name:'2F'}*/
    ],
    info:{
      hotelsId:'',
      orderNo:0,
      // code:0,
    },
    detail:{
      status:'',
      statusS:'',
      orderId:'',
      hotelId:'',
      hotelName:'',
      rmtype:'',
      rmdesc:'',
      startTime:'',
      startTimeS:'',
      endTime:'',
      endTimeS:'',
      isCis:false,
      name:'',
      roomPrice:0,
      totleRoomPrice:0,
      deposit:0,
      money:0,
      days:0,
      coupon:0,
      discount:100,
    }
  },
  onShow: function () {
    let hotelsUl = [];
    let hotelsLi = {};
    util.request(api.CustomizedHotelsList, 'GET').then(res => {
      //存储用户信息
      for(let i=0;i<res.result.length;i++){
        hotelsLi = {
          hotelId:res.result[i].id,
          name:res.result[i].name,
        }
        hotelsUl.push(hotelsLi)
      }
      this.setData({  
        hotelsUl: hotelsUl
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //选择类型
  transferType(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      transferType:type,
      processNum:this.data.processNum + 1 ,
    })
  },
  transferTypeNo(){
    util.showErrorToast("暂未开放")
  },
  //上一步
  goBack(){
    this.setData({
      processNum:1 ,
    })
  },
  //选择酒店
  bindChange(e){
    console.log(e)
    this.setData({
      'info.hotelsId': e.detail.value
    })
  },
  //input
  bindOrderInput(e){
    this.setData({
      'info.orderNo': e.detail.value
    });
  },
  //查询订单
  queryOrder(){
    if(this.data.info.orderNo.length == 0){
      wx.showModal({
        title: '错误信息',
        content: '订单编号不能为空',
        showCancel: false
      });
      return false;
    }
    if(this.data.transferType == 1){
      this.otaOrder();   
    }else if(this.data.transferType == 2){
      this.hwhOrder();
    }
  },
  //小程序内部订单转移
  hwhOrder(){
    let that = this;
    let param = {
      orderNo:this.data.info.orderNo,
    }
    console.log(param)
    util.request(api.UcenterConnectOrder , param , 'GET').then(res => {
      //获取到订单信息
      let orderPayInfo = {};
      let orderPayInfoNew = {
        discount:0,   
        balance:0,
      };
      if(res.result.orderPayInfo){
        orderPayInfo = res.result.orderPayInfo;
      }else{
        orderPayInfo = orderPayInfoNew;
      }
      let detailNew = {
        status:res.result.status,
        statusS:util.orderType(res.result.status),
        orderId:res.result.orderId,
        hotelId:res.result.hotelId,
        hotelName:res.result.hotelName,
        rmtype:res.result.rmtype,
        rmdesc:res.result.rmdesc,
        startTime:'',
        startTimeS:res.result.arr,
        endTime:'',
        endTimeS:res.result.dep,
        isCis:res.result.isCis,
        name:res.result.name,
        // dayNum:this.dayNum(res.result.arr,res.result.dep),
        roomPrice:res.result.roomPrice,
        totleRoomPrice:res.result.roomPrice*res.result.days,
        deposit:res.result.deposit,
        money:res.result.money,
        days:res.result.days,
        coupon:res.result.subtractMoney?res.result.subtractMoney:0,
        discount:orderPayInfo.discount,
      }
      app.globalData.badge = {menu:[1,0,0,0]}
      wx.showModal({ title: '成功',content: '查询成功',showCancel: false , success (res) {
        that.setData({
          processNum:that.data.processNum + 1 ,
          detail:detailNew
        });
        that.member();
      }});
    }).catch((err) => {
      console.log(err)
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //会员信息
  member(){
    let type = this.data.detail.status;
    console.log(type)
    if(type == 11||type == 12||type == 13||type == 21){
      //获取名字
      util.request(api.MemberGet, 'GET').then(res => {
        let couponNew = Math.round(this.data.detail.totleRoomPrice-((this.data.detail.money-this.data.detail.deposit)/(res.result.discount/100)))
        this.setData({
          'detail.coupon':couponNew,
          'detail.discount':(res.result.discount?res.result.discount:100),
        });
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
    }
  },
  //OTA订单转移
  otaOrder(){
    if(this.data.info.hotelsId == ''){
      wx.showModal({
        title: '错误信息',
        content: '请点击选择酒店',
        showCancel: false
      });
      return false;
    }
    let that = this;
    let param = {
      hotelId:this.data.hotelsUl[this.data.info.hotelsId].hotelId,
      otaId:this.data.info.orderNo,
    }
    console.log(param)
    util.request(api.UcenterOrderOta , param , 'GET').then(res => {
      //获取到订单信息
      console.log(res.result.days)
      let detailNew = {
        status:res.result.status,
        statusS:util.orderType(res.result.status),
        orderId:res.result.orderId,
        hotelId:res.result.hotelId,
        hotelName:res.result.hotelName,
        rmtype:res.result.rmtype,
        rmdesc:res.result.rmdesc,
        startTime:'',
        startTimeS:res.result.arr,
        endTime:'',
        endTimeS:res.result.dep,
        isCis:res.result.isCis,
        name:res.result.name,
        // dayNum:this.dayNum(res.result.arr,res.result.dep),
        roomPrice:res.result.roomPrice,
        totleRoomPrice:res.result.roomPrice*res.result.days,
        deposit:res.result.deposit,
        money:res.result.money,
        days:res.result.days,
      }
      app.globalData.badge = {menu:[1,0,0,0]}
      wx.showModal({ title: '成功',content: '查询成功',showCancel: false , success (res) {
        that.setData({
          processNum:that.data.processNum + 1 ,
          detail:detailNew
        })
      }});
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //支付
  goPay(){
    wx.redirectTo({
      url: "/pages/customized/pay/pay?money="+this.data.detail.money+"&orderId="+this.data.detail.orderId+"&rmdesc="+this.data.detail.rmdesc
    })
  },
  //点击办理入住
  goOrderChoose(){
    let that = this;
    /*申请调用*/
    wx.requestSubscribeMessage({
      tmplIds: ['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'],
      success (res) {
        if(res['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'] == "accept"){
          wx.redirectTo({
            url: "../orderChoose/orderChoose?arr="+that.data.detail.startTimeS+"&dep="+that.data.detail.endTimeS+"&hotelId="+that.data.detail.hotelId+"&rmtype="+that.data.detail.rmtype+"&orderId="+that.data.detail.orderId
          })
        }else if(res['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'] == "reject"){
          wx.showModal({title: '错误信息',content: "请确认退房通知提醒",showCancel: false});
        }else{
          wx.showModal({title: '错误信息',content: "请联系前台处理",showCancel: false});
        }
      }
    })
  },
  //返回个人中心
  goIndex(){
    //跳转
    wx.switchTab({ 
      url:"/pages/ucenter/index/index"
    })
  },
  // dayNum(startTime,endTime){
  //   let day = new Date((endTime).replace(/-/g,'/')) - new Date((startTime).replace(/-/g,'/'))
  //   let num = day/1000/60/60/24;
  //   return num
  // }
})