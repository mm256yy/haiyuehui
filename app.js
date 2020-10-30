let user = require('./utils/user');
let util = require('./utils/util');
//app.js
App({
  onLaunch: function () { 
    this.update();  //是否更新
    // this.userInfo();// 获取用户信息
  },
  onShow: function(data) {
    this.renderingTime();  //日历
    this.invite(data);  //邀请人
    user.goToLogin() // 判断登录
  },
  //判断是否有更新内容
  update(){
    //更新
    let updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  //邀请人
  invite(data){
    let option = data.query;
    let inviteCode = ""; 
    if(option.inviteCode){
      inviteCode = option.inviteCode;
    }else if(option.scene){
      let scene = decodeURIComponent(option.scene).toString().split('=');
      inviteCode = scene[1];
    }
    wx.setStorageSync('othersInviteCode', inviteCode);
  },
  //获取用户信息
  userInfo(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('userInfo', res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
            }
          })
        }
      }
    })
  },
  //进行日历处理
  renderingTime(){
    let calendar = wx.getStorageSync("calendar");  //获取数据
    let d_today = new Date();
    if(calendar && (calendar.startTime+1000*60*60*24)>=d_today.getTime()){  //判断是否有储存时间/储存时间大于当前时间 --有
      // console.log(calendar.startTime+1000*60*60*24)
      // console.log(d_today.getTime())
    }else{ //--没有
      let calendarSto = {};
      calendarSto = {
        startTime:new Date(new Date().toLocaleDateString()).getTime(),
        endTime:new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000,
      };
      wx.setStorageSync("calendar", calendarSto);
    }
  },
  //
  globalData: {},  //切勿删除
}) 