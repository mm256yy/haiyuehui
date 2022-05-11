// pages/ucenter/giftothersresult/giftothersresult.js
let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
        mobiles:"",
        imgUrls:"",
        moneys:"",
        orderIds:"",
        flag:true,
////
show: false,
not_open: true,
animationData: {},
animationData1: {},
animationData2: {},


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.accept(options)
  },
  accept(data){
    this.setData({
        mobiles:data.mobile,
        imgUrls:data.imgUrl,
        moneys:data.money,
        orderIds:data.orderId,
    })
  },
  close(){
   this.setData({
     flag:false
   })
  },
  pull(){
    // let mobile=wx.getStorageSync('userInfoMobile')
    // let param={
    //   mobile:mobile,
    //   orderId:this.data.orderIds,
    // }
    // util.request(api.OthersPresent,param,"GET").then(res=>{
    //    console.log("领取成功")
    // })
    
  },
  use(){
    let mobile=wx.getStorageSync('userInfoMobile')
    let param={
      mobile:mobile,
      orderId:this.data.orderIds,
    }
    util.request(api.UsePresent,param,"GET").then(res=>{
       console.log("领取成功")
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  closeModal() {
    this.slideIn(1);
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 200);
  },
  show() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    setTimeout(() => {
      this.setData({
        show: true
      }, (() => {
        this.slideIn(0)
      }))
      wx.hideLoading();
    }, 500);
  },
  open() {
    this.setData({
      not_open: false
    }, (() => {
      setTimeout(() => {
        this.setData({
          not_open: true,
        })
        // this.fadeOut(() => {
          let animation = wx.createAnimation({
            duration: 0,
            timingFunction: 'step-end'
          })
          let animation1 = wx.createAnimation({
            duration: 0,
            timingFunction: 'step-end'
          })
          animation.opacity(1).step();
          animation1.opacity(1).step();
          this.setData({
            show: false,
            animationData1: animation.export(),
            animationData2: animation1.export(),
          })
           let mobile=wx.getStorageSync('userInfoMobile')
    let param={
      mobile:mobile,
      orderId:this.data.orderIds,
      // mobile:17607048175,
      // orderId:'22040192000005'
    }
    util.request(api.OthersPresent,param,"GET").then(res=>{
      wx.removeStorageSync('locks')
      wx.navigateTo({
        url: '/pages/ucenter/successfulGift/successfulGift?imgurl='+this.data.imgUrls+'&money='+this.data.moneys,        
      })
      wx.setStorageSync('orderIds',this.data.orderIds)
      wx.setStorageSync('lock',1)
    })
        // })
      }, 1000);
    }))
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})