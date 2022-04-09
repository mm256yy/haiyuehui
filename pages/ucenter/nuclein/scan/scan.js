let check = require('../../../../utils/check.js');
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  scan(){
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        console.log(res)
        // let orderId = res.orderId
        // wx.navigateTo({ 
        //   url: "/pages/ucenter/nuclein/health/health?orderId=" + orderId
        // });
      },
      fail (res) {
        console.log(res)
      },
      complete (res) {
        console.log(res)
      },
    })
  }
})