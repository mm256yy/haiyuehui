var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({
  data: {
    hotels:[
      /*{id:'0',name:"酒店1",img:"../../../static/images/hotels1.jpg",address:"address",tel:'15967125243',deposit:20000}*/
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
            img:'../../../static/images/hotels'+i+'.jpg',
            address:res.result[i].address,
            deposit:res.result[i].deposit,
            tel:res.result[i].tel
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
    /*let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[ pages.length - 2 ];  
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      hotelsId:e.currentTarget.dataset.id,
      hotelsName : e.currentTarget.dataset.name
    })
    //跳转
    wx.navigateBack({
        delta: 1  // 返回上一级页面。
    })*/
    //存储到缓存
    console.log(e.currentTarget.dataset)
    wx.setStorageSync("hotel", this.data.hotels[e.currentTarget.dataset.arr])
    //跳转
    wx.navigateTo({
      url: "../hotelsDetailed/hotelsDetailed"
    })
  }
})