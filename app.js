let user = require('./utils/user');
//app.js
App({
  onLaunch: function () { 
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
    // 判断登录
    user.checkLogin().then(res => {
      // console.log('已经登陆')
      //console.log(res)
      /*wx.switchTab({ 
        url:"/pages/index/index"
      })*/
    }).catch((res) =>{
      console.log(res+'需要登陆');
      this.globalData.userInfo = '';
      wx.setStorageSync('userInfo', '');
      // wx.navigateTo({ 
      //   url: "/pages/auth/login/login"
      // });
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;
    //           wx.setStorageSync('userInfo', res.userInfo);
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onShow: function() {
    // user.checkLogin().then(res => {
    //   this.globalData.hasLogin = true;
    // }).catch(() => {
    //   this.globalData.hasLogin = false;
    // });
  },
  globalData: {},  //切勿删除
})
/*
  {
    "pagePath": "pages/activity/actList/index",
    "iconPath": "static/images/tab/activity2.png",
    "selectedIconPath": "static/images/tab/activity1.png",
    "text": "活动"
  },
*/ 