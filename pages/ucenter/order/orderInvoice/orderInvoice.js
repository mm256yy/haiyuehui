let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    orderId:'',
    status:1,
    invoiceUrl:'',
    detail:{
      hotelName:'',
      rmdesc: '',
      mobile: '',
      money:0
    }
  },
  onLoad(options) {
    this.setData({
      orderId: 3//options.orderId
    })
  },
  onShow() {
    this.invoice();
    this.init()
  },
  invoice(){
    let param = {
      orderId: this.data.orderId
    }
    util.request(api.UcenterOrderInvoiceGetPdf , param, 'GET').then(res => {
      this.setData({
        status: 2,
        invoiceUrl: res.result
      })
    }).catch((err) => {});  
  },
  init(){
    let param = {
      orderId:this.data.orderId
    }
    util.request(api.UcenterOrderDetail ,param, 'GET').then(res => {
      let data = res.result;
      let detail = {
        hotelName: data.hotelName,
        rmdesc: data.rmdesc,
        mobile: data.mobile,
        money: data.money,
      }
      this.setData({
        detail: detail
      })
    }).catch((err) => {});  
  },
  goInvoiceOpening(){
    wx.navigateTo({
      url: "/pages/ucenter/invoice/applyInvoice/applyInvoice?orderId="
      +this.data.orderId+
      "&goodsName=住宿费&goodsUnit=晚&goodsAmount="
      +1+
      "&goodsPrice="
      +this.data.detail.money+
      "&totalPrice="
      +this.data.detail.money
    })
  },
  seeInvoice(){
    let fileName = new Date().valueOf();
    util.jhxLoadShow("发票下载")
    let invoiceUrl = this.data.invoiceUrl
    wx.downloadFile({
      url: invoiceUrl, //要预览的 PDF 的地址
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
  },
})