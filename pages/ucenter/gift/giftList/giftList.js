let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
Page({
  data: {
    menu:1,
    giftList: [],
    titleList: [{
      name: "购买礼品卡",
      id: 1
    }, {
      name: "我的礼品卡",
      id: 2
    }],
    show: true,
    MemberGiftList: [],
    showUnder: null,
    timer: "",
    pageNo: 1,
    num: null,
  },
  onLoad: function (options) {
    this.tags(options)
  },
  onShow: function () {
    this.list()
    this.menberList()
  },
  tags(data) {
    if (data.id == 2) {
      this.setData({
        show: false
      })
    }
  },
  toDetail(e) {
    let locks = wx.getStorageSync('locks')
    if (locks) {
      let orderId = e.currentTarget.dataset.orderid
      let imgUrl = e.currentTarget.dataset.imgurl
      wx.navigateTo({
        url: '/pages/ucenter/gift/orderDetail/orderDetail?orderId=' + orderId + '&imgUrl=' + imgUrl,
      })
    }
  },
  tab(e) {
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      this.setData({
        show: true,
        menu: 1,
      })
    } else if (id == 2) {
      this.setData({
        show: false,
        menu: 2,
      })
      if (this.data.MemberGiftList.length) {
        this.setData({
          showUnder: false
        })
      } else {
        this.setData({
          showUnder: true
        })
      }
    }
  },
  back() {
    this.setData({
      show: true
    })
  },
  list() {
    util.request(api.GiftList, 'GET').then(res => {
      this.setData({
        giftList: res.result
      })
    }).catch((err) => {});
  },
  menberList() {
    let param = {
      pageNo: this.data.pageNo,
      pageSize: 10
    }
    util.request(api.MemberGiftList, param, 'GET').then(res => {
      console.log(res)
      if (param.pageNo == 1) {
        this.setData({
          MemberGiftList: res.result.records,
          num: res.result.total
        })
      } else if (param.pageNo > 1) {
        this.setData({
          MemberGiftList: this.data.MemberGiftList.concat(res.result.records)
        })
      }
    }).catch((err) => {});
  },
  toPay(e) {
    let id = e.currentTarget.dataset.id
    let imgUrl = e.currentTarget.dataset.imgurl
    wx.navigateTo({
      url: '/pages/ucenter/gift/paygift/paygift?id=' + id + '&imgurl=' + imgUrl,
    })
  },
  give(e) {
    let orderId = e.currentTarget.dataset.orderid
    let imgUrl = e.currentTarget.dataset.imgurl
    let mobile = e.currentTarget.dataset.mobile
    let money = e.currentTarget.dataset.money
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/ucenter/gift/giftresult/giftresult?orderId=' + orderId + '&imgurl=' + imgUrl + '&mobile=' + mobile + '&money=' + money,
    })
  },
  giftCard() {
    wx.navigateTo({
      url: '/pages/ucenter/giftCard/giftCard'
    })
  },
  ceshi() {
    wx.navigateTo({
      url: '/pages/ucenter/gift/giftothersresult/giftothersresult'
    })
  },
  onPullDownRefresh: function () {
    wx.setNavigationBarTitle({
      title: '玩命加载中...'
    });
    wx.showNavigationBarLoading()
    let param = {
      pageNo: this.data.pageNo,
      pageSize: 10
    }
    util.request(api.MemberGiftList, param, 'GET').then(res => {
      if (param.pageNo == 1) {
        this.setData({
          MemberGiftList: res.result.records,
          num: res.result.total
        })
      } else if (param.pageNo > 1) {
        this.setData({
          MemberGiftList: this.data.MemberGiftList.concat(res.result.records)
        })
      }
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '我的礼品卡'
      });
      wx.stopPullDownRefresh()
    }).catch((err) => {});
  },
})