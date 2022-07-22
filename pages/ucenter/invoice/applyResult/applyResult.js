let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    result:{
      success:true,
      buyerName:'海外海集团',
      invoiceCode:'011000020026',
      invoiceNum:'00009516',
      reqSsn: '11111111111',
      date:'2010-01-01 16:60:05',
    }
  },
  onShow: function () {

  },
  onLoad(options) {
    this.init(options)
  },
  init(options){
    let result = {
      success:true,
      buyerName: options.buyerName,
      invoiceCode: options.invoiceCode,
      invoiceNum: options.invoiceNum,
      reqSsn:  options.reqSsn,
      date: util.formatTime(new Date()),
    }
    this.setData({
      result:result
    })
  },
  InvoicePdf(){
    let fileName = new Date().valueOf();
    util.jhxLoadShow("发票下载")
    let param = {
      invoiceCode: result.invoiceCode,
      invoiceNum: result.invoiceNum,
      reqSsn: result.reqSsn,
    }
    util.request(api.UcenterOrderInvoicePdf , param , 'GET').then(res => {
      wx.downloadFile({
        url: res.result, //要预览的 PDF 的地址
        filePath: wx.env.USER_DATA_PATH +'/海外海发票'+fileName+'.pdf',
        header: {
          'Content-Type': 'application/pdf'
        },
        success: function (res) {
          if (res.statusCode === 200) { //成功
            var Path = res.filePath //返回的文件临时地址，用于后面打开本地预览所用
            wx.openDocument({
              fileType: 'pdf', // 需要写上文件类型才能预览，不让回找系统应用打开，体验不好
              filePath: Path, //要打开的文件路径
              showMenu: true,
              success: function (res) {
                console.log('打开 PDF 成功');
              },
              fail: function (res) {
                check.showErrorToast('打开发票失败')
              },
              complete: function (res) {
                util.jhxLoadHide()
              },
            })
          }
        },
        fail: function (res) {
          util.jhxLoadHide();
          check.showErrorToast('下载发票失败')
        }
      })
    }).catch((err) => {});  
  },
  goBillList(){
    wx.navigateBack({ 
      delta: 2  
    }); 
  },
})