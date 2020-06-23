var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
Page({
  data: {
    info:{
      ident:'',
      name:'',
      mobile:'',
    },
    hasInfo:false,
  },
  onLoad: function (options) {
    this.init();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  init(){
    //获取到当前的手机号
    let tel = wx.getStorageSync('userInfoTel');
    if(tel){  //如果存在
      this.setData({
        'info.mobile':tel+'(无法修改)',
        hasInfo:true
      })
      util.request(api.UcenterSetMemberGet, 'GET').then(res => {
        console.log(res)
        if (res.status.code === 0) {

        }else if(res.status.code === 400){
          wx.navigateTo({ 
            url: "/pages/auth/login/login"
          });
        }
      }).catch((err) => {
        console.log(err)
      });
    }else{
      this.setData({
        hasInfo:false
      })
      wx.navigateTo({
        url: "/pages/auth/login/login"
      })
    }
  },
  //确认信息
  btnSuccess(){
    if(!util.checkName(this.data.info.name)){return false}
    if(!util.checkIdentity(this.data.info.identity)){return false}
    let param = {
      name:this.data.info.name,
      ident:this.data.info.identity,
    }
    console.log(param)
    util.request(api.UcenterSetMemberEdit, param, 'POST').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        wx.navigateBack({ 
          delta: 1  
        }); 
      }else if(res.status.code === 400){
        wx.navigateTo({ 
          url: "/pages/auth/login/login"
        });
      }
    }).catch((err) => {
      console.log(err)
    });
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
})