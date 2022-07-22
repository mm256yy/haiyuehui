let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    detail:{
      orderId:'',
      name:'',
      code:'',
      address:'',
      phone:'',
    },
    invoice:{
      type: 0,
      specialInvoice: '00',
      buyerName: 'xxxxxx有限公司',
      buyerPhone: '0105734567',
      buyerBankCard: '234567890',
      taxMethod: 0,
      invoiceGoods:[
        {
          goodsName: '住宿',
          goodsUnit: '晚',
          goodsAmount: 1,
          goodsPrice: 100,
          totalPrice: 100,
          taxSign: 0,
          taxRate: 0,
          taxMoney: 0,
          goodsCode: '3070402000000000000',
          customizeGoodCode:0,
          invoiceNature: 0,
        }
      ],
      income: '收款人',
      checker: '收款人1',
      drawer: '复核人1',
      remark: 'asd',
    },
    popShow:false,
    companyType:0,
  },
  onLoad(options) {
    this.init(options)
  },
  onShow: function () {

  },
  init(options){
    util.request(api.UcenterInvoiceTitleList , 'GET').then(res => {
      let data = res.result
      let detail = {}
      data.map((obj)=>{
        if(obj.isDefault == 0){
          detail = obj
        }
      })
      let invoiceGoods = {
        goodsName: '住宿',
        goodsUnit: options.goodsUnit,
        goodsAmount: options.goodsAmount,
        goodsPrice: options.goodsPrice,
        totalPrice: options.totalPrice,
        taxSign: 0,
        taxRate: 0,
        taxMoney: 0,
        goodsCode: '3070402000000000000',
        customizeGoodCode: 0,
        invoiceNature: 0,
      }
      this.setData({
        companyType: detail.type,
        'detail.orderId': options.orderId,
        'detail.name': detail.name,
        'detail.code': detail.code,
        'detail.address': detail.address,
        'detail.phone': detail.phone,
        'invoice.reqSsn': options.orderId,
        'invoice.invoiceGoods[0]':invoiceGoods,
        'invoice.remark': options.orderId,
      })
    }).catch((err) => {});
  },
  invoice(){
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
    console.log(this.data.invoice)
    let detail = this.data.detail
    let invoiceGoods = {
      ...this.data.invoice.invoiceGoods,
      customizeGoodCode: detail.code,
    }
    let param = {
      ...this.data.invoice,
      buyerName: detail.name,
      invoiceGoods: invoiceGoods,
      buyerPhone: detail.address + detail.phone,
    }
    console.log(param)
    let data = {
      invoiceCode:'111111',
      invoiceNum:'333333333',
      buyerName:'555555555555555',
    }
    // util.request(api.UcenterOrderInvoiceOpening , param , 'POST').then(res => {
    //   let data = res.result
    //   let detail = this.data.detail
    //   this.popReturn();
      wx.navigateTo({ 
        url: "/pages/ucenter/invoice/applyResult/applyResult?invoiceCode="
         + data.invoiceCode + 
         '&invoiceNum='
         + data.invoiceNum +
         '&reqSsn='
         + data.reqSsn +
         '&buyerName='
         + detail.buyerName
      });
    // }).catch((err) => {});
  },
  //选择抬头
  goInvoiceTitle(){
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/invoiceTitle/invoiceTitle?oftenType=1"
    });
  },
  //选择企业类型
  radioChange(e){
    let val = e.detail.value;
    if(val == 0){
      this.setData({
        'detail.code':'',
        'detail.phone':'',
        'detail.address':'',
      })
    }
    this.setData({
      companyType:val
    })
  },
  //input焦点
  bindNameInput(e) {
    this.setData({
      'detail.name': e.detail.value
    });
  },
  bindCodeInput(e) {
    this.setData({
      'detail.code': e.detail.value
    });
  },
  bindAddressInput(e) {
    this.setData({
      'detail.address': e.detail.value
    });
  },
  bindPhoneInput(e) {
    this.setData({
      'detail.phone': e.detail.value
    });
  },
})