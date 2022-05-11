
let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    code:'',
  },
  onLoad: function (options) {

  },
  onShow: function () {
    user.memberGetInfo().then(res => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });
  },
  //兑换
  codeUp(){
    console.log(this.data.code)
    if(this.data.code.length == 0){
      check.showErrorToast('请输入兑换码')
      return false
    }
    let param = {
      code:this.data.code
    }
    util.request(api.MemberUpToHJK, param, 'GET').then(res => {
      wx.showModal({title: '成功',content: '兑换成功' ,showCancel: false , success (res) {
        wx.switchTab({ 
          url:"/pages/index/index"
        })
      }}); 
    }).catch((err) => {});
  },
  //input焦点
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },
})