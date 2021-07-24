let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let user = require('../../../../utils/user.js');
let pay = require('../../../../utils/pay.js');
let app = getApp();
Page({
  data: {
    detail:{
      status:31,
      hotelId:0,
      hotelName:'',
      rmtype:"",
      roomNo:'',
      startTimeS:'',
      endTimeS:'',
      rmdesc:'',
      orderId:0,
      orderNo:0,
      contactsName:'',
      contactsTel:'',
      isCis:false,
      isOverdue:null,  //是否超时
      canStay:false,   //是否可以入住
      otaId:'',  //ota订单
      otaRestype:'',  //ota类型
    },
    personUl:[
      /*{    
        orderId:'4564564654',
        name:"徐顺望",
        ident:"330327199001019876",
        identS:'***',
        seeIdent:false,
      }*/
    ],
    additionUl:[
      /*{
        orderId:'123456',
        rmdesc:'',
        time:'2020-08-16至2020-08-19',
        status:11,
        subtotal:20000,
        detailsShow:false,
        coupon:0,
        discount:100,
        wayWx:0,
        wayBalance:0,
      }*/
    ],
    total:{
      roomPrice:0,
      deposit:0,
      addition:0,
      surplus:0,  //优惠劵+津贴
      coupon:0,
      allowanceMoney:0,
      discount:100,
      money:0,
      wayWx:0,
      wayBalance:0,
    },
    pwdVal:123456,
    pwdValS:'******',
    pwdSeeIdent:false,
    allowConnect:0, //0 不允许 1 允许
    datePrices:[
      {date:'2020-09-11',price:2200},
      {date:'2020-09-11',price:2200},
    ],  //日历房
    datePricesShow:false,
  },
  onLoad(options) {
    this.init(options)
  },
  onReady() {
  },
  onShow() {
    this.orderList();
    //退出页面时把密码删除
    app.globalData.orderPwd = "";
  },
  //初始化
  init(options){
    this.setData({
      'detail.orderId':options.orderId
    })
  },
  //获取订单列表
  orderList(){
    let param = {
      orderId:this.data.detail.orderId
    }
    util.request(api.UcenterOrderDetail ,param, 'GET').then(res => {
      let data = res.result;
      let detailNew = {},personUlNew = [],totalNew = {};
      detailNew = {
        status:data.status,
        hotelId:data.hotelId,
        hotelName:data.hotelName,
        rmtype:data.rmtype,
        roomNo:data.roomNo?data.roomNo:'',
        startTimeS:data.arr,
        endTimeS:data.dep,
        rmdesc:data.rmdesc,
        orderId:this.data.detail.orderId,
        orderNo:data.orderNo,
        contactsName:data.name,
        contactsTel:data.mobile?data.mobile:'',
        isCis:data.isCis,
        isOverdue:(check.checkIsOverdue(data.dep) < 0),
        canStay:(check.checkIsOverdue(data.arr) === 0),
        otaId:data.otaId?data.otaId:'',
        otaRestype:data.otaRestype?data.otaRestype:'',
      }
      let dayNum = (new Date(data.dep) - new Date(data.arr))/1000/60/60/24;
      //日历房
      let datePricesNew = [];
      let datePricesLi = {};
      let roomPriceNew = 0;
      if(data.datePrices.length > 0){
        for(let i=0;i<data.datePrices.length;i++){
          roomPriceNew += data.datePrices[i].price
          datePricesLi = {
            date:data.datePrices[i].date,
            price:data.datePrices[i].price
          }
          datePricesNew.push(datePricesLi)
        }
      }else{
        roomPriceNew = data.roomPrice*dayNum
      }
      //总额
      let orderPayInfo = {};
      let orderPayInfoNew = {
        discount:100,   
        balance:0,
        allowanceMoney:0,
      };
      if(data.orderPayInfo){
        orderPayInfo = data.orderPayInfo;
      }else{
        orderPayInfo = orderPayInfoNew;
      }
      totalNew = {
        roomPrice:roomPriceNew,
        deposit:data.deposit,
        addition:0,   //续住
        surplus:0,
        coupon:(data.subtractMoney?data.subtractMoney:0),
        allowanceMoney:(orderPayInfo.allowanceMoney?orderPayInfo.allowanceMoney:0),
        discount:orderPayInfo.discount,
        money:data.money,
        wayWx:(data.money-orderPayInfo.balance),
        wayBalance:orderPayInfo.balance,
      }
      //人员
      let personsUL = [];
      let personsLi = {};
      if(data.persons != null){
        for(let i=0;i<data.persons.length;i++){
          personsLi = {    
            orderId:data.persons[i].id,
            name:data.persons[i].name,
            ident:data.persons[i].ident,
            identS:util.identityCard(data.persons[i].ident),
            seeIdent:false,
          }
          personsUL.push(personsLi)
        }
      }
      personUlNew = personsUL;
      
      this.setData({
        detail:detailNew,
        personUl:personUlNew,
        total:totalNew,
        allowConnect:data.allowConnect,
        datePrices:datePricesNew,
      })
      this.member();
      // this.addDaysList(); //续租
    }).catch((err) => {});
  },
  //会员信息
  member(){
    let type = this.data.detail.status;
    let ota = this.data.detail.otaId;
    let surplusPass = 0;
    let discountPass = 100;
    if((type == 11||type == 12||type == 13||type == 21)&&(ota == "")){
      user.memberGetInfoStorage().then(res => {
        let couponNew = Math.round(this.data.total.roomPrice-((this.data.total.money-this.data.total.deposit)/(res.result.discount/100)))
        if(couponNew<0){ //兼容过去订单
          surplusPass = 0;
          discountPass = 100;
        }else{
          surplusPass = couponNew;
          discountPass = (res.result.discount?res.result.discount:100);
        }
        this.setData({
          'total.surplus':surplusPass,
          'total.discount':discountPass,
        });
      }).catch((err) => {
        console.log(err)
      });
    }
  },
  //获取续住列表
  addDaysList(){
    let param = {
      orderId:this.data.detail.orderId
    }
    util.request(api.UcenterAddDaysList ,param, 'GET').then(res => {
      let additionUlNew = [],additionliNew = {},additionMoney = 0;
      for(let i=0;i<res.result.length;i++){
        additionliNew = {
          orderId:res.result[i].id,
          rmdesc:res.result[i].rmdesc,
          time:this.TimeR(res.result[i].inDay)+'至'+this.TimeR(res.result[i].outDay),
          status:res.result[i].status,
          subtotal:res.result[i].money,
          detailsShow:false,
          coupon:0,
          discount:100,
          wayWx:0,
          wayBalance:0,
        }
        additionUlNew.push(additionliNew);
        if(res.result[i].status == 25){
          additionMoney = additionMoney + res.result[i].money
        }
      }
      this.setData({
        additionUl:additionUlNew,
        'total.addition':additionMoney,
        'total.money':additionMoney+this.data.total.money,
      })
    }).catch((err) => {});
  },
  //续租订单支付
  perpay(e){
    let index = e.currentTarget.dataset.index;
    //
    wx.redirectTo({
      url: "/pages/customized/pay/pay?money="+this.data.additionUl[index].subtotal+"&orderId="+this.data.additionUl[index].orderId+"&rmdesc="+this.data.additionUl[index].rmdesc
    })
  },
  //复制
  copy(e){
    let allowConnectNew = null;
    if(this.data.allowConnect == 0){
      allowConnectNew = 1;
    }else{
      allowConnectNew = 0;
    }
    let param = {
      orderId:this.data.detail.orderId,
      allowConnect:allowConnectNew,
    }
    console.log(param)
    util.request(api.UcenterOrderAllowConnect , param , 'GET').then(res => {
      if(allowConnectNew == 1){
        wx.setClipboardData({
          data: e.currentTarget.dataset.text,
          success: function (res) {
          }
        })
      }
      this.setData({
        allowConnect : allowConnectNew
      })
    }).catch((err) => {});
  },
  shareCopy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.text.substring(0,14),
      success: function (res) {
      }
    })
  },
  //分享同住人
  onShareAppMessage(){
    return {
      title: '邀请你来入住酒店啦',
      imageUrl:'/static/images/invite.jpg',//图片地址
      path:"/pages/ucenter/order/orderAddition/orderAddition?orderId="+this.data.detail.orderId+"&additionType=2&hotelId="+this.data.detail.hotelId+"&roomNo="+this.data.detail.roomNo,// 用户点击首先进入的当前页面
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
  },
  //取消订单
  orderCancel(e){
    let orderId = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: "../orderCancel/orderCancel?orderId="+orderId+"&pay=1"
    })
  },
  //点击办理入住
  goOrderChoose(){
    let that = this;
    /*申请调用*/
    wx.requestSubscribeMessage({
      tmplIds: ['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'],
      success (res) {
        if(res['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'] == "accept"){
          console.log(that.data.detail.roomNo)
          if(that.data.detail.roomNo == ''){
            wx.navigateTo({
              url: "/pages/ucenter/order/orderChoose/orderChoose?arr="+that.data.detail.startTimeS+
              "&dep="+that.data.detail.endTimeS+
              "&hotelId="+that.data.detail.hotelId+
              "&rmtype="+that.data.detail.rmtype+
              "&orderId="+that.data.detail.orderId+
              "&roomNo="+that.data.detail.roomNo
              // url: "/pages/ucenter/order/orderReside/orderReside?arr="+that.data.detail.startTimeS+
              // "&dep="+that.data.detail.endTimeS+
              // "&hotelId="+that.data.detail.hotelId+
              // "&rmtype="+that.data.detail.rmtype+
              // "&orderId="+that.data.detail.orderId+
              // "&roomNo="+that.data.detail.roomNo+
              // "&floor=22"
            })
          }else{
            wx.navigateTo({
              url: "/pages/ucenter/order/orderReside/orderReside?arr="+that.data.detail.startTimeS+
              "&dep="+that.data.detail.endTimeS+
              "&hotelId="+that.data.detail.hotelId+
              "&rmtype="+that.data.detail.rmtype+
              "&orderId="+that.data.detail.orderId+
              "&roomNo="+that.data.detail.roomNo
            })
          }
          
        }else if(res['6THD8pL9Vii7LJ6UV3B6TUfTUDujUhZeC9B-jEJ0eFo'] == "reject"){
          wx.showModal({title: '错误信息',content: "请确认退房通知提醒",showCancel: false});
        }else{
          wx.showModal({title: '错误信息',content: "请联系前台处理",showCancel: false});
        }
      }
    })
  },
  //添加同住人/访客  0 同住人 1 访客
  goOrderAddition(e){
    let additionType = e.currentTarget.dataset.type
    wx.navigateTo({
      url: "/pages/ucenter/order/orderAddition/orderAddition?orderId="+this.data.detail.orderId+"&additionType="+additionType+"&hotelId="+this.data.detail.hotelId+"&roomNo="+this.data.detail.roomNo
    })
  },
  //订单明细显示
  funDatePricesShow(){
    this.setData({
      datePricesShow:!this.data.datePricesShow
    })
  },
  //显示隐藏身份证号码
  see(e){
    let index = e.currentTarget.dataset.index;
    let personUlNew = this.data.personUl
    if(!personUlNew[index].seeIdent){   //不可见
      personUlNew[index].identS = this.data.personUl[index].ident
      personUlNew[index].seeIdent = true;
    }else{  //可见
      personUlNew[index].identS = util.identityCard(this.data.personUl[index].ident)
      personUlNew[index].seeIdent = false;
    }
    this.setData({
      personUl : personUlNew
    })
    
  },
  //密码的显示
  pwd(){
    let pwdValNew = "";
    if(!this.data.pwdSeeIdent){ //不显示
      //pwdValNew = this.data.pwdVal;
      console.log(app.globalData.orderPwd)
      if(app.globalData.orderPwd != undefined && app.globalData.orderPwd != 'undefined' && app.globalData.orderPwd != ""){  //判断是否有存密码(将会在退出页面删除)
        pwdValNew = app.globalData.orderPwd
      }else{
        let param = {
          orderId:this.data.detail.orderId,
        }
        console.log(param)
        util.request(api.UcenterOrderGetRoomPwd , param , 'GET').then(res => {
          pwdValNew = res.result
          app.globalData.orderPwd = pwdValNew
          this.setData({
            pwdValS : pwdValNew,
          })
        }).catch((err) => {});
      }
    }else{
      pwdValNew = "******"
    }
    this.setData({
      pwdValS : pwdValNew,
      pwdSeeIdent : !this.data.pwdSeeIdent
    })
  },
  //时间转换
  TimeR(val){
    let arr = val.toString().split("");
    return arr[0]+arr[1]+arr[2]+arr[3]+"-"+arr[4]+arr[5]+"-"+arr[6]+arr[7]
  },
})