let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    invoice:{
      money:35623,
      orderNum:'213123123123123123123',
      company:'海外海集团海外海集团海外集团',
      taxNum:'321312312312',
      email:'594412874@qq.com',
      mobile:'15967125243'
    },
    popShow:false,
  },
  onShow: function () {

  },
  invoice(){
    console.log(234)
    this.setData({
      popShow:true
    })
  },
  invoiceNo(){
    check.showErrorToast('请选择抬头')
  },
  //选择返回修改
  popReturn(){
    this.setData({
      popShow:false
    })
  },
  //选择确认开票
  popConfirm(){
    this.popReturn();
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/applyResult/applyResult"
    });
  },
  //选择抬头
  goInvoiceTitle(){
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/invoiceTitle/invoiceTitle"
    });
  }
})