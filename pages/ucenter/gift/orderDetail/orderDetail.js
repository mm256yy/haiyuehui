let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
let user = require('../../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    imgUrl:"",
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.orders(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.order()
  },
  orders(data){
    this.setData({
      orderId:data.orderId,
      imgUrl:data.imgUrl
    })
  },
  order(){
    let param={
      orderId:this.data.orderId
    }
    util.request(api.Giftorder,param, 'GET').then(res => {
       this.setData({
         datas:res.result.records
       })
    }).catch((err) => {});
  },
  refund(){
    let that=this
    wx.showModal({
      title: '确认退款',
      content: '发起退款后,礼品卡将被冻结无法使用',
      showCancel:true,
      confirmColor:"#db0426",
      confirmText:"确定",
      success (res) {
        if (res.confirm) {
          let param={
            orderId:that.data.datas[0].id,
            money:that.data.datas[0].money,
          }
          util.request(api.Refund,param,'POST').then(res=>{
            
                wx.showToast({
                  title: '退款成功',
                  icon: 'success',
                  duration: 2000
                })
          }).catch(res=>{
            wx.showToast({
              title: '退款失败',
              icon:'none',
              duration: 2000
            })
          }
          )
        } else if (res.cancel) {
        }
      }
    })
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