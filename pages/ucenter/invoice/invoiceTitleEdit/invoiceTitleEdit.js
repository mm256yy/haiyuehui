let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    id:0,
    detail:{
      address: "",
      code: "",
      createTime: "",
      deleted: 0,
      id: 0,
      isDefault: 0,
      memberId: 0,
      name: "",
      phone: "",
      type: 0,
      updateTime: "",
    }
  },
  onLoad(options) {
    this.init(options)
  },
  onShow: function () {
    this.funDetal()
  },
  init(options){
    this.setData({
      id:options.id
    })
  },
  //详情
  funDetal(){
    let id = this.data.id
    if(id){
      util.request(api.UcenterInvoiceTitleList , 'GET').then(res => {
        let data = res.result
        let detail = {}
        data.map((obj)=>{
          if(obj.id == id){
            detail = obj
          }
        })
        this.setData({
          detail:detail,
        })
      }).catch((err) => {});
    }
  },
  //选择企业类型
  radioChange(e){
    let val = e.detail.value;
    this.setData({
      'detail.type': val
    })
  },
  //设置为默认
  defaultChange(){
    let isDefault = this.data.detail.isDefault
    this.setData({
      'detail.isDefault': isDefault == 0?1:0
    })
  },
  //保存
  preserve(){
    let id = this.data.id
    let param = this.data.detail
    let url = ''
    if(!check.checkName(this.data.detail.name)){return false}
    if(param.type == 1 && param.code == ''){
      check.showErrorToast('单位税号不能为空');
      return false
    }
    if(id){ //编辑
      url = api.UcenterInvoiceTitleEdit
    }else{
      url = api.UcenterInvoiceTitleAdd
    }
    util.request(url , param , 'POST').then(res => {
      wx.navigateBack({ 
        delta: 1  
      }); 
    }).catch((err) => {});
  },
  //input
  bindNameInput(e) {
    this.setData({
      'detail.name': e.detail.value
    });
  },
  bindCodeInput(e) {
    this.setData({
      'detail.code': e.detail.value
    });
  },
  bindAddressInput(e) {
    this.setData({
      'detail.address': e.detail.value
    });
  },
  bindPhoneInput(e) {
    this.setData({
      'detail.phone': e.detail.value
    });
  },
})