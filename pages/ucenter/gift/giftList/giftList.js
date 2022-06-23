let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
let user = require('../../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList:[],
    titleList:[{name:"购买礼品卡",id:1},{name:"我的礼品卡",id:2}],
    show:true,
    MemberGiftList:[],
    showUnder:null,
    timer:"",
    pageNo:1,
    num:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tags(options)
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
    this.list()
    this.menberList()
  },
  tags(data){
    console.log(data.id)
    if(data.id==2){
      this.setData({
        show:false
      })
    }
  },
  toDetail(e){
    let locks=wx.getStorageSync('locks')
   if(locks){
    let orderId=e.currentTarget.dataset.orderid
    let imgUrl=e.currentTarget.dataset.imgurl
    wx.navigateTo({
      url: '/pages/ucenter/orderDetail/orderDetail?orderId='+orderId+'&imgUrl='+imgUrl,
    })
   }
  },
  tab(e){
    let id = e.currentTarget.dataset.id
    if(id==1){
     this.setData({
       show:true
     })
    }else if(id==2){
    this.setData({
      show:false
    })
    if(this.data.MemberGiftList.length){
      this.setData({
        showUnder:false
      })
    }else{
      this.setData({
        showUnder:true
      })
    }
    }
  },
  back(){
   this.setData({
     show:true
   })
  },
  list(){
    util.request(api.GiftList , 'GET').then(res => {
      this.setData({
        giftList:res.result
      })
    }).catch((err) => {});
  },
  menberList(){

    let param={
      pageNo:this.data.pageNo,
      pageSize:10
    }
    util.request(api.MemberGiftList ,param,'GET').then(res => {
      console.log(res)
     if(param.pageNo==1){
      this.setData({
        MemberGiftList:res.result.records,
        num:res.result.total
      })
     }else if(param.pageNo>1){
      this.setData({
        MemberGiftList:this.data.MemberGiftList.concat(res.result.records)
      })
     }
    }).catch((err) => {});
  },
  toPay(e){
    let id=e.currentTarget.dataset.id
    let imgUrl=e.currentTarget.dataset.imgurl
    wx.navigateTo({
      url: '/pages/ucenter/paygift/paygift?id='+id+'&imgurl='+imgUrl,
    })
  },
  give(e){
    let orderId=e.currentTarget.dataset.orderid
    let imgUrl=e.currentTarget.dataset.imgurl
    let mobile=e.currentTarget.dataset.mobile
    let money=e.currentTarget.dataset.money
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/ucenter/giftresult/giftresult?orderId='+orderId+'&imgurl='+imgUrl+'&mobile='+mobile+'&money='+money,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  ceshi(){
    wx.navigateTo({
      url: '/pages/ucenter/giftothersresult/giftothersresult'
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
    wx.setNavigationBarTitle({ 
      title: '玩命加载中...'
     });
    wx.showNavigationBarLoading()
    let param={
      pageNo:this.data.pageNo,
      pageSize:10
    }
    util.request(api.MemberGiftList ,param,'GET').then(res => {
     if(param.pageNo==1){
      this.setData({
        MemberGiftList:res.result.records,
        num:res.result.total
      })
     }else if(param.pageNo>1){
      this.setData({
        MemberGiftList:this.data.MemberGiftList.concat(res.result.records)
      })
     }
     console.log(this.data.MemberGiftList)
           wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({ 
        title: '我的礼品卡'
       }); 
      wx.stopPullDownRefresh()
    }).catch((err) => {});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageNo ++
    if(this.data.MemberGiftList.length==this.data.num||this.data.MemberGiftList.length>this.data.num) return
    this.menberList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})