let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');   
Page({
  data: {
    detail:{
      status:1,
      createTime:'',
      id:'',
      remark:['未写备注'],
      payMoney:0,
      discount:100,
      money:'',
      goods:[
        {
          id:0,
          img:'/static/images/logo.png',
          name:'',
          salePrice:'0',
          num:'1',
          spec:'',
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
    this.member();
  },
  onShow: function () {
    
  },
  init(options){
    let orderId = options.orderId;
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
              code:data.goods[i].codes[j].code?data.goods[i].codes[j].code:'',
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
          salePrice:data.goods[i].unitPrice,
          num:data.goods[i].amount,
          spec:data.goods[i].spec?data.goods[i].spec:'',
          codes:c_ul
        }
        c_ul = [];
        g_ul.push(g_li)
      }
      let remarkNew = data.remark == null?["尚未备注"]:data.remark.split('\n');
      let detailNew = {
        canRefund:data.canRefund,
        status:data.status,
        createTime:data.createTime,
        id:data.id,
        discount:100,
        money:data.money,
        payMoney:data.payMoney,
        remark:remarkNew,
        goods:g_ul,
      }
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
  //会员
  member(){
    user.memberGetInfoStorage().then(res => {
      this.setData({
        'detail.discount':res.result.discount
      })
    }).catch((err) => {
      console.log(err)
    });
  },
  goMarketDetailed(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: "/pages/market/marketDetailed/marketDetailed?id="+id
   });
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