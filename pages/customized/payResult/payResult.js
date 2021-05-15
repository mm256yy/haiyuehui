let app = getApp();
Page({
  data: {
    second:5,
    result:1,   //0支付失败 1支付成功 2提现成功 3提现失败
    time:null
  },
  onLoad: function (options) {
    let that = this;
    let resultNew = options.result;
    that.setData({
      result : resultNew
    });
    let secondNew = 5;
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
      //跳转
      wx.switchTab({ 
        url:"/pages/ucenter/order/orderList/orderList"
      })
    }else if(val == 1){  //充值
      wx.navigateBack({
        delta: 2
      })
    }else if(val == 2){  //商城支付
      wx.reLaunch({ 
        url:"/pages/market/marketOrderList/marketOrderList"
      })
    }else if(val == 3){ //提现
      wx.navigateBack({
        delta: 2
      })
    }
  }

})