let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
Page({
  data: {
    orderId: "",
    imgUrl: "",
    datas: []
  },
  onLoad: function (options) {
    this.orders(options)
  },
  onShow: function () {
    this.order()
  },
  orders(data) {
    this.setData({
      orderId: data.orderId,
      imgUrl: data.imgUrl
    })
  },
  order() {
    let param = {
      orderId: this.data.orderId
    }
    util.request(api.Giftorder, param, 'GET').then(res => {
      this.setData({
        datas: res.result.records
      })
    }).catch((err) => {});
  },
  refund() {
    let that = this
    wx.showModal({
      title: '确认退款',
      content: '发起退款后,礼品卡将被冻结无法使用',
      showCancel: true,
      confirmColor: "#db0426",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          let param = {
            orderId: that.data.datas[0].id,
            money: that.data.datas[0].money,
          }
          util.request(api.Refund, param, 'POST').then(res => {
            wx.showToast({
              title: '退款成功',
              icon: 'success',
              duration: 2000
            })
          }).catch(res => {
            wx.showToast({
              title: '退款失败',
              icon: 'none',
              duration: 2000
            })
          })
        } else if (res.cancel) {}
      }
    })
  },
})