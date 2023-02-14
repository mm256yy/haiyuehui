let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
Page({
  data: {
    menuVal: 1,
    orderId: "",
    imgUrl: null,
    money: "",
    mobile: "",
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
    })
    this.orderDetail()
  },
  onShow: function () {
  },
  orderDetail(){
    const that = this
    this.funDetail().then((data)=>{
      that.setData({
        imgUrl: data.presentImg,
        money: data.money,
        mobile: data.mobile,
      })
    })
  },
  funDetail() {
    let param = {
      orderId: this.data.orderId
    }
    return new Promise(function(resolve, reject) {
      util.request(api.GiftOrderDetail, param, 'GET').then(res => {
        let data = res.result
        if(data){
          resolve(data);
        }else{
          wx.showModal({
            title: '提示',
            content: '该礼品卡已送出',
            complete (res) {
              wx.navigateBack({ 
                delta: 1  
              }); 
            }
          })
        }
      }).catch((err) => {});
    });
  },
  //选择菜单
  chooseMenu(e){
    let val = e.currentTarget.dataset.val
    this.setData({
      menuVal: val
    })
  },
  //自己使用礼品卡
  giftUse(e) {
    let that = this
    let parma = {
      mobile: this.data.mobile,
      orderId: this.data.orderId
    }
    this.funDetail().then((data)=>{
      util.request(api.GiftUsePresent,parma, 'GET').then(res => {
        wx.redirectTo({
          url: '/pages/ucenter/gift/successfulGift/successfulGift?money=' + that.data.money + '&imgurl=' + that.data.imgUrl,
        })
      }).catch((err) => {});
    })
  },
  onShareAppMessage: function (e) {
    let that = this
    let param = {
      orderId: that.data.orderId,
    }
    this.funDetail().then((data)=>{
      util.request(api.GiftPresentSend, param , 'GET').then(res => {
        wx.navigateBack({ 
          delta: 1 
        }); 
      }).catch((err) => {
        wx.navigateBack({ 
          delta: 1 
        }); 
      });
    })
    let mobile = wx.getStorageSync('userInfoMobile')
    let orderId = that.data.orderId
    let imgUrl = that.data.imgUrl
    let money = that.data.money
    return {
      title: '您的好友送你一张礼品卡,请注意查收!',
      path: '/pages/ucenter/gift/giftothersresult/giftothersresult?mobile=' + mobile + '&orderId=' + orderId + '&imgUrl=' + imgUrl + '&money=' + money,
      desc: '领取即可使用',
      imageUrl: imgUrl,
    }
  }
})