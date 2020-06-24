// pages/ucenter/orderChoose/orderChoose.js
let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    hotel:{
      arr:'',
      dep:'',
      hotelId:'',
      rmtype:'',
      orderId:''
    },
    floorUl: [
      {code:'',name:'全部楼层'},
      {code:'22',name:'22层'},
      /*{code:'02',name:'2F'}*/
    ],
    checkboxUl:[
      /*{val:false,code:'NE',name:'靠近电梯'},
      {val:false,code:'NE',name:'靠近电梯'},*/
    ],
    chooseNum:2,   //入住顺序
    floorArr:0,    //楼层顺序
    floorVal:'',   //选中楼层
    roomUl:[
      /*{
        roomNo:11003,
        isCis:true
      },
      {
        roomNo:12002,
        isCis:false
      }*/
    ],     //房间列表
    roomArr:0,
    info:{
      name:'',
      identity:'',
      mobile:'',
      room:''
    }
  },

  onLoad: function (options) {
    this.init(options)
  },
  onReady: function () {

  },
  onShow: function () {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    console.log(currPage.data.info)  // data中会含有testdata
    this.setData({
      'info.name':currPage.data.info.name,
      'info.identity':currPage.data.info.identity,
      'info.mobile':currPage.data.info.mobile,
    })
  },
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
  onHide: function () {

  },
  init(options){
    console.log(options)
    let floorUlNew = [{code:'',name:'全部楼层'}];
    let checkboxUlNew = [];
    let li = {};
    //post
    let param = {
      hotelId:options.hotelId
    }
    util.request(api.UcenterSystemBaseCode ,param, 'GET').then(res => {
      console.log(res)
      let data = res.result
      if (res.status.code === 0) {
        for(let i=0;i<data.length;i++){
          if(data[i].type == 1){  //楼层
            li = {
              code:data[i].code,
              name:data[i].name
            };
            floorUlNew.push(li)
          }else{  //类型
            li = {
              val:false,
              code:data[i].code,
              name:data[i].name
            };
            checkboxUlNew.push(li)
          }
        }
        console.log(checkboxUlNew)
        this.setData({
          /*floorUl:floorUlNew,*/
          checkboxUl:checkboxUlNew
        })
      }
    }).catch((err) => {
      console.log(err)
    });
    //获取酒店信息
    let hotelNew = {
      arr:options.arr,
      dep:options.dep,
      hotelId:options.hotelId,
      rmtype:options.rmtype,
      orderId:options.orderId
    };
    this.setData({
      hotel:hotelNew
    })
  },
  //选择类型
  option(e){
    let index = e.currentTarget.dataset.index;
    let checkboxUlNew = this.data.checkboxUl;
    checkboxUlNew[index].val = !checkboxUlNew[index].val;
    this.setData({
      checkboxUl : checkboxUlNew
    })
  },
  //选择楼层
  bindChange(e){
    this.setData({
      floorArr: e.detail.value
    })
  },
  //查询
  query(){
    //获取类型
    let chooseType = '';
    let check = this.data.checkboxUl
    for(let i=0;i<check.length;i++){
      if(check[i].val){
        chooseType += check[i].code + ','
      }
    }
    //post
    let param = {
      hotelid:this.data.hotel.hotelId,
      arr:this.data.hotel.arr,
      dep:this.data.hotel.dep,
      floor:22,//this.data.floorUl[this.data.floorArr].code,
      feature:chooseType.substring(0, chooseType.length - 1),
      rmtype:this.data.hotel.rmtype
    }
    console.log(param)
    util.request(api.UcenterMoveInto ,param, 'POST').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        if(res.result.length == 0){  //没有房间
          wx.showModal({title: '查询',content: '并没有查询到要求类型的房间',showCancel: false});
        }else{ //有房间
          this.setData({
            chooseNum:2,
            roomUl:res.result,
            'info.room':res.result[0],
          })
        }
      }
    }).catch((err) => {
      console.log(err)
    });
  },
  //选择房间
  roomChoose(e){
    console.log(e)
    this.setData({
      roomArr: e.currentTarget.dataset.index,
      'info.room':this.data.roomUl[e.currentTarget.dataset.index]
    });

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
    if(!util.checkName(this.data.info.name)){return false}
    if(!util.checkIdentity(this.data.info.identity)){return false}
    if(!util.checkMobile(this.data.info.mobile)){return false}
    console.log(this.data.info)
    let param = {
      orderId:this.data.hotel.orderId,
      roomNo:this.data.info.room.roomNo,
      name:this.data.info.name,
      ident:this.data.info.identity,
      mobile:this.data.info.mobile
    }
    //this.onLoad(this.data.detail.orderId)
    console.log(param)
    let that = this
    wx.showModal({ //cancelColor（取消按钮的文字颜色）confirmColor（确定按钮的文字颜色）
      title: '办理入住',
      content: '请确认入住信息填写正确无误',
      success: function(resV) {
        if (resV.confirm) {
          console.log('用户点击确定')
          util.request(api.UcenterOrderCheckin , param , 'POST').then(res => {
            console.log(res)
            if (res.status.code === 0) {
              wx.showModal({ title: '成功',content: '入住成功',showCancel: false });
              wx.navigateBack({
                delta: 1  // 返回上一级页面。
              })
              console.log(this.data.hotel.orderId)

            }else{ //500
              wx.showModal({ title: '错误信息',content: res.status.message,showCancel: false });
            }
          }).catch((err) => {
            console.log(err)
          });
        } else if (resV.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  again(){
    this.setData({
      chooseNum: 1
    });
  }
})