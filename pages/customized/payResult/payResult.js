let app = getApp();
Page({
  data: {
    second:3,
    result:1,   //0失败  1成功
    time:null
  },
  onLoad: function (options) {
    let that = this;
    let resultNew = options.result;
    that.setData({
      result : resultNew
    })
    let secondNew = 3;
    let times = setInterval(()=>{
      secondNew --
      that.setData({
        second : secondNew
      })
      if(secondNew<=0){
        clearInterval(times);
        this.end(options.end)
      }
    },1000)
  },
  end(val){
    if(val == 0){  //支付房间
      app.globalData.badge = {menu:[1,0,0,0]}
      //跳转
      wx.switchTab({ 
        url:"/pages/ucenter/index/index"
      })
    }else if(val == 1){  //充值
      wx.navigateBack({
        delta: 2
      })
    }
  }

})