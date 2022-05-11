let user = require('../../../../utils/user.js');
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    exchangeUl:[
      {
        id:0,
        img:'',
        title:'ddd',
        points:2000,
        time:'2021-12-21 16:16:16',
      }
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
    util.request(api.PointRecord, param, 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let exchangeUlNew = [];
      let data = res.result.records
      for (let i = 0; i < data.length; i++) {
        o_li = {
          id:data[i].id,
          img:data[i].pic,
          title:data[i].name,
          points:data[i].points,
          time:data[i].createTime,
        }
        o_ul.push(o_li)
      }
      if (pull == 1) { //初始化
        exchangeUlNew = o_ul;
      } else {
        exchangeUlNew = this.data.exchangeUl.concat(o_ul);
        if (data.length == 0) {
          this.setData({
            pageNo: this.data.pageNo - 1
          });
        }
      };
      this.setData({
        exchangeUl: exchangeUlNew
      })
    }).catch((err) => {
      this.setData({
        exchangeUl: []
      })
    });
  },
})