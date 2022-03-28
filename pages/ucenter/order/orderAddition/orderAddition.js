let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    additionType:0,   //0 同住人 1 访客  2 分享同住人 
    orderId:0,
    hotelId:0,
    roomNo:0,
    info:{
      name:'',
      identity:'',
      mobile:'',
    },
    menuUl:[
      {name:"实名认证"},
      {name:"实人认证"},
      {name:"完成登记"},
    ],
    menuChoose:0,
    //错误提示
    cameraErr:'',
  },
  onLoad(options) {
    this.ctx = wx.createCameraContext()
    this.setData({
      additionType:options.additionType,
      orderId:options.orderId,
      hotelId:options.hotelId,
      roomNo:options.roomNo
    })
  },
  onShow() {
    this.substitution();
  },
  //常住人换人
  substitution(){
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data.info)  // data中会含有testdata
    this.setData({
      info:currPage.data.info
    })
  },
  resideBtn(){
    let that = this;
    let choose = this.data.menuChoose;
    if(choose == 0){
      if(!check.checkName(that.data.info.name)){return false}
      if(!check.checkIdentity(that.data.info.identity)){return false}
      if(!check.checkMobile(that.data.info.mobile)){return false}
      wx.showModal({ 
        title: '办理入住',
        content: '请确认信息填写正确无误',
        success: function(resV) {
          if (resV.confirm) {
            console.log('用户点击确定')
            that.setData({
              menuChoose : choose + 1
            })
          } else if (resV.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else if(choose == 1){
      that.ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log(res)
          var tempImagePath = res.tempImagePath;
          that.Imgupload(that, tempImagePath)
        }
      })
    }else if(choose == 2){
      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      })
      // let additionType = that.data.additionType
      // if(additionType == 0||additionType == 2){ //同住人
      //   wx.navigateBack({
      //     delta: 1  // 返回上一级页面。
      //   })
      // }else if(additionType == 1){
      //   wx.navigateBack({
      //     delta: 1  // 返回上一级页面。
      //   })
      // }
    }
  },
  //添加同住人
  // startBtn0(){
  //   let that = this;
  //   if(!check.checkName(this.data.info.name)){return false}
  //   if(!check.checkIdentity(this.data.info.identity)){return false}
  //   if(!check.checkMobile(this.data.info.mobile)){return false}
  //   let param = {
  //     orderId:this.data.orderId,
  //     name:this.data.info.name,
  //     ident:this.data.info.identity,
  //     mobile:this.data.info.mobile
  //   }
  //   console.log(param)
  //   util.request(api.UcenterOrderAddPerson , param , 'POST').then(res => {
  //     wx.showModal({ title: '成功',content: '入住成功',showCancel: false , success (res) {
  //       if (that.data.additionType == 2) { //同住人分享
  //         wx.switchTab({ 
  //           url:"/pages/index/index"
  //         })
  //       } else{
  //         wx.navigateBack({
  //           delta: 1  // 返回上一级页面。
  //         })
  //       }
  //     }});
  //   }).catch((err) => {});
  // },
  //添加访客
  // startBtn1(){
  //   if(!check.checkName(this.data.info.name)){return false}
  //   if(!check.checkIdentity(this.data.info.identity)){return false}
  //   if(!check.checkMobile(this.data.info.mobile)){return false}
  //   let param = {
  //     orderId:this.data.orderId,
  //     hotelId:this.data.hotelId,
  //     roomNo:this.data.roomNo,
  //     name:this.data.info.name,
  //     ident:this.data.info.identity,
  //     mobile:this.data.info.mobile
  //   }
  //   console.log(param)
  //   util.request(api.UcenterVisitorAdd , param , 'POST').then(res => {
  //     wx.showModal({ title: '成功',content: '提交成功',showCancel: false , success (res) {
  //       if (res.confirm) {
  //         wx.navigateBack({
  //           delta: 1  // 返回上一级页面。
  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }});
  //   }).catch((err) => {});
  // }, 
  //拍照识别
  park(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.upload(that, tempFilePaths)
      }
    })
  },
  Imgupload(page, path) {
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: api.SystemUpload,
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //上传成功返回数据
        let data = JSON.parse(res.data)
        if (data.code == 0) {
          that.setData({
            'info.file':data.result
          })
          let additionType = that.data.additionType
          let checkType = null; //0首次 1同住人 2访客
          if(additionType == 0||additionType == 2){ //同住人
            checkType = 1
          }else if(additionType == 1){ //访客
            checkType = 2
          }
          let url = api.UcenterOrderCheckPerson +'?orderId='+ that.data.orderId
          + '&type=' + checkType
          + '&roomNo=' + that.data.roomNo
          + '&name=' + that.data.info.name
          + '&ident=' + that.data.info.identity
          + '&mobile=' + that.data.info.mobile
          + '&filePath=' + data.result
          util.requestPOST( url , 'POST').then(res => {
            check.showSuccessToast("上传成功")
            that.setData({
              menuChoose : 2,
              cameraErr:'',
            })
          }).catch((err) => {
            that.setData({
              cameraErr : '悉点接口调用失败'
            })
          });
        }else{
          check.showErrorToast(data.message);
          that.setData({
            cameraErr : data.message
          })
          return;
        }
      },
      fail: function (e) {
        that.setData({
          cameraErr : JSON.stringify(e)
        })
        check.showErrorToast("照片上传失败");
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },
  //同住人簿
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
  //酒店协议
  goAgree(){
    wx.navigateTo({
      url: "/pages/member/memberAgree/memberAgree"
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
      'info.identity': e.detail.value
    });
  },
  bindMobileInput(e) {
    this.setData({
      'info.mobile': e.detail.value
    });
  },
})