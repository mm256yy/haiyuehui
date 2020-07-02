// pages/ucenter/coupon/coupon.js
Page({
  data: {
    typeMenu:0,
    detailedShow:0,
    couponUl:[
      // {
      //   id:0,
      //   type:0,
      //   name:'酒店价格减免',
      //   startTimeS:'2020-05-04',
      //   endTimeS:'2020-06-04',
      //   price:6000,
      //   priceS:60,
      //   rule:'1.优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则优惠劵规则'
      // }
    ],
    
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  detailedShow(e){
    if(e.currentTarget.dataset.detailedId == this.data.detailedShow){
      this.setData({
        detailedShow:0
      })
    }else{
      this.setData({
        detailedShow:e.currentTarget.dataset.detailedId
      })
    }
    
  },
  typeBind(e){
    this.setData({
      typeMenu:e.currentTarget.dataset.type
    })
  }
})