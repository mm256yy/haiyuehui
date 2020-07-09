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
      console.log(res.result.orderId)
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
        roomPriceS:(res.result.roomPrice/100).toFixed(2),
        totleRoomPrice:res.result.roomPrice*res.result.days,
        totleRoomPriceS:(res.result.roomPrice*res.result.days/100).toFixed(2),
        deposit:res.result.deposit,
        depositS:(res.result.deposit/100).toFixed(2),
        money:res.result.money,
        moneyS:(res.result.money/100).toFixed(2),
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
        roomPriceS:(res.result.roomPrice/100).toFixed(2),
        totleRoomPrice:res.result.roomPrice*res.result.days,
        totleRoomPriceS:(res.result.roomPrice*res.result.days/100).toFixed(2),
        deposit:res.result.deposit,
        depositS:(res.result.deposit/100).toFixed(2),
        money:res.result.money,
        moneyS:(res.result.money/100).toFixed(2),
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
  //查看订单列表
  goPay(){
    let param = {
      orderId:this.data.detail.orderId,
      rmdesc:this.data.detail.rmdesc,
    }
    console.log(param)
    pay.usePay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result="+'1'
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result="+'0'
      })
    });
  },
  //点击办理入住
  goOrderChoose(){
    let that = this;
    /*申请调用*/
    wx.requestSubscribeMessage({
      tmplIds: ['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'],
      success (res) {
        if(JSON.stringify(res).split('"')[3] == "accept"){
          wx.navigateTo({
            url: "../orderChoose/orderChoose?arr="+that.data.detail.startTimeS+"&dep="+that.data.detail.endTimeS+"&hotelId="+that.data.detail.hotelId+"&rmtype="+that.data.detail.rmtype+"&orderId="+that.data.detail.orderId
          })
        }else if(JSON.stringify(res).split('"')[3] == "reject"){
          wx.showModal({title: '错误信息',content: "请确认退房通知提醒",showCancel: false});
        }else{
          console.log(res)
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