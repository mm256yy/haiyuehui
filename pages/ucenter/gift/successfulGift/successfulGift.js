
Page({
  data: {
     imgUrl:"",
     money:""
  },
  onLoad: function (options) {
    this.detail(options)
  },
  detail(data){
    let detail={
      imgUrl:data.imgurl,
      money:data.money,
    }
    this.setData({
      imgUrl:detail.imgUrl,
      money:detail.money
    })
  },
  back(){
    wx.redirectTo({
      url: "/pages/ucenter/gift/giftList/giftList?id=2"
    });
  },
})