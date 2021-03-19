Page({
  data: {
    show:null  //1 安卓机 2 苹果机
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    let that = this
    wx.getSystemInfo({
      success (res) {
        let showNew = null
        let str = res.model
        if(str.indexOf("iPhone") !== -1){
          showNew = 2
        }else{
          showNew = 1
        }
        that.setData({
          show:showNew,
        })
      }
    })
  },
})