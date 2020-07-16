let map = require('../../../utils/map.js');
Page({
  data: {
    longitude:0,
    latitude:0,
    markers: [
      // {
      //   id: 0,
      //   latitude: 30.328038,
      //   longitude: 120.122213,
      //   width: 30,
      //   height: 30,
      //   iconPath: "/static/images/logo.png",
      //   label:{
      //     content:'杭州海外海国际酒店',
      //     color:'#000000AA',
      //     bgColor:'#ffffffAA',
      //     padding:5,
      //   },
      // }
    ],
  },
  onLoad: function (options) {
    let arr = 0;
    if(options.hotelId){
      arr = parseInt(options.hotelId.split("0")[5])-1
    }
    
    this.setData({
      longitude:map.mapMarkers[arr].longitude||120.122213,
      latitude:map.mapMarkers[arr].latitude||30.328038,
      markers : map.mapMarkers
    })
  }
  // regionchange(e) {
  //   console.log(e.type)
  // },
  // markertap(e) {
  //   console.log(e.detail.markerId)
  // },
  // controltap(e) {
  //   console.log(e.detail.controlId)
  // }
})