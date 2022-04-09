let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    memberId:'',
    info:{
      ident:'',
      mobile:'',
      name:'',
    },
    form:{
      url1:'',
      url2:'',
      url3:'',
    }
  },
  onLoad: function (options) {
    this.init(options)
  },
  onShow: function () {

  },
  init(options){
    let that = this
    // let string = decodeURIComponent(options.query.scene).toString().split('=')
    // let id = string[1];
    let id = options.id
    util.request(api.memberGetPersonInfo + '?memberId=' + id , 'GET').then(res => {
      let data = res.result;
      if(!data.isCheckPerson){
        check.showErrorToast('您并不是检查人员，请联系工作人员')
      }else{
        let info = {
          ident: data.ident,
          mobile: data.mobile,
          name: data.name,
        }
        that.setData({
          info:info
        })
      }
    }).catch((err) => {});
  },
  //提交
  submitBtn(){
    if(!this.data.orderId){
      check.showErrorToast('请扫码获取用户手机号')
      return false
    }
    if(!this.data.form.url1){
      check.showErrorToast('请拍摄顾客的健康码')
      return false
    }
    let param = {
      orderId:orderId,
      photoType1:1,
      url1:form.url1,
      photoType2:4,
      url2:form.url2,
      vin:form.vin,
    };
    util.request(api.GaugingCarQueryTimesQuery , param , 'post').then(res => {
      wx.showModal({ 
        title: '查询成功',
        content: '请在本订单报告列表查看报告信息',
        success: function(res) {
          wx.redirectTo({
            url: "/pages/ucenter/gauging/reportList/reportList?orderId="+orderId
          })
        }
      })
    }).catch((err) => {
      
    });
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