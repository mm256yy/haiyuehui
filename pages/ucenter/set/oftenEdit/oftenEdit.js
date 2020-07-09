var util = require('../../../../utils/util.js');
var check = require('../../../../utils/check.js');
var api = require('../../../../config/api.js');
Page({
  data: {
    info:{
      id:'',
      name:'',
      identity:'',
      mobile:'',
    },
    isDefault:0,
    isEdit:false,
  },
  onLoad: function (options) {
    console.log(options)
    if(options.id != ''&&options.id != undefined){  //编辑
      this.query(options);
      this.setData({
        'info.id':options.id,
        isEdit:true
      })
    }else{  //新增
      this.setData({
        'info.id':options.id,
        isEdit:false
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  //查询常住人信息
  query(options){
    let param = {
      id:options.id,
    }
    console.log(param)
    util.request(api.UcenterSetPersonQuery, param , 'GET').then(res => {
      let infoNew = {
        id:res.result.id,
        name:res.result.name,
        identity:res.result.ident,
        mobile:res.result.mobile,
      }
      this.setData({
        info:infoNew,
        isDefault:res.result.isDefault
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //点击是否默认
  agree(){
    let isDefaultNew = null;
    if(this.data.isDefault == 0){
      isDefaultNew = 1
    }else{
      isDefaultNew = 0
    }
    this.setData({
      isDefault:isDefaultNew
    })
    console.log(this.data.isDefault)
  },
  //清除
  clean(){
    let infoNew = {
      name:'',
      identity:'',
      mobile:'',
    }
    this.setData({
      info:infoNew
    })
  },
  //删除
  delete(){
    let param = {
      id:this.data.info.id,
    }
    console.log(param)
    util.request(api.UcenterSetPersonDelete, param, 'GET').then(res => {
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
      'info.identity': e.detail.value
    });
  },
  bindMobileInput(e) {
    this.setData({
      'info.mobile': e.detail.value
    });
  },
  //确认
  btnSuccess(){
    console.log(this.data.info.identity)
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.identity)){return false}
    if(!check.checkMobile(this.data.info.mobile)){return false}

    let param = {}
    if(this.data.isEdit){  //编辑
      param = {
        id:this.data.info.id,
        name:this.data.info.name,
        ident:this.data.info.identity,
        mobile:this.data.info.mobile,
        isDefault:this.data.isDefault
      }
      console.log(param)
      util.request(api.UcenterSetPersonEdit, param, 'POST').then(res => {
        wx.navigateBack({ 
          delta: 1  
        }); 
      }).catch((err) => {
        wx.showModal({title: '错误信息',content: err,showCancel: false}); 
      });
    }else{  //新增
      param = {
        name:this.data.info.name,
        ident:this.data.info.identity,
        mobile:this.data.info.mobile,
        isDefault:this.data.isDefault
      }
      console.log(param)
      util.request(api.UcenterSetPersonAdd, param, 'POST').then(res => {
        wx.navigateBack({ 
          delta: 1  
        }); 
      }).catch((err) => {
        wx.showModal({title: '错误信息',content: err,showCancel: false}); 
      });
    }
    
  },
})