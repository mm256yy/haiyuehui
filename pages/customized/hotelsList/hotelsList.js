let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
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
      for(let i=0;i<res.result.length;i++){
        hotelsLi = {
          id:res.result[i].id,
          name:res.result[i].name,
          img:res.result[i].imgList != null?res.result[i].imgList[0]:'/static/images/banner2.jpg',
          address:res.result[i].address,
          deposit:res.result[i].deposit,
          tel:res.result[i].tel,
          cis:res.result[i].cis,
          imgList:res.result[i].imgList,
        }
        hotelsUl.push(hotelsLi)
      }
      this.setData({  
        hotels: hotelsUl
      })
    }).catch((err) => {});
  },
  onShow: function () {

  },
  hotelsDetailed(e){
    let hotelVal = this.data.hotels[e.currentTarget.dataset.arr]
    //存储到缓存
    wx.setStorageSync("hotel", hotelVal)
    //跳转
    wx.navigateTo({
      url: "../hotelsDetailed/hotelsDetailed?hotelId="+hotelVal.id
    })
  }
})