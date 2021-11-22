let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    src: '',
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  takePhoto() {
    // this.ctx.takePhoto({
    //   quality: 'high',
    //   success: (res) => {
    //     this.setData({
    //       src: res.tempImagePath
    //     })
    //   }
    // })
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log('本地图片的路径:', tempFilePaths)
        upload(that, tempFilePaths)
      }
    })
  },
})

function upload(page, path) {
  wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: api.UcenterOrderPark,
      filePath: path[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //上传成功返回数据
        console.log('上传成功返回的数据', JSON.parse(res.data).data);
        if (res.code == 0) {
          check.showSuccessToast("上传成功")
        }else{
          check.showErrorToast("上传失败");
          return;
        }
      },
      fail: function (e) {
        console.log(e);
        check.showErrorToast("上传失败");
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
}