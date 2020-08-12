let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
Page({
  data: {
    codeImg:'',
    closeShareshow:true,
  },
  onLoad: function (options) {
    this.init(options)
  },
  onShow: function () {
    
  },
  init(options){
    let that = this
    util.request(api.MemberInviteCode , 'GET').then(res => {
      that.setData({
        codeImg:res.result
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  closeShare(){
    this.setData({
      closeShareshow:false,
    })
  },
  //点击转发按钮
  onShareAppMessage: function (ops) {
    let inviteCode = wx.getStorageSync('userInfoInviteCode');
    console.log(inviteCode)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: '邀请你来入住酒店啦',
      imageUrl:'/static/images/invite.jpg',//图片地址
      path:'/pages/index/index?inviteCode='+inviteCode,// 用户点击首先进入的当前页面
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
  },
})