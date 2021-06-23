let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
Page({
  data: {
    detailed: {
      img: '',
      code: '',
      name: '',
      price: '',
    },
    canvasShow: true,
    saveImagePath: '',
  },
  onLoad: function (options) {
    console.log(options)
    this.init(options);
  },
  onShow: function () {

  },
  init(options) {
    let detailed = options
    this.setData({
      detailed: detailed
    })
    this.createdImage()
  },
  //获取背景图片
  backgroundImg() {
    let that = this;
    var p = new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: that.data.detailed.img, //仅为示例，并非真实的资源
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          }
        }
      })
    });
    return p;
  },
  //获取二维码
  codeImg() {
    let that = this;
    var p = new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: that.data.detailed.img, //仅为示例，并非真实的资源
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          }
        }
      })
    });
    return p;
  },
  //绘图
  createdImage() {
    console.log(12)
    util.jhxLoadShow("图片生成中");
    let that = this;
    Promise
      .all([this.backgroundImg(), this.codeImg()])
      .then(function (results) {
        console.log(results)
        //进行绘制
        const ctx = wx.createCanvasContext('shareFrends');
        // ctx.fillStyle = '#fff';
        // ctx.fillRect(0, 0, 300, 580);
        ctx.drawImage(results[0], 0, 0, 300, 300);
        ctx.drawImage(results[1], 190, 330, 100, 100);
        ctx.font = "12px Georgia";
        ctx.fillStyle = "#666";
        ctx.fillText('扫码或长按二维码', 190, 450)
        that.drawText(ctx, that.data.detailed.name, 10, 350, 11);

        ctx.draw()
        util.jhxLoadHide();
      });
    this.setData({
      canvasShow: true
    })
  },
  //文字换行
  drawText(ctx, t, x, y, w) {
    console.log(t)
    var chr = t.split("");
    var temp = "";
    var row = [];

    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";

    for (var a = 1; a <= chr.length; a++) {
      if (a % w == 0 && a != chr.length) {
        row.push(temp);
        temp = ''
      } else if (a == chr.length) {
        row.push(temp);
        temp = ''
      } else {
        temp += chr[a - 1]
      }
    }
    console.log(row)
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], x, y + (b + 1) * 18);
    }
  },
  saveImageInit(){
    let that = this;
    // 3. canvas画布转成图片
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 470,
      destWidth: 600,
      destHeight: 940,
      canvasId: 'shareFrends',
      success: function (res) {
        if (!res.tempFilePath) {
          wx.showModal({
            title: '提示',
            content: '图片绘制中，请稍后重试',
            showCancel: false
          })
        }  
        that.setData({
          saveImagePath: res.tempFilePath
        })
        this.saveImage()
      },
      fail: function (res) {
        check.showErrorToast(res)
      }
    })
  },
  //保存图片
  saveImage() {
    let that = this;
    //4. 当用户点击分享到朋友圈时，将图片保存到相册
    console.log(that.data.saveImagePath, )
    wx.saveImageToPhotosAlbum({
      filePath: that.data.saveImagePath,
      success: function (data) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '您的二维码已保存到相册，赶快识别二维码添加小易进行咨询吧',
          showCancel: false,
        })
      },
      fail: function (err) {
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
      },
      complete(res) {
        wx.hideLoading()
      }
    })
    // wx.saveImageToPhotosAlbum({
    //   filePath: that.data.saveImagePath,
    //   success(res) {
    //     console.log("成功")
    //     wx.showModal({
    //       title: '图片保存成功!',
    //       content: '图片成功保存到相册了，去发圈噻~',
    //       showCancel: false,
    //       confirmText: '好哒',
    //       confirmColor: '#72B9C3',
    //       success: function (res) {
    //         that.setData({
    //           saveImagePath: res.tempFilePath,
    //         })
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //     // check.showErrorToast(res)
    //   }
    // })
  },
  //取消绘图
  cancelmage() {},
})