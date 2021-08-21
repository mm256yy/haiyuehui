Page({
  data: {
    btnVal:0
  },
  onLoad: function (options) {
    this.ctx = wx.createCameraContext()
  },
  onShow: function () {

  },
  startRecord() {
    this.setData({
      btnVal:1
    })
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
        setTimeout(()=>{
          that.stopRecord();
        },2000)
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath,
          btnText:0
        })
      }
    })
  },
})