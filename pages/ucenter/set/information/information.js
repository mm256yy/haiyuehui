let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
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
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.init();
  },
  init(){
    //获取到当前的手机号
    let tel = wx.getStorageSync('userInfoMobile');
    if(tel){  //如果存在
      util.request(api.UcenterSetMemberGet, 'GET').then(res => {
        let infoNew = {
          ident:res.result.ident != null?res.result.ident:'',
          name:res.result.name != null?res.result.name:'',
          mobile:tel+'(无法修改)',
        }
        this.setData({
          info:infoNew,
          hasInfo:true
        })
      }).catch((err) => {
        wx.showModal({title: '错误信息',content: err,showCancel: false}); 
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
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.ident)){return false}
    let param = {
      name:this.data.info.name,
      ident:this.data.info.ident,
    }
    console.log(param)
    util.request(api.UcenterSetMemberEdit, param, 'POST').then(res => {
      wx.navigateBack({ 
        delta: 1  
      }); 
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
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
      'info.ident': e.detail.value
    });
  },
})