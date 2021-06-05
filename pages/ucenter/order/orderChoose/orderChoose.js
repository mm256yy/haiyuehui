let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    hotel:{
      arr:'',
      dep:'',
      hotelId:'',
      rmtype:'',
      orderId:'',
      roomNo:'',
      roomPitch:'',
    },
    floorThree:[
      // {floor:'02',roomNum:12},
      // {floor:'02',roomNum:12},
    ],
    screenUl:[
      // {val:false,code:'NE',name:'靠近电梯'},
    ],
    checkboxUl:[],
    popShow:false,
  },

  onLoad: function (options) {
    this.funHotel(options);
    this.funfeature();
    this.funFloor();
  },
  onShow: function () {},
  //获取酒店信息
  funHotel(options){
    let roomNoNew = (options.roomNo == "null"?'':options.roomNo)
    let hotelNew = {
      arr:options.arr,
      dep:options.dep,
      hotelId:options.hotelId,
      rmtype:options.rmtype,
      orderId:options.orderId,
      roomNo:roomNoNew,
      roomPitch:roomNoNew,
    };
    this.setData({
      hotel:hotelNew,
    })
  },
  //初始获取房间类型
  funfeature(){
    let param = {
      hotelId:this.data.hotel.hotelId,
      type:2,
    }
    util.request(api.UcenterSystemBaseCodeType ,param, 'GET').then(res => {
      let screenUlNew = [];
      let screen_li = {};
      let data = res.result;
      for(let i=0;i<data.length;i++){
        screen_li = {
          val:false,
          code:data[i].code,
          name:data[i].name
        }
        screenUlNew.push(screen_li)
      }
      this.setData({
        screenUl : screenUlNew
      })
    }).catch((err) => {});
  },
  //如果是云智住
  funFloor(){
    let featureNew = this.gainFeature()
    let param = {
      hotelid:this.data.hotel.hotelId,
      arr:this.data.hotel.arr,
      dep:this.data.hotel.dep,
      floor:'',
      feature:featureNew,
      rmtype:'SJ' //this.data.hotel.rmtype
    }
    util.request(api.UcenterOrderFloorRoomNum ,param, 'POST').then(res => {
      let floor_ul = [];
      let floor_li = {};
      for(let i=0;i<res.result.length;i++){
        floor_li = {
          floor:res.result[i].floor,
          roomNum:res.result[i].roomNum,
        }
        floor_ul.push(floor_li)
      }
      this.setData({
        floorThree:floor_ul
      })
    }).catch((err) => {});
  },
  //pop
  hidePop(){
    this.setData({
      popShow:false
    })
  },
  showPop(){
    this.setData({
      popShow:!this.data.popShow
    })
  },
  //清空
  screenZero(){
    let screenUlNew = this.data.screenUl;
    for(let i=0;i<screenUlNew.length;i++){
      screenUlNew[i].val = false
    }
    this.setData({
      screenUl:screenUlNew,
    })
  },
  //选择类型
  screenOn(e){
    let index = e.currentTarget.dataset.index;
    let screenUlNew = this.data.screenUl;
    screenUlNew[index].val = !screenUlNew[index].val;
    this.setData({
      screenUl : screenUlNew
    })
  },
  //确定选择类型
  screenSuccess(){
    this.funFloor();
    this.hidePop();
  },
  //选择楼层
  funFloorOn(e){
    let floor = e.currentTarget.dataset.floor;
    let that = this;
    wx.navigateTo({
      url: "/pages/ucenter/order/orderReside/orderReside?arr="+that.data.hotel.arr+
      "&dep="+that.data.hotel.dep+
      "&hotelId="+that.data.hotel.hotelId+
      "&rmtype="+that.data.hotel.rmtype+
      "&orderId="+that.data.hotel.orderId+
      "&roomNo="+that.data.hotel.roomNo+
      "&floor="+floor
    })
  },
  //获取类型
  gainFeature(){
    let chooseType = '';
    let check = this.data.screenUl
    for(let i=0;i<check.length;i++){
      if(check[i].val){
        chooseType += check[i].code + ','
      }
    }
    let chooseTypeNew = chooseType.substring(0, chooseType.length - 1)
    return chooseTypeNew
  },
  roomOn(e){
    let index1 = e.currentTarget.dataset.index1;
    let index2 = e.currentTarget.dataset.index2;
    let roomImgUlNew = this.data.roomImgUl;
    let pre = this.data.roomPre;
    if(roomImgUlNew[index1][index2].type!=1){
      return false;
    }
    if(pre[0]||pre[0] == 0){
      roomImgUlNew[pre[0]][pre[1]].class = "room_type_room"
      roomImgUlNew[index1][index2].class = "room_type_room_on"
    }else{
      roomImgUlNew[index1][index2].class = "room_type_room_on"
    }
    pre[0] = index1;pre[1] = index2;
    console.log(roomImgUlNew)
    console.log(pre)
    this.setData({
      roomImgUl:roomImgUlNew,
      roomPre:pre,
      'hotel.roomPitch':roomImgUlNew[index1][index2].room
    })
  },
})