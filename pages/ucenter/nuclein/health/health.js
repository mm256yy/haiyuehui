let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
Page({
  data: {
    memberId:'',
    info:{
      ident:'',
      mobile:'',
      name:'',
    },
    form:{
      img1:'',
      img2:'',
      img3:'',
    }
  },
  onLoad: function (options) {
    let memberId = null;
    if(options.id){
      memberId = options.id
    }else{
      let string = decodeURIComponent(options.scene).toString().split('=')
      memberId = string[1];
    }
    this.setData({
      memberId: memberId
    })
  },
  onShow: function () {
    this.init()
  },
  init(){
    let that = this
    user.memberGetInfo().then(res => {
      if(!res.result.isCheckPerson){
        check.showErrorToast('您还不是检测员工，请联系技术人员')
      }else{
        that.info()
      }
    }).catch((err) => {
      console.log(err)
    });
  },
  info(){
    if(this.data.info.mobile){
      return false
    }
    let that = this
    let memberId = this.data.memberId
    util.request(api.memberGetPersonInfo + '?memberId=' + memberId , 'GET').then(res => {
      let data = res.result;
      let info = {
        ident: data.ident,
        mobile: data.mobile,
        name: data.name,
      }
      that.setData({
        info:info,
      })
    }).catch((err) => {});
  },
  //提交
  submitBtn(){
    console.log(this.data.info)
    if(!this.data.info.mobile){
      check.showErrorToast('请扫码获取用户手机号')
      return false
    }
    if(!this.data.form.img1){
      check.showErrorToast('请拍摄顾客的健康码')
      return false
    }
    let info = this.data.info
    let form = this.data.form
    let param = {
      memberId:this.data.memberId,
      name:info.name,
      ident:info.ident,
      mobile:info.mobile,
      img1:form.img1,
      img2:form.img2,
      img3:form.img3,
    };
    util.request(api.memberHealthRecord , param , 'post').then(res => {
      wx.showModal({ 
        title: '提交成功',
        content: '提交的内容可以在后台查询到',
        success: function(res) {
          wx.redirectTo({
            url: "/pages/ucenter/nuclein/scan/scan"
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
              'form.img1':data.result.url,
            })
          }else if(type == 2){
            that.setData({
              'form.img2':data.result.url,
            })
          }else if(type == 3){
            that.setData({
              'form.img3':data.result.url,
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
  //input焦点
  bindNameInput(e) {
    this.setData({
      'info.name': e.detail.value
    });
  },
  bindIdentityInput(e) {
    this.setData({
      'info.ident': e.detail.value
    });
  },
})