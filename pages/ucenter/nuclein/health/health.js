Page({
  data: {
    orderId:'45456456454',
    form:{
      url1:'',
      url2:'',
      url3:'',
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  image1Change(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths;
        that.Imgupload(that, tempFilePaths, 1)
      }
    })
  },
  image2Change(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths;
        that.Imgupload(that, tempFilePaths, 2)
      }
    })
  },
  image3Change(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths;
        that.Imgupload(that, tempFilePaths, 3)
      }
    })
  },
  Imgupload(page, path, type) {
    console.log(path)
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: api.SystemUpload,
      filePath: path[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //上传成功返回数据
        let data = JSON.parse(res.data)
        if (data.code == 0) {
          check.showSuccessToast("上传成功")
          if(type == 1){
            that.setData({
              'form.url1':data.result,
            })
          }else{
            that.setData({
              'form.url2':data.result,
            })
          }
        }else{
          check.showErrorToast("上传失败2");
          return;
        }
      },
      fail: function (e) {
        console.log(e);
        check.showErrorToast("上传失败1");
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },
})