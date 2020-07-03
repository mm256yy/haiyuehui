var api = require('../../../../config/api.js');
var util = require('../../../../utils/util.js');
Page({
  data: {
    codeImg:'',
  },
  onLoad: function (options) {
    this.init(options)
  },
  onShow: function () {

  },
  init(options){
    let that = this
    util.request(api.MemberInviteCode , 'GET').then(res => {
      console.log(res)
      that.setData({
        codeImg:res.result
      })
    }).catch((err) => {
      console.log(err)  
    });
  },
})