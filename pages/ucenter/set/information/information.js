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
    isFirst:false,
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
    let tel = wx.getStorageSync('userInfoMobile');
    let isFirstNew = null; 
    if(tel){  //如果存在
      util.request(api.MemberGet, 'GET').then(res => {
        let infoNew = {
          ident:res.result.ident != null?res.result.ident:'',
          name:res.result.name != null?res.result.name:'',
          mobile:tel,
        }
        if(infoNew.ident == ''){
          isFirstNew = true;
        }else{
          isFirstNew = false;
        }
        this.setData({
          info:infoNew,
          isFirst:isFirstNew,
        })
      }).catch((err) => {
        if(err == "未找到会员信息"){
          wx.showModal({ 
            title: '获取会员失败',
            content: '你未绑定手机号码',
            success: function(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "/pages/auth/registerWx/registerWx"
                });
              } else if (res.cancel) {
                wx.navigateBack({ 
                  delta: 1  
                });
              }
            }
          })
        }else{
          wx.showModal({title: '错误信息',content: err ,showCancel: false}); 
        }
      });
    }else{
      wx.redirectTo({
        url: "/pages/auth/login/login"
      })
    }
  },
  //确认信息
  btnSuccess(){
    let that = this;
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.ident)){return false}
    let param = {
      name:this.data.info.name,
      ident:this.data.info.ident,
    }
    console.log(param)
    if(this.data.isFirst&&this.data.info.ident!=''){
      wx.showModal({   //cancelColor（取消按钮的文字颜色）confirmColor（确定按钮的文字颜色）
        title: '确认信息',
        content: '身份证信息填写后将不允许修改',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            that.edit(param); 
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }else{
      this.edit(param);
    }
  },
  edit(param){
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