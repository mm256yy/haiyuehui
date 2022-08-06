let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
Page({
  data: {
    mobile: "",
    imgUrl: "",
    money: "",
    orderId: "",
    flag: true,
    ////
    show: false,
    not_open: true,
    animationData: {},
    animationData1: {},
    animationData2: {},
  },
  onLoad: function (options) {
    this.accept(options)
  },
  accept(data) {
    this.setData({
      mobile: data.mobile,
      imgUrl: data.imgUrl,
      money: data.money,
      orderId: data.orderId,
    })
  },
  close() {
    this.setData({
      flag: false
    })
    wx.redirectTo({
      url:"/pages/ucenter/gift/giftList/giftList"
    });
  },
  //接受礼品卡
  open() {
    this.setData({
      not_open: false
    }, (() => {
      setTimeout(() => {
        this.setData({
          not_open: true,
        })
        let animation = wx.createAnimation({
          duration: 0,
          timingFunction: 'step-end'
        })
        let animation1 = wx.createAnimation({
          duration: 0,
          timingFunction: 'step-end'
        })
        animation.opacity(1).step();
        animation1.opacity(1).step();
        this.setData({
          show: false,
          animationData1: animation.export(),
          animationData2: animation1.export(),
        })
        let mobile = wx.getStorageSync('userInfoMobile')
        let param = {
          mobile: mobile,
          orderId: this.data.orderId,
          // mobile:17607048175,
          // orderId:'22040192000005'
        }
        util.request(api.GiftOrderReceive, param, "GET").then(res => {
          wx.redirectTo({
            url: '/pages/ucenter/gift/successfulGift/successfulGift?imgurl=' + this.data.imgUrl + '&money=' + this.data.money,
          })
          wx.setStorageSync('orderId', this.data.orderId)
        }).catch((err)=>{
          if(err == "不可给自己分享"){
            wx.redirectTo({
              url:"/pages/ucenter/gift/giftList/giftList?id=2"
            });
          }
        })
      }, 1000);
    }))
  },
})