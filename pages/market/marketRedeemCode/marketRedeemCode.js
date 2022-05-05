let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    detail:{
      id:0,
      code:'123456',
      img:'',
      orderId:'',
      goodsId:'',
      spec:'规格',
      title:'商品名称',
      updateTime:'',
      used:1,
    }
  },
  onLoad: function (options) {
    let code = null;
    if(options.gc){
      code = options.gc
    }else{
      let string = decodeURIComponent(options.scene).toString().split('=')
      code = string[1];
    }
    this.setData({
      'detail.code': code
    })
  },
  onShow: function () {
    this.init()
  },
  init(){
    let that = this
    user.memberGetInfo().then(res => {
      if(!res.result.goodsCheck){
        check.showErrorToast('您还不是检测员工，请联系技术人员')
      }else{
        that.info()
      }
    }).catch((err) => {
      console.log(err)
    });
    // that.info()
  },
  info(){
    let that = this
    let code = this.data.detail.code
    util.request(api.MemberGoodsQueryByCode + '?code=' + code , 'GET').then(res => {
      let data = res.result;
      let detail = {
        id:data.id,
        code: code,
        img: data.img,
        orderId: data.orderId,
        goodsId: data.goodsId,
        spec: data.spec,
        title: data.title,
        updateTime: data.updateTime,
        used: data.used,
      }
      that.setData({
        detail:detail,
      })
    }).catch((err) => {});
  },
  //提交
  submitBtn(){
    if(!this.data.detail.code){
      check.showErrorToast('请扫码获取兑换码')
      return false
    }
    let detail = this.data.detail
    let param = {
      orderId:detail.orderId,
      id:detail.id,
    };
    util.request(api.MemberGoodsConsumeCode , param , 'post').then(res => {
      wx.showModal({ 
        title: '提交成功',
        content: '提交的内容可以在后台查询到',
        success: function(res) {
          wx.switchTab({
            url: "/pages/index/index"
          })
        }
      })
    }).catch((err) => {
      
    });
  },
  goMarketDetailed(){
    let id = this.data.detail.goodsId
    wx.navigateTo({ 
      url: "/pages/market/marketDetailed/marketDetailed?id="+id
    });
  },
})