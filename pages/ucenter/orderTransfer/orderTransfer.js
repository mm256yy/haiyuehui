// pages/ucenter/orderTransfer/orderTransfer.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../utils/pay.js');
var app = getApp();
Page({
  data: {
    processNum:1,
    info:{
      orderId:0,
      code:0,
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
    }
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  //下一步
  define(){
    if(this.data.processNum == 4){
      if(!util.checkName(this.data.info[0].name)){return false}
      if(!util.checkIdentity(this.data.info[0].identity)){return false}
      //if(!util.checkMobile(this.data.info[0].mobile)){return false}
    }else{
      this.setData({
        processNum:this.data.processNum + 1 
      })
    }
    
  },
  //上一步
  back(){
    this.setData({
      chooseNum:this.data.chooseNum - 1 
    })
  },
  //input
  bindOrderInput(e){
    this.setData({
      'info.orderId': e.detail.value
    });
  },
  bindCodeInput(e){
    this.setData({
      'info.code': e.detail.value
    });
  },
  //查询订单
  queryOrder(){
    let that = this
    let orderId = this.data.info.orderId
    let code = this.data.info.code
    if(orderId.length == 0){
      wx.showModal({
        title: '错误信息',
        content: '订单编号不能为空',
        showCancel: false
      });
      return false;
    }else if(orderId.length != 14){
      wx.showModal({
        title: '错误信息',
        content: '订单编号格式不正确',
        showCancel: false
      });
      return false;
    }
    if(code.length == 0){
      wx.showModal({
        title: '错误信息',
        content: '手机尾号不能为空',
        showCancel: false
      });
      return false;
    }else if(code.length != 4){
      wx.showModal({
        title: '错误信息',
        content: '手机尾号输入不正确',
        showCancel: false
      });
      return false;
    }

    let param = {
      orderId:this.data.info.orderId,
      code:this.data.info.code
    }
    console.log(param)
    util.request(api.UcenterConnectOrder , param , 'GET').then(res => {
      console.log(res)
      if (res.status.code === 0) {
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
        }
        app.globalData.badge = {menu:[1,0,0,0]}
        wx.showModal({ title: '成功',content: '查询成功',showCancel: false , success (res) {
          that.setData({
            processNum:that.data.processNum + 1 ,
            detail:detailNew
          })
        }});
      }else if(res.status.code === 400){
        wx.showModal({ title: '错误信息' , content: '未登陆',showCancel: false , success (res) {
          wx.navigateTo({
            url: "../../auth/login/login"
          })
        }})
      }else{ //500
        wx.showModal({ title: '错误信息',content: res.status.message,showCancel: false });
      }
    }).catch((err) => {
      console.log(err)
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
        url: "../../customized/payResult/payResult?result="+'1'
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result="+'0'
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
  
})