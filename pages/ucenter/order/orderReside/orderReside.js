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
    menuUl:[
      {name:"选择房间"},
      {name:"实名认证"},
      {name:"实人认证"},
      {name:"完成登记"},
    ],
    menuChoose:0,
    roomImgUl:[
      // [
      //   {type:1,room:'1101',class:'room_type_room',img:''},
      //   {type:2,room:'',class:'room_type_stairs',img:'/static/images/room_safe.png'},
      //   {type:3,room:'',class:'room_type_elevator',img:'/static/images/room_elevator.png'},
      // ],
      // [
      //   {type:1,room:'1101',class:'room_type_room',img:''},
      //   {type:0,room:'',class:'room_type_nothing',img:''},
      //   {type:5,room:'',class:'room_type_occupy',img:''},
      // ],
    ],
    roomPre:[],
    info:{
      name:'',
      identity:'',
      mobile:'',
      file:'',
    },
  },
  onLoad: function (options) {
    this.ctx = wx.createCameraContext()
    this.funHotel(options);
    this.roomImg();
  },
  onShow: function () {
    this.substitution()
  },
  //加载hotel参数
  funHotel(options){
    let roomNoNew = (options.roomNo?options.roomNo:'')
    // let hotelNew = {
    //   arr:'2020-09-28',
    //   dep:'2020-09-29',
    //   hotelId:'H000001',
    //   rmtype:"KFT",//"TFT",
    //   orderId:222222,
    //   roomNo:'',
    //   floor:22,
    //   roomPitch:'',
    // };
    let hotelNew = {
      arr:options.arr,
      dep:options.dep,
      hotelId:options.hotelId,
      rmtype:api.testing?options.rmtype:options.rmtype,
      orderId:options.orderId, 
      roomNo:roomNoNew,
      floor:api.testing?options.floor:options.floor,
      roomPitch:roomNoNew,
    };
    let menuChoose = 0
    if(roomNoNew == ''){
      menuChoose = 0
    }else{
      menuChoose = 1
    }
    this.setData({
      hotel:hotelNew,
      menuChoose:menuChoose,
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
    util.request(api.UcenterOrderFloorRoomPosition ,param, 'POST').then(res => {
      let data = res.result;
      let x_ul = [];let y_ul = [];let y_li = {};
      if(data.rooms){
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
  //拍照识别
  park(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.upload(that, tempFilePaths)
      }
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
  
  //下一步/办理入住
  resideBtn(){
    var that = this;
    let choose = this.data.menuChoose
    if(choose < 3){
      if(choose == 0){
        let roomNoNew = (this.data.hotel.roomPitch == ''?this.data.hotel.roomNo:this.data.hotel.roomPitch)
        if(roomNoNew == ''){
          check.showErrorToast('请选择房间')
          return false
        }
        this.setData({
          menuChoose : choose + 1
        })
      }else if(choose == 1){
        if(!check.checkName(that.data.info.name)){return false}
        if(!check.checkIdentity(that.data.info.identity)){return false}
        if(!check.checkMobile(that.data.info.mobile)){return false}
        wx.showModal({ 
          title: '办理入住',
          content: '请确认入住信息填写正确无误',
          success: function(resV) {
            if (resV.confirm) {
              console.log('用户点击确定')
              that.setData({
                menuChoose : choose + 1
              })
            } else if (resV.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }else if(choose == 2){
        this.ctx.takePhoto({
          quality: 'high',
          success: (res) => {
            console.log(res)
            var tempImagePath = res.tempImagePath;
            that.Imgupload(that, tempImagePath)
          }
        })
      }
    }else{
      that.infoBtnFrist()
    }
  },
  
  //办理入住
  infoBtnFrist(){
    let roomNoNew = (this.data.hotel.roomPitch == ''?this.data.hotel.roomNo:this.data.hotel.roomPitch)
    let param = {
      orderId:this.data.hotel.orderId,
      roomNo:roomNoNew,
      name:this.data.info.name,
      ident:this.data.info.identity,
      mobile:this.data.info.mobile
    }
    util.request(api.UcenterOrderCheckin , param , 'POST').then(res => {
      wx.showToast({title: "入住成功" ,image:'/static/images/icon_success.png'})
      wx.navigateBack({
        delta: 2  
      })
    }).catch((err) => {});
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
  upload(page, path) {
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: api.UcenterOrderPark,
      filePath: path[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //上传成功返回数据
        let data = JSON.parse(res.data)
        if (data.code == 0) {
          check.showSuccessToast("上传成功")
          that.setData({
            'info.name':data.result.name,
            'info.identity':data.result.idNo,
          })
        }else{
          check.showErrorToast("上传失败");
          return;
        }
      },
      fail: function (e) {
        console.log(e);
        check.showErrorToast("上传失败");
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },
  Imgupload(page, path) {
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: api.SystemUpload,
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //上传成功返回数据
        let data = JSON.parse(res.data)
        if (data.code == 0) {
          that.setData({
            'info.file':data.result
          })
          let roomNoNew = (that.data.hotel.roomPitch == ''?that.data.hotel.roomNo:that.data.hotel.roomPitch)
          let url = api.UcenterOrderCheckPerson +'?orderId='+ that.data.hotel.orderId
          + '&roomNo=' + roomNoNew
          + '&name=' + that.data.info.name
          + '&ident=' + that.data.info.identity
          + '&mobile=' + that.data.info.mobile
          + '&filePath=' + data.result
          util.requestPOST( url , 'POST').then(res => {
            check.showSuccessToast("上传成功")
            that.setData({
              menuChoose : 3
            })
          }).catch((err) => {});
        }else{
          check.showErrorToast("上传失败");
          return;
        }
      },
      fail: function (e) {
        console.log(e);
        check.showErrorToast("上传失败");
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },
})
