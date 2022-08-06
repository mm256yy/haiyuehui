let util = require('../../../../utils/util.js');
let pay = require('../../../../utils/pay.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    numList:[
      {id:0, money:10000},
      {id:1, money:20000},
      {id:2, money:30000},
      {id:3, money:52000},
      {id:4, money:66600},
      {id:5, money:88800},
      {id:6, money:100000},
      // {id:7, money:1},
    ],  
    first_id: 0,
    imgUrl: "",
    id: null,
    money: 10000,
    checked: false,
  },
  onLoad: function (options) {
    this.detail(options)
  },
  onShow: function () {
  },
  detail(data) {
    this.setData({
      imgUrl: data.imgurl,
      id: data.id
    })
  },
  chooseMoney(e) {
    let id = e.currentTarget.dataset.id
    let money = e.currentTarget.dataset.money
    this.setData({
      first_id: id,
      money: money
    })
  },
  giftPay() {
    let param = {
      presentId: this.data.id,
      money: this.data.money
    }
    util.request(api.GiftSubmit, param, 'POST').then(res => {
      let params = {
        orderId: res.result.id,
        orderMark: "礼品卡",
      }
      pay.giftPay(params).then(res => {
        //跳转
        wx.redirectTo({
          url: "/pages/customized/payResult/payResult?result=1&end=3" + '&orderId=' + params.orderId
        });
      }).catch(() => {
        //跳转
        wx.redirectTo({
          url: "/pages/customized/payResult/payResult?result=0&end=4"
        });
      });
    }).catch((err) => {});
  },
  popConfirm() {
    wx.showModal({
      title: '提示',
      content: '请您阅读并同意《礼品卡购卡合同》与《礼品卡章程》',
      showCancel: false,
      confirmColor: "#db0426",
      confirmText: "确认",
    })
  },
  checkedTap: function () {
    let checked = this.data.checked;
    this.setData({
      checked: !checked
    })
  },
  giftCard() {
    wx.navigateTo({
      url: '/pages/ucenter/gift/giftCard/giftCard'
    })
  },
})