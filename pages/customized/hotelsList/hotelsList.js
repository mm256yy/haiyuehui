var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({
  data: {
    hotels:[
      /*{id:'0',name:"酒店1",img:"/static/images/hotels1.jpg",address:"address",tel:'15967125243',deposit:20000,cis:0}*/
    ]
  },
  onLoad: function (options) {
    let hotelsUl = [];
    let hotelsLi = {};
    util.request(api.CustomizedHotelsList, 'GET').then(res => {
      if (res.status.code === 0) {
        hotelsLi = {
          id:res.result[i].id,
          name:res.result[i].name,
          img:'/static/images/hotels/hotels'+i+'.jpg',
          address:res.result[i].address,
          deposit:res.result[i].deposit,
          tel:res.result[i].tel,
          cis:res.result[i].cis,
        }
        hotelsUl.push(hotelsLi)
      }
      this.setData({  
        hotels: hotelsUl
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  onShow: function () {

  },
  hotelsDetailed(e){
    //存储到缓存
    console.log(e.currentTarget.dataset)
    wx.setStorageSync("hotel", this.data.hotels[e.currentTarget.dataset.arr])
    //跳转
    wx.navigateTo({
      url: "../hotelsDetailed/hotelsDetailed"
    })
  }
})