let check = require('../../../../utils/check.js');
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');

Page({
  data: {
    id:null,
    detailed: {
      id:0,
      amount:10,
      canAmount:10,
      content:'',
      memberLevel:0,
      picture:'',
      points:100,
      title:'',
      couponId:0,
    },
    tags:[
      {id:0, name:'贵宾卡', show:false},
      {id:1, name:'银卡', show:false},
      {id:2, name:'金卡', show:false},
      {id:3, name:'白金卡', show:false},
      {id:4, name:'黑金卡', show:false},
    ]
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  onShow: function () {
    this.init();
  },
  init(){
    let that = this
    let param = {
      id:this.data.id
    }
    util.request(api.PointsDetail , param , 'GET').then(res => {
      let data = res.result
      let detailed = {
        id:data.id,
        amount:data.amount,
        canAmount:data.canAmount,
        content:data.content.split('\n'),
        memberLevel:data.memberLevel,
        picture:data.picture,
        points:data.points,
        title:data.title,
        couponId:data.couponId,
      }
      //tags
      let tags = this.data.tags;
      if(data.memberLevel != '-1'){
        data.memberLevel.split(',').map((obj)=>{
          tags[obj].show = true
          return obj
        })
      }else{
        tags = [{id:5, name:'所有会员都可兑换', show:true},]
      }
      this.setData({
        detailed:detailed,
        tags: tags
      })
    }).catch((err) => {});
  },
  //兑换
  exchange(){
    let param = {
      id:this.data.detailed.id
    }
    util.request(api.PointsExchange , param , 'GET').then(res => {
      if(res.code == 0){
        wx.showModal({ title: '成功' , content: '商品兑换成功',showCancel: false , success (res) {

        }});
      }
    }).catch((err) => {});
  },
  //
  memberVal(id){
    switch (id) {
      case '0' : return "贵宾卡";
      case '1' : return "银卡";
      case '2' : return "金卡";
      case '3' : return "白金卡";
      case '4' : return "黑金卡";
      default: return '其他';
    }
  }
})