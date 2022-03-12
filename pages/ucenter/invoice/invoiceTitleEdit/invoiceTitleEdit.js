let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    companyType:0,
    default:false,
    detail:{
      name:'',
      num:'',
      address:'',
      tel:'',
      mobile:'',
      email:'',
    }
  },
  onShow: function () {

  },
  //选择企业类型
  radioChange(e){
    let val = e.detail.value;
    this.setData({
      companyType:val
    })
  },
  //设置为默认
  defaultChange(){
    this.setData({
      default:!this.data.default
    })
  },
  //保存
  preserve(){
    if(!check.checkName(this.data.detail.name)){return false}
    
    if(!check.checkMobile(this.data.detail.mobile)){return false}
    if(!check.checkEmail(this.data.detail.email)){return false}
    let param = {

    }
    console.log(this.data.detail)
  },
  //input
  bindNameInput(e) {
    this.setData({
      'detail.name': e.detail.value
    });
  },
  bindNumInput(e) {
    this.setData({
      'detail.num': e.detail.value
    });
  },
  bindAddressInput(e) {
    this.setData({
      'detail.address': e.detail.value
    });
  },
  bindMobileInput(e) {
    this.setData({
      'detail.tel': e.detail.value
    });
  },
  bindMobileInput(e) {
    this.setData({
      'detail.mobile': e.detail.value
    });
  },
  bindEmailInput(e) {
    this.setData({
      'detail.email': e.detail.value
    });
  },
})