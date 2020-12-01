let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user.js');
let check = require('../../../utils/check.js');
Page({
  data: {
    id:'',
    orgCode:'',
    carWash:{
      address1:'',
      address2:'',
      address3:'',
      address4:'',
      name:'',
      mobile:'',
    },
  },
  onLoad: function (options) {
    this.setData({
      id:options.id,
      orgCode:options.orgCode,
    })
  },
  onShow: function () {
    

  },
  //立即提交
  btnSuccess(){
    let carWash = this.data.carWash
    if(carWash.address1 == ''||carWash.address2 == ''||carWash.address3 == ''){
      check.showErrorToast("请填写车辆位置信息");
      return false
    }
    if(!check.checkName(this.data.carWash.name)){return false}
    if(!check.checkMobile(this.data.carWash.mobile)){return false}

    
    let param = {
      id:this.data.id,
      address:carWash.address1+'馆'+carWash.address2+'层'+carWash.address3+'号'+carWash.address4,
      name:carWash.name,
      mobile:carWash.mobile,
    };
    util.request(api.MallCarWashStart , param , 'POST').then(res => {
      wx.navigateBack({ 
        delta: 1  
      }); 
    }).catch((err) => {});
  },
  //input焦点
  carWashAddress1Input: function(e) {
    this.setData({
      'carWash.address1': e.detail.value
    });
  },
  carWashAddress2Input: function(e) {
    this.setData({
      'carWash.address2': e.detail.value
    });
  },
  carWashAddress3Input: function(e) {
    this.setData({
      'carWash.address3': e.detail.value
    });
  },
  carWashAddress4Input: function(e) {
    this.setData({
      'carWash.address4': e.detail.value
    });
  },
  carWashNameInput: function(e) {
    this.setData({
      'carWash.name': e.detail.value
    });
  },
  carWashMobileInput: function(e) {
    this.setData({
      'carWash.mobile': e.detail.value
    });
  },
})