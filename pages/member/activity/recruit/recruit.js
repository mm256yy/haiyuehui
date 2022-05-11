let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');

Page({
  data: {
    height:'',
    gender:[
      {value: '1', name: '男'},
      {value: '0', name: '女'},
    ],
    info:{
      name:'',
      mobile:'',
      gender:'',
      age:16,
      job:'',
    },
    company:[
      {name:'海外海集团总部',orgCode:''}
    ],
    companyIndex:null,
    status: 2, //1 正 2 反
  },
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },
  onShow: function () {
    this.init();
    this.funCompany();
  },
  init(){
    //获取到当前的手机号123
    let tel = wx.getStorageSync('userInfoMobile');
    if(tel){  //如果存在
      this.setData({
        'info.mobile':tel
      })      
    }else{
      wx.navigateTo({
        url: "/pages/auth/login/login"
      })
    }
  },
  //获得企业
  funCompany(){
    util.request(api.personnelCompany, 'GET').then(res => {
      let company = res.result
      this.setData({
        company:company
      })
    }).catch((err) => {});
  },
  //确定信息
  btnSuccess(){
    let info = this.data.info
    if(!check.checkName(info.name)){return false}
    if(!check.checkMobile(info.mobile)){return false}
    if(info.job == ''){
      check.showErrorToast('应聘岗位不能为空');
      return false;
    }
    if(!this.data.companyIndex){
      check.showErrorToast('应聘企业不能为空');
      return false;
    }
    let param = {
      name:info.name,
      mobile:info.mobile,
      sex:info.gender,
      age:info.age,
      corpName:this.data.company[this.data.companyIndex].name,
      orgCode:this.data.company[this.data.companyIndex].orgCode,
      job:info.job,
    }
    util.request(api.personnelSubmit, param, 'POST').then(res => {
      wx.showModal({   
        title: '提交成功',
        content: '你的应聘信息已经提交到海外海',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
      let info = {
        name:'',
        mobile:'',
        gender:'',
        age:1,
        job:'',
      }
      this.setData({
        info:info
      })
    }).catch((err) => {});
  },
  bindPickerChange(e){
    this.setData({
      companyIndex: e.detail.value
    })
  },
  //信息填写
  radioChange(e){
    this.setData({
      'info.gender': e.detail.value
    });
  },
  sliderchange(e){
    this.setData({
      'info.age': e.detail.value
    });        
  },
  bindNameInput(e){
    this.setData({
      'info.name': e.detail.value
    });
  },
  bindMobileInput(e){
    this.setData({
      'info.mobile': e.detail.value
    });
  },
  bindJobInput(e){
    this.setData({
      'info.job': e.detail.value
    });
  },
  goIndex(){
    wx.switchTab({ 
      url:"/pages/index/index"
    })
  },
})