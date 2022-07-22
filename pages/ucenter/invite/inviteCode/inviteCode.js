let api = require('../../../../config/api.js');
let util = require('../../../../utils/util.js');
Page({
  data: {
    codeImg: '',
    closeShareshow: false,
    popShow:false,
    combinationImg: '',
    canvasWidth:800,
    canvasHeight:1404
  },
  onLoad: function (options) {
    // this.imagesCompose()
  },
  onShow: function () {
    this.init()
  },
  init() {
    let that = this
    util.request(api.MemberInviteCode, 'GET').then(res => {
      that.setData({
        codeImg: res.result
      })
    }).catch((err) => {});
  },
  closeShare() {
    this.setData({
      closeShareshow: false,
    })
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
      imageUrl: '/static/images/invite.jpg', //图片地址
      path: '/pages/index/index?inviteCode=' + inviteCode, // 用户点击首先进入的当前页面
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
  },
  //分享生成图片
  share() {
    let that = this
    let imgs = that.data.imgs
    wx.showLoading({
      title: '合成中......',
      mask: true
    })
    // 创建画布对象
    const ctx = wx.createCanvasContext("myCanvas", that)
    // 获取图片信息，要按照原图来绘制，否则图片会变形 
    wx.getImageInfo({
      src: that.data.imgs[index].img,
      success: function (res) {
        // 根据 图片的大小 绘制底图 的大小
        console.log(" 绘制底图 的图片信息》》》", res)
        let imgW = res.width
        let imgH = res.height
        let imgPath = res.path

        that.setData({
          canvasHeight: imgH,
          canvasWidth: imgW
        })
        // 绘制底图 用原图的宽高比绘制
        ctx.drawImage(imgPath, 0, 0, imgW, imgH)

        wx.getImageInfo({
          src: that.data.codeImg, // 二维码图片的路径
          success: function (res) {
            console.log(" 绘制二维码》》》", res)
            // 绘制二维码
            ctx.drawImage(res.path, 50, imgH - 380, 300, 300)
            ctx.draw()

            wx.showLoading({
              title: '正在保存',
              mask: true
            })
          },
          fail(res) {
            wx.hideLoading()
            wx.showModal({
              title: '温馨提示',
              content: '二维码获取失败，请重试',
              showCancel: false
            })
          }
        })

      },
      fail(res) {
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '图片信息获取失败，请重试',
          showCancel: false
        })
      }
    })
  },
  saveToUrl() {
    console.log('saveToUrl')
    return new Promise((resolve, reject) => {

    })
  },
  //隐藏
  popHide(){
    this.setData({
      popShow:false
    })
  },
  //组合图片
  imagesCompose() {
    this.setData({
      popShow:true
    })
    let that = this
    let canvasWidth = 0;
    let canvasHeight = 0;
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getWindowInfo().pixelRatio
        console.log(dpr)
        // console.log(res)
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        canvasWidth = res[0].width * dpr
        canvasHeight = res[0].height * dpr
        // ctx.scale(dpr, dpr)
        // ctx.fillRect(0, 0, 100, 100)
        let baImage = '/static/images/ba-img.jpg'
        wx.getImageInfo({
          src: baImage,
          success: function (res) {
            console.log(" 绘制底图 的图片信息》》》", res)
            let imgW = res.width
            let imgH = res.height
            let imgPath = res.path
            // 图片对象
            const image = canvas.createImage()
            image.src = baImage
            // 图片加载完成回调
            image.onload = () => {
              // 将图片绘制到 canvas 上
              that.setData({
                canvasWidth: imgW,
                canvasHeight: imgH,
              })
              console.log('canvasWidth='+canvasWidth+'canvasHeight='+canvasHeight)
              ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
            }
            that.imagesBase64().then((imgVal) => {
              wx.getImageInfo({
                src: imgVal,
                success: function (res) {
                  console.log(" 绘制底图 的图片信息》》》", res)
                  let imgW = res.width
                  let imgH = res.height
                  let imgPath = res.path
                  // 图片对象
                  const image = canvas.createImage()
                  image.src = imgVal
                  // 图片加载完成回调
                  image.onload = () => {
                    // 将图片绘制到 canvas 上
                    let codeLeft = canvasWidth/4
                    let codeTop = canvasHeight/4
                    let codeW = canvasWidth/2
                    let codeH = canvasHeight/3.5
                    ctx.drawImage(image, codeLeft, codeTop, codeW, codeH)
                    wx.canvasToTempFilePath({
                      canvas,
                      success: res => {
                        console.log(res)
                        const tempFilePath = res.tempFilePath
                        that.setData({
                          combinationImg: tempFilePath,
                        })
                      },
                    })
                  }
                }
              })
            })

          }
        })
      })
  },
  //base64转化成图片
  imagesBase64() {
    const that = this;
    return new Promise((resolve, reject) => {
      var filepath = wx.env.USER_DATA_PATH + '/test.png';
      //获取文件管理器对象
      var fsm = wx.getFileSystemManager();
      fsm.writeFile({
        filePath: filepath,
        data: that.data.codeImg,
        encoding: 'base64',
        success: res => {
          console.log(res)
          resolve(wx.env.USER_DATA_PATH + '/test.png');
          // that.downloadReport(filepath).then((res) => {
          //   resolve(res);
          // })
        },
        fail: err => {
          console.log(err)
        }
      })
    })
  },
  //下载图片到本地
  downloadReport(filepath) {
    const that = this
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      });
      //保存图片到相册
      wx.saveImageToPhotosAlbum({
        filePath: that.data.combinationImg,
        success: function (res) {
          resolve(res);
          wx.hideLoading();
          wx.showToast({
            title: '保存成功！',
            icon: 'success',
          })
        },
        fail: function (err) {
          wx.hideLoading();
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
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
                        content: '获取权限成功,再次点击下载按钮进行保存',
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
        }
      })
    })
  }
})