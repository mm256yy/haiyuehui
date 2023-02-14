Page({
  data: {
    imgUrl: "",
    money: ""
  },
  onLoad: function (options) {
    this.detail(options)
  },
  detail(data) {
    this.setData({
      imgUrl: data.imgurl,
      money: data.money
    })
  },
  back(){
    wx.redirectTo({
      url: "/pages/ucenter/gift/giftList/giftList?id=2"
    });
  },
})