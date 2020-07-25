let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let pay = require('../../../../utils/pay.js');
let app = getApp();
Page({
  data: {
    detail:{
      status:31,
      statusS:'',
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
      canStay:false,
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
        statusS:'状态',
        subtotal:20000,
        subtotalS:'200.00',
        detailsShow:false,
        coupon:0,
        couponS:'0.00',
        discount:100,
        discountS:10,
        wayWx:0,
        wayWxS:'0.00',
        wayBalance:0,
        wayBalanceS:'0.00',
      }*/
    ],
    money:{
      roomPrice:0,
      roomPriceS:'0.00',
      deposit:0,
      depositS:'0.00',
      addition:0,
      additionS:'0.00',
      coupon:0,
      couponS:'0.00',
      discount:100,
      discountS:10,
      total:0,
      totalS:'0.00',
      wayWx:0,
      wayWxS:'0.00',
      wayBalance:0,
      wayBalanceS:'0.00',
    },
    pwdVal:123456,
    pwdValS:'******',
    pwdSeeIdent:false,
    allowConnect:0, //0 不允许 1 允许
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
  //点击转发按钮
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: '邀请你来入住酒店啦',
      imageUrl:'/static/images/invite.png',//图片地址
      path:"/pages/ucenter/order/orderAddition/orderAddition?orderId="+this.data.detail.orderId+"&additionType=0&hotelId="+this.data.detail.hotelId+"&roomNo="+this.data.detail.roomNo,
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
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
      let detailNew = {},personUlNew = [],moneyNew = {};
      detailNew = {
        status:data.status,
        statusS:util.orderType(data.status),
        hotelId:data.hotelId,
        hotelName:data.hotelName,
        rmtype:data.rmtype,
        roomNo:data.roomNo,
        startTimeS:data.arr,
        endTimeS:data.dep,
        rmdesc:data.rmdesc,
        orderId:this.data.detail.orderId,
        orderNo:data.orderNo,
        contactsName:data.name,
        contactsTel:data.mobile,
        isCis:data.isCis,
        isOverdue:(check.checkIsOverdue(data.dep) < 0),
        canStay:(check.checkIsOverdue(data.arr) === 0)
      }
      let dayNum = (new Date(data.dep) - new Date(data.arr))/1000/60/60/24;
      let orderPayInfoNew = {
        discount:0,   
        balance:0,
      };
      moneyNew = {
        roomPrice:data.roomPrice*dayNum,
        roomPriceS:(data.roomPrice/100*dayNum).toFixed(2),
        deposit:data.deposit,
        depositS:(data.deposit/100).toFixed(2),
        addition:0,   //续住
        additionS:'0.00',
        coupon:data.subtractMoney?data.subtractMoney:0,
        couponS:((data.subtractMoney?data.subtractMoney:0)/100).toFixed(2),
        discount:data.orderPayInfo.discount,
        discountS:(data.orderPayInfo.discount/10).toFixed(1),
        total:data.money,
        totalS:(data.money/100).toFixed(2),
        wayWx:(data.money-data.orderPayInfo.balance),
        wayWxS:((data.money-data.orderPayInfo.balance)/100).toFixed(2),
        wayBalance:data.orderPayInfo.balance,
        wayBalanceS:(data.orderPayInfo.balance/100).toFixed(2),
      }
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
      console.log(detailNew)
      this.setData({
        detail:detailNew,
        personUl:personUlNew,
        money:moneyNew,
        allowConnect:data.allowConnect
      })
      this.addDaysList();
    }).catch((err) => {
      console.log(err)
      // wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
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
          statusS:util.orderType(res.result[i].status),
          subtotal:res.result[i].money,
          subtotalS:(res.result[i].money/100).toFixed(2),
          detailsShow:false,
          coupon:0,
          couponS:'0.00',
          discount:100,
          discountS:10,
          wayWx:0,
          wayWxS:'0.00',
          wayBalance:0,
          wayBalanceS:'0.00',
        }
        additionUlNew.push(additionliNew);
        if(res.result[i].status == 25){
          additionMoney = additionMoney + res.result[i].money
        }
      }
      this.setData({
        additionUl:additionUlNew,
        'money.addition':additionMoney,
        'money.additionS':(additionMoney/100).toFixed(2),
        'money.total':additionMoney+this.data.money.total,
        'money.totalS':((additionMoney+this.data.money.total)/100).toFixed(2),
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //续租订单支付
  perpay(e){
    let index = e.currentTarget.dataset.index;
    let param = {
      orderId:this.data.additionUl[index].orderId,
      rmdesc:this.data.additionUl[index].rmdesc,
    }
    console.log(param)
    pay.usePay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result=1&end=0"
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "/pages/customized/payResult/payResult?result=0&end=0"
      })
    });
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
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
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
          wx.navigateTo({
            url: "../orderChoose/orderChoose?arr="+that.data.detail.startTimeS+"&dep="+that.data.detail.endTimeS+"&hotelId="+that.data.detail.hotelId+"&rmtype="+that.data.detail.rmtype+"&orderId="+that.data.detail.orderId
          })
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
      url: "../orderAddition/orderAddition?orderId="+this.data.detail.orderId+"&additionType="+additionType+"&hotelId="+this.data.detail.hotelId+"&roomNo="+this.data.detail.roomNo
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
        }).catch((err) => {
          wx.showModal({title: '错误信息',content: err,showCancel: false}); 
        });
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