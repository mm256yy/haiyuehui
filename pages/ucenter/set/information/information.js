let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
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
    //获取到当前的手机号123
    let tel = wx.getStorageSync('userInfoMobile');
    let isFirstNew = null; 
    if(tel){  //如果存在
      console.log("手机号获取到")
    }else{
      wx.redirectTo({
        url: "/pages/auth/login/login"
      })
    }
    user.memberGetInfo().then(res => {
      let infoNew = {
        ident:res.result.ident != null?res.result.ident:'',
        name:(res.result.name != null&&res.result.name != '微信')?res.result.name:'',
        mobile:res.result.mobile != null?res.result.mobile:'',
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
      console.log(err);
    });
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
      wx.showModal({   
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
    }).catch((err) => {});
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