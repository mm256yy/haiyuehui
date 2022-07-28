let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
let user = require('../../../../utils/user.js');
Page({
  data: {
    list: [{
      name: "送他人",
      id: 1
    }, {
      name: "自己用",
      id: 2
    }],
    show: true,
    title: "立即送出",
    give: "",
    send: "share",
    orderId: "",
    imgUrl: null,
    money: "",
    mobile: "",
    orderIds: "",
    datas: [],
    param: {}
  },
  onLoad: function (options) {
    this.detail(options)
    this.agiandetail(options)
  },
  onShow: function () {
    this.agiandetails()
  },
  agiandetail(data) {
    this.setData({
      orderIds: data.orderIds
    })
  },
  agiandetails() {
    let param = {
      orderId: this.data.orderIds
    }
    util.request(api.MemberGiftList, param, 'GET').then(res => {
      this.setData({
        datas: res.result.records
      })
      console.log(this.data.datas)
    }).catch((err) => {});
  },

  detail(data) {
    let detailList = {
      orderId: data.orderId,
      imgUrl: data.imgurl,
      money: data.money,
      mobile: data.mobile
    }
    this.setData({
      imgUrl: detailList.imgUrl,
      orderId: detailList.orderId,
      money: detailList.money,
      mobile: detailList.mobile
    })
  },
  tab(e) {
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      this.setData({
        show: true,
        title: "立即送出",
        send: "share",
        give: ""
      })
    } else if (id == 2) {
      this.setData({
        show: false,
        title: "确定",
        send: "",
        give: "giftPay"
      })
    }
  },
  giftPay(e) {
    console.log(this.data.orderIds)
    if (this.data.orderIds) {
      let parma = {
        mobile: this.data.datas[0].mobile,
        orderId: this.data.datas[0].orderId
      }
      this.setData({
        param: parma
      })
    } else {
      let lock = wx.getStorageSync('lock')
      if (lock) {
        let mobile = wx.getStorageSync('userInfoMobile')
        let orderId = wx.getStorageSync('orderIds')
        let parma = {
          mobile: mobile,
          orderId: orderId
        }
        this.setData({
          param: parma
        })
      } else {
        let parma = {
          mobile: this.data.mobile,
          orderId: this.data.orderId
        }
        this.setData({
          param: parma
        })
      }
    }
    util.request(api.UsePresent, this.data.param, 'GET').then(res => {
      wx.removeStorage('lock')
      let imgUrl = e.currentTarget.dataset.imgurl
      let money = e.currentTarget.dataset.money
      if (this.data.orderIds) {
        wx.redirectTo({
          url: '/pages/ucenter/gift/successfulGift/successfulGift?money=' + this.data.datas[0].money + '&imgurl=' + this.data.datas[0].imgUrl,
        })
      } else {
        wx.redirectTo({
          url: '/pages/ucenter/gift/successfulGift/successfulGift?money=' + money + '&imgurl=' + imgUrl,
        })
      }
    }).catch((err) => {});
  },
  onShareAppMessage: function (e) {
    // let mobile=  //暂无数据
    // let orderId= //暂无数据
    let mobile = wx.getStorageSync('userInfoMobile')
    if (this.data.orderIds) {
      return {
        title: '您的好友送你一张礼品卡,请注意查收!',
        path: '/pages/ucenter/gift/giftothersresult/giftothersresult?mobile=' + mobile + '&orderId=' + this.data.datas[0].orderId + '&imgUrl=' + this.data.datas[0].imgUrl + '&money=' + this.data.datas[0].money,
        desc: '领取即可使用',
        imageUrl: this.data.datas[0].imgUrl,
      }
    } else {
      return {
        title: '您的好友送你一张礼品卡,请注意查收!',
        path: '/pages/ucenter/gift/giftothersresult/giftothersresult?mobile=' + mobile + '&orderId=' + this.data.orderId + '&imgUrl=' + this.data.imgUrl + '&money=' + this.data.money,
        desc: '领取即可使用',
        imageUrl: this.data.imgUrl,
      }
    }
  }
})