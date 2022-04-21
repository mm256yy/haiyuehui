let util = require('../../../utils/util.js');
let pay = require('../../../utils/pay.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    detail:{
      code:'123456',
      img:'',
      orderId:'',
      goodsId:'',
      salePrice:'12000',
      spec:'2312',
      title:'收拾收拾收拾收拾收拾收拾收拾拾收拾收拾收拾收拾收拾收拾收拾收拾收拾收拾收拾收收拾收拾收拾收拾收拾收拾收拾收拾收拾',
      updateTime:'',
      orderStatus:0,
      used:1,
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  goMarketDetailed(){
    let id = this.data.detail.goodsId
    wx.navigateTo({ 
      url: "/pages/market/marketDetailed/marketDetailed?id="+id
    });
  },
})