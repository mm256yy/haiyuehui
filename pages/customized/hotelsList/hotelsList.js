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
      console.log(res)
      if (res.status.code === 0) {
        //存储用户信息
        for(let i=0;i<res.result.length;i++){
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
      }
    }).catch((err) => {
      console.log(err)
    });
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

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