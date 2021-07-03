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
    this.init(options);
  },
  onShow: function () {

  },
  init(options) {
    console.log(options)
    this.setData({
      'detailed.name': options.name,
      'detailed.price': options.price,
    })
    let param = {
      id: options.id,
    }
    util.request(api.MallGoodsInviteImg , param , 'GET').then(res => {
      let data = res.result
      this.setData({
        'detailed.img': data[1],
        'detailed.code': data[0],
      })
      this.createdImage()
    }).catch((err) => {});
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
        url: that.data.detailed.code,
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
    util.jhxLoadShow("图片生成中");
    let that = this;
    Promise
      .all([this.backgroundImg(), this.codeImg()])
      .then(function (results) {
        //进行绘制
        const ctx = wx.createCanvasContext('shareFrends');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 300, 500);
        ctx.drawImage(results[0], 0, 0, 300, 350);
        ctx.drawImage(results[1], 100, 370, 100, 100);
        ctx.font = "12px Georgia";
        ctx.fillStyle = "#666";
        ctx.fillText('———— 扫码或长按二维码 ————',55, 490)
        // that.drawText(ctx, that.data.detailed.name, 10, 310, 18);

        ctx.draw()
        util.jhxLoadHide();
      });
    this.setData({
      canvasShow: true
    })
  },
  //文字换行
  drawText(ctx, t, x, y, w) {
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
      height: 500,
      destWidth: 900,
      destHeight: 1500,
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
        that.saveImage(res.tempFilePath)
      },
      fail: function (res) {
        check.showErrorToast(res)
      }
    })
  },
  //保存图片
  saveImage(tempFilePath) {
    let that = this;
    //4. 当用户点击分享到朋友圈时，将图片保存到相册
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
  },
  //取消绘图
  cancelmage() {
    wx.navigateBack({ 
      delta: 1  
  }); 
  },
})