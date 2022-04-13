let check = require('../../../../utils/check.js');
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  scan(){
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        let string = decodeURIComponent(res.path).toString().split('=')
        let memberId = string[2];
        let router = (string[0].split('?'))[0]
        let url = '/' + router + '?id='+ memberId
        console.log(url)
        wx.navigateTo({ 
          url: url
        });
      },
      fail (res) {
        console.log(res)
      },
    })
  }
})