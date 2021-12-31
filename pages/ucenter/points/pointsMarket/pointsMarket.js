let user = require('../../../../utils/user.js');
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');

Page({
  data: {
    infoPoints: 0,
    goodsUl: [
      // {
      //   img: '/static/images/logo.png',
      //   name: '测试产品123123',
      //   introduce: '这是一个测试产品打扫打扫打扫的大事',
      //   categoryId: '',
      //   price: '123',
      //   salePrice: '110',
      //   content: '',
      //   shareUrl: '',
      // }, 
    ],
    pageNo:1,
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.setData({
      pageNo: 1,
    })
    this.init(1)
    this.memberCard();
  },
  //会员卡信息
  memberCard() {
    user.memberGetInfo().then(res => {
      this.setData({
        infoPoints: res.result.points,
      })
    }).catch((err) => {});
  },
  // 上拉刷新
  onReachBottom: function () {
    this.setData({
      pageNo: this.data.pageNo + 1,
    })
    this.init(2)
  },
  //加载商品
  init(pull) { //pull 1为初始化 2为下拉
    let param = {
      pageNo: this.data.pageNo,
      pageSize: 10,
    }
    util.request(api.PointsList, param, 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let goodsUlNew = [];
      let data = res.result.records
      for (let i = 0; i < data.length; i++) {
        o_li = {
          id: data[i].id,
          name: data[i].title,
          img: data[i].picture,
          points: data[i].points,
        }
        o_ul.push(o_li)
      }
      if (pull == 1) { //初始化
        goodsUlNew = o_ul;
      } else {
        goodsUlNew = this.data.goodsUl.concat(o_ul);
        if (data.length == 0) {
          this.setData({
            pageNo: this.data.pageNo - 1
          });
        }
      };
      this.setData({
        goodsUl: goodsUlNew
      })
    }).catch((err) => {
      this.setData({
        goodsUl: []
      })
    });
  },
  //商品详细
  goGoodsDetailed(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/ucenter/points/pointsDetail/pointsDetail?id=" + id
    })
  },
  //积分明细
  goPointsHistory() {
    wx.navigateTo({
      url: "/pages/ucenter/points/pointsHistory/pointsHistory"
    })
  },
  //兑换记录
  goPointsExchange() {
    wx.navigateTo({
      url: "/pages/ucenter/points/pointsExchange/pointsExchange"
    })
  },
})