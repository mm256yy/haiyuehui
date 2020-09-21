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
      floor:'',
      roomPitch:'',
    },
    roomImgUl:[
      [
        {type:1,room:'1101',class:'room_type_room',img:''},
        {type:2,room:'',class:'room_type_stairs',img:'/static/images/room_safe.png'},
        {type:3,room:'',class:'room_type_elevator',img:'/static/images/room_elevator.png'},
      ],
      [
        {type:1,room:'1101',class:'room_type_room',img:''},
        {type:0,room:'',class:'room_type_nothing',img:''},
        {type:5,room:'',class:'room_type_occupy',img:''},
      ],
    ],
    roomPre:[],
    info:{
      name:'',
      identity:'',
      mobile:'',
    },
  },
  onLoad: function (options) {
    this.funHotel(options);
    this.roomImg();
  },
  onShow: function () {
    this.substitution()
  },
  //加载hotel参数
  funHotel(options){
    console.log(options)
    let roomNoNew = ((options.roomNo == ''||!options.roomNo)?'':options.roomNo)
    let hotelNew = {
      arr:options.arr,
      dep:options.dep,
      hotelId:options.hotelId,
      rmtype:api.testing?'SJ':options.rmtype,
      orderId:options.orderId,
      roomNo:roomNoNew,
      floor:api.testing?'07':22,//options.floor,
      roomPitch:roomNoNew,
    };
    this.setData({
      hotel:hotelNew,
    })
  },
  //生成房间图
  roomImg(){
    let param = {
      hotelid:this.data.hotel.hotelId,
      arr:this.data.hotel.arr,
      dep:this.data.hotel.dep,
      floor:this.data.hotel.floor,
      rmtype:this.data.hotel.rmtype
    }
    console.log(param)
    util.request(api.UcenterOrderFloorRoomPosition ,param, 'POST').then(res => {
      let data = res.result;
      let x_ul = [];let y_ul = [];let y_li = {};
      for(let i=0;i<data.ynum;i++){
        for(let j=0;j<data.xnum;j++){
          y_li = {
            type:0,
            room:'',
            class:'room_type_aisle',
            img:''
          }
          y_ul.push(y_li)
        }
        x_ul.push(y_ul);
        y_ul = [];
      }
      let x_arr = null;let y_arr = null;
      for(let z=0;z<data.rooms.length;z++){
        x_arr = data.rooms[z].x;
        y_arr = data.rooms[z].y;
        if(data.rooms[z].roomNo == 'elevator'){
          x_ul[y_arr][x_arr] = {
            type:3,
            room:'',
            class:'room_type_elevator',
            img:'/static/images/room_elevator.png'
          }
        }else if(data.rooms[z].roomNo == 'safe'){
          x_ul[y_arr][x_arr] = {
            type:2,
            room:'',
            class:'room_type_stairs',
            img:'/static/images/room_safe.png'
          }
        }else if(data.rooms[z].roomNo == 'wall'){
          x_ul[y_arr][x_arr] = {
            type:0,
            room:'',
            class:'room_type_nothing',
            img:''
          }
        }else if(data.rooms[z].roomNo == 'other'){
          x_ul[y_arr][x_arr] = {
            type:6,
            room:'',
            class:'room_type_other',
            img:''
          }
        }else if(data.rooms[z].roomNo&&data.rooms[z].available == 0){
          x_ul[y_arr][x_arr] = {
            type:5,
            room:data.rooms[z].roomNo,
            class:'room_type_occupy',
            img:''
          }
        }else if(data.rooms[z].roomNo&&data.rooms[z].available == 1){
          x_ul[y_arr][x_arr] = {
            type:1,
            room:data.rooms[z].roomNo,
            class:'room_type_room',
            img:''
          }
        }else{
          x_ul[y_arr][x_arr] = {
            type:4,
            room:data.rooms[z].roomNo,
            class:'',
            img:''
          }
        }
      }
      this.setData({
        roomImgUl:x_ul
      })
    }).catch((err) => {});  
  },
  //常住人换人
  substitution(){
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    this.setData({
      'info.name':currPage.data.info.name,
      'info.identity':currPage.data.info.identity,
      'info.mobile':currPage.data.info.mobile,
    })
  },
  //常住人点击
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
  //房间选择
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
      roomImgUlNew[pre[0]][pre[1]].img = ""
      roomImgUlNew[index1][index2].class = "room_type_room_on"
      roomImgUlNew[index1][index2].img = "/static/images/room_live.png"
    }else{
      roomImgUlNew[index1][index2].class = "room_type_room_on"
      roomImgUlNew[index1][index2].img = "/static/images/room_live.png"
    }
    pre[0] = index1;pre[1] = index2;
    this.setData({
      roomImgUl:roomImgUlNew,
      roomPre:pre,
      'hotel.roomPitch':roomImgUlNew[index1][index2].room
    })
  },
  //input
  bindNameInput(e){
    this.setData({
      'info.name': e.detail.value
    });
  },
  bindIdentityInput(e){
    this.setData({
      'info.identity': e.detail.value
    });
  },
  bindTelInput(e){
    this.setData({
      'info.mobile': e.detail.value
    });
  },
  //办理入住
  infoBtnFrist(){
    if(!check.checkName(this.data.info.name)){return false}
    if(!check.checkIdentity(this.data.info.identity)){return false}
    if(!check.checkMobile(this.data.info.mobile)){return false}
    let roomNoNew = (this.data.hotel.roomPitch == ''?this.data.hotel.roomNo:this.data.hotel.roomPitch)
    if(roomNoNew == ''){
      wx.showToast({title: '房间号为空',image:'/static/images/icon_error.png'})
      return false;
    }
    let param = {
      orderId:this.data.hotel.orderId,
      roomNo:roomNoNew,
      name:this.data.info.name,
      ident:this.data.info.identity,
      mobile:this.data.info.mobile
    }
    wx.showModal({ 
      title: '办理入住',
      content: '请确认入住信息填写正确无误',
      success: function(resV) {
        if (resV.confirm) {
          console.log('用户点击确定')
          util.request(api.UcenterOrderCheckin , param , 'POST').then(res => {
            wx.showToast({title: "入住成功" ,image:'/static/images/icon_success.png'})
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          }).catch((err) => {});
        } else if (resV.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})