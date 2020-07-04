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
    this.init(1,0)
  },
  onShow: function () {
    
  },
  //上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.pageNo,1)
  },
  init(pageNo,add){
    let param = {
      pageNo:pageNo,
      pageSize:15,
    }
    console.log(param)
    util.request(api.MemberInviteList , param , 'GET').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        let inviteListUl = [];
        let inviteListLi = {};
        let inviteListNew = [];
        for(let i=0;i<res.result.records.length;i++){
          inviteListLi = {
            'name':res.result.records[i].nickname,
            'time':res.result.records[i].addTime
          }
          inviteListUl.push(inviteListLi)
        }

        if(add == 0){ //初始化
          inviteListNew = inviteListUl
        }else{
          if(res.result.records.length == 0){
            inviteListNew = this.data.inviteList.concat(inviteListUl);
            this.setData({
              pageNo:this.data.pageNo - 1
            })
          }else{
            inviteListNew = this.data.inviteList.concat(inviteListUl)
          }
        }
        this.setData({
          inviteList:inviteListUl
        })
      }else{ //500
        wx.showModal({ title: '错误信息',content: res.status.message,showCancel: false });
      }
    }).catch((err) => {
      console.log(err);
      this.setData({
        pageNo:this.data.pageNo - 1,
      })
    });
  },
  onShareAppMessage: function (ops) {
    let inviteCode = wx.getStorageSync('userInfoInviteCode');
    console.log(inviteCode)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '邀请你来入住酒店啦',
      imageUrl:'/static/images/invite.jpg',//图片地址
      path:'/pages/index/index?inviteCode='+inviteCode,// 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }

  },
  onAppCode(){
    let inviteCode = wx.getStorageSync('userInfoInviteCode');
    wx.navigateTo({
      url: "/pages/ucenter/invite/inviteCode/inviteCode?inviteCode="+inviteCode
    })
  },
  blackShow(){
    this.setData({
      inviteBlackShow:!this.data.inviteBlackShow
    })
  }
})