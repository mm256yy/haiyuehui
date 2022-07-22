let util = require('../../../../utils/util.js');
let pay = require('../../../../utils/pay.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     imgUrl:"",
     money:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.detail(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  detail(data){
    let detail={
      imgUrl:data.imgurl,
      money:data.money,
    }
    this.setData({
      imgUrl:detail.imgUrl,
      money:detail.money
    })
  },
  back(){
    wx.redirectTo({
      url: "/pages/ucenter/gift/giftList/giftList?id=2"
    });
  },
  // orderDetail(){
  //   util.request(api.Giftorder,param,"GET").then(res=>{
        
  //   })
  // },
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