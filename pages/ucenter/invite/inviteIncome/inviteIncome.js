let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    chooseDate:0,
  },
  onLoad: function (options) {
    let date = new Date();
    let val = date.getFullYear()+'-'+ util.formatNumber(date.getMonth() + 1)
    this.setData({
      chooseDate:val
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
})