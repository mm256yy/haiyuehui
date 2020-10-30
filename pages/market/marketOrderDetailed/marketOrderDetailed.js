let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
Page({
  data: {
    detail:{
      status:1,
      createTime:'',
      id:'',
      goods:[
        {
          id:0,
          img:'/static/images/logo.png',
          name:'',
          salePrice:'0',
          num:'1',
          codes:[
            // {code:'4564564',used:0}
          ]
        },
      ]
    },
    detailCopy:{},
  },
  onLoad: function (options) {
    this.init(options);
  },
  onShow: function () {
    
  },
  init(options){
    let orderId = options.orderId;
    console.log(orderId)
    let param = {
      orderId:orderId
    }
    util.request(api.MallOrderDetail , param , 'GET').then(res => {
      let data = res.result;
      let g_ul = [];let g_li = {};let c_ul = [];let c_li = {};
      for(let i=0;i<data.goods.length;i++){
        if(data.goods[i].codes){
          for(let j=0;j<data.goods[i].codes.length;j++){
            c_li = {
              code:data.goods[i].codes[j].code,
              used:data.goods[i].codes[j].used,
              copy:0,
            }
            c_ul.push(c_li)
          }
        }
        g_li = {
          id:data.goods[i].goodsId,
          img:data.goods[i].goodsImg,
          name:data.goods[i].goodsTitle,
          salePrice:data.goods[i].totalPrice,
          num:data.goods[i].amount,
          codes:c_ul
        }
        c_ul = [];
        g_ul.push(g_li)
      }
      let detailNew = {
        status:data.status,
        createTime:data.createTime,
        id:data.id,
        money:data.money,
        goods:g_ul,
      }
      console.log(detailNew)
      this.setData({
        detail:detailNew,
        detailCopy:detailNew,
      })
    }).catch((err) => {});
  },
  shareCopy(e){
    let that = this;
    let index1 = e.currentTarget.dataset.index1;
    let index2 = e.currentTarget.dataset.index2;
    let detailNew = that.data.detail;
    wx.setClipboardData({
      data: String(e.currentTarget.dataset.text),
      success: function (res) {
        if(index1||index1 == 0){
          detailNew.goods[index1].codes[index2].copy = 1;
          that.setData({
            detail:detailNew,
          })
        }
      },
    })
  },
  // longShareCopy(e){
  //   let code = e.currentTarget.dataset.text;
  //   let codeCopy = '';
  //   let num = 0
  //   for(let i=0;i<code.length;i++){
  //     if(code[i].used == 0){
  //       codeCopy += code[i].code + ';'
  //       num ++
  //     }
  //   }
  //   if(num == 0){
  //     wx.showToast({title: "兑换码都已使用" ,icon:'none'})
  //   }else{
  //     wx.setClipboardData({
  //       data: String(codeCopy.substr(0, codeCopy.length - 1)),
  //       success: function (res) {
  //       },
  //     })
  //   }
  // }
})