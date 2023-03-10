let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    inviteList:[
      // {name:'望月',time:"2020-07-02 7:38:23"},
      // {name:'望月',time:"2020-07-02 7:38:23"},
      // {name:'望月',time:"2020-07-02 7:38:23"},
    ],
    inviteBlackShow:false,
    pageNo:1,
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.setData({
      pageNo:1,
    })
    this.init(1)
  },
  //上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(2)
  },
  //初始化
  init(pull){  //1初始化 2下拉加载
    let param = {
      pageNo:this.data.pageNo,
      pageSize:15,
    }
    console.log(param)
    util.request(api.MemberInviteList , param , 'GET').then(res => {
      let inviteListUl = [];
      let inviteListLi = {};
      let inviteListNew = [];
      if(res.result.records.length != 0){
        for(let i=0;i<res.result.records.length;i++){
          inviteListLi = {
            'name':res.result.records[i].nickname,
            'time':res.result.records[i].addTime
          }
          inviteListUl.push(inviteListLi)
        }
        
      }
      if(pull == 0){ //初始化
        inviteListNew = inviteListUl
      }else{
        inviteListNew = this.data.inviteList.concat(inviteListUl);
        if(res.result.records.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1,
          })
        }
      }
      this.setData({
        inviteList:inviteListNew
      })
    }).catch((err) => {
      this.setData({
        pageNo:this.data.pageNo - 1,
      })
    });
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
  //打开二维码的页面
  onAppCode(){
    let inviteCode = wx.getStorageSync('userInfoInviteCode');
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteCode/inviteCode?inviteCode="+inviteCode
    })
  },
  //黑幕
  blackShow(){
    this.setData({
      inviteBlackShow:!this.data.inviteBlackShow
    })
  }
})