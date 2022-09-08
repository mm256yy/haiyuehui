let util = require('../../../../utils/util.js');
let pay = require('../../../../utils/pay.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numList: [{
        num: 100,
        id: 0
      },
      {
        num: 200,
        id: 1
      },
      {
        num: 300,
        id: 2
      },
      {
        num: 520,
        id: 3
      },
      {
        num: 666,
        id: 4
      },
      {
        num: 888,
        id: 5
      },
      {
        num: 1000,
        id: 6
      }
    ],
    first_id: 0,
    imgUrl: "",
    id: null,
    money: 100,
    checked: false,
    orderId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.detail(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.checked) {
      console.log(1)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  detail(data) {
    let detailList = {
      id: data.id,
      imgUrl: data.imgurl
    }
    this.setData({
      imgUrl: detailList.imgUrl,
      id: detailList.id
    })
  },
  chooseMoney(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      first_id: id
    })
    switch (id) {
      case 0:
        this.setData({
          money: 100
        });
        break;
      case 1:
        this.setData({
          money: 200
        });
        break;
      case 2:
        this.setData({
          money: 300
        });
        break;
      case 3:
        this.setData({
          money: 520
        });
        break;
      case 4:
        this.setData({
          money: 666
        });
        break;
      case 5:
        this.setData({
          money: 888
        });
        break;
      case 6:
        this.setData({
          money: 1000
        });
        break;
    }
  },
  giftPay() {
    let param = {
      presentId: this.data.id,
      money: this.data.money
      // money: 1
    }
    util.request(api.GiftSubmit, param, 'POST').then(res => {
      console.log("欲支付成功")
      var params = {
        orderId: res.result.id,
        orderMark: "礼品卡",
      }
      this.setData({
        orderId: res.result.id
      })
      console.log(this.data.orderId);
      pay.giftPay(params).then(res => {
        //跳转
        wx.setStorageSync('locks', true)
        wx.redirectTo({
          url: "/pages/customized/payResult/payResult?result=1&end=3" + '&orderId=' + this.data.orderId
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
  onHide: function () {

  },
  checkedTap: function () {
    var checked = this.data.checked;
    this.setData({
      checked: !checked
    })
  },
  giftCard(){
    wx.navigateTo({
      url: '/pages/ucenter/giftCard/giftCard'
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})