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
    orderGiftList: [],
    showUnder: null,
    timer: "",
    pageNo: 1,
    num: null,
  },
  onLoad: function (options) {
    this.tags(options)
  },
  onShow: function () {
    this.giftList()
    this.orderList(1)
  },
  // 上拉加载
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.orderList(2)
  },
  tags(data) {
    if (data.id == 2) {
      this.setData({
        menu: 2,
        show: false
      })
    }
  },
  toDetail(e) {
    let orderId = e.currentTarget.dataset.orderid
    let imgUrl = e.currentTarget.dataset.imgurl
    wx.navigateTo({
      url: '/pages/ucenter/gift/orderDetail/orderDetail?orderId=' + orderId + '&imgUrl=' + imgUrl,
    })
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
    }
  },
  giftList() {
    util.request(api.GiftList, 'GET').then(res => {
      this.setData({
        giftList: res.result
      })
    }).catch((err) => {});
  },
  orderList(pull) { //pull 1为初始化 2为下拉
    let param = {
      pageNo: this.data.pageNo,
      pageSize: 15
    }
    util.request(api.GiftMemberList, param, 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let orderGiftList = []
      let data = res.result.records
      if(data.length != 0){
        for(let i=0;i<data.length;i++){
          o_li = data[i]
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        orderGiftList = o_ul
      }else{
        orderGiftList = this.data.orderGiftList.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        orderGiftList: orderGiftList,
      })
    }).catch((err) => {
      this.setData({
        orderGiftList:[]
      })
    });
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
    wx.navigateTo({
      url: '/pages/ucenter/gift/giftresult/giftresult?orderId=' + orderId,
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
    util.request(api.GiftMemberList, param, 'GET').then(res => {
      if (param.pageNo == 1) {
        this.setData({
          orderGiftList: res.result.records,
          num: res.result.total
        })
      } else if (param.pageNo > 1) {
        this.setData({
          orderGiftList: this.data.orderGiftList.concat(res.result.records)
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