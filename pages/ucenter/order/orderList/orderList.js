let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    menuUl:[
      {name:' 全部 ',val:0},
      {name:'待支付',val:1},
      {name:'待入住',val:2},
      {name:'已入住',val:3},
    ],
    orderUl:[
      /*{
        id:0,
        hotelName:'hotelName',
        status:21,
        custName:'custName',
        startTime:0,
        startTimeS:'2020-05-11',
        endTime:0,
        endTimeS:'2020-05-12',
        orderRoom:'orderRoom',
        orderPrice:60000,
        roomNo:'roomNo',
        canAdd:0,  //判断是否显示续住订单 0 隐藏 1 显示
        isCis:true,
        isOverdue:true,  //是否超时
        payMoney:0,
        otaId:'',
        pid:null, //有值为续租订单
        connected:0, //是否是接入订单
      }*/
    ],
    pageNo:1,
    menuVal:0,
  },
  onLoad: function () {
    
  },
  onShow: function () {
    this.setData({
      pageNo:1,
      menuVal:0,
    })
    this.init(0,1);
  },
  // 上拉加载
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.menuVal,2)
  },
  //初始化
  init(typeVal,pull,back){  //pull 1为初始化 2为下拉 back 1 刷新成功
    let param = {
      pageNo:this.data.pageNo,
      showType:typeVal,
      pageSize:15,
    }
    util.request(api.UcenterOrderList , param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let orderUlNew = []
      let data = res.result.records
      if(data.length != 0){ 
        for(let i=0;i<data.length;i++){
          o_li = {
            id:data[i].orderId ,
            hotelName:data[i].hotelName||'暂无获取到酒店名字',
            status:data[i].status,
            startTime:new Date(data[i].arr).getTime(),
            startTimeS:data[i].arr,
            endTime:new Date(data[i].dep).getTime(),
            endTimeS:data[i].dep,
            orderRoom:data[i].rmdesc,
            orderNum:data[i].orderId,
            orderPrice:data[i].money,
            roomNo:data[i].roomNo?data[i].roomNo:'',
            canAdd:data[i].canAdd,
            isCis:data[i].isCis,
            isOverdue:(check.checkIsOverdue(data[i].dep) < 0),
            payMoney:data[i].payMoney?data[i].payMoney:0,
            otaId:data[i].otaId?data[i].otaId:'',
            pid:data[i].pid,
            connected:data[i].connected == 1?1:0,
          }
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        orderUlNew = o_ul;
      }else{
        orderUlNew = this.data.orderUl.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        orderUl:orderUlNew,
      })
      //判断刷新
      if(back == 1){
        wx.showToast({title: "刷新成功" ,image:'/static/images/icon_success.png'})
      }
    }).catch((err) => {
      this.setData({
        orderUl:[]
      })
    });
  },
  //选择类型
  typeShow(e){
    this.setData({
      menuVal:e.currentTarget.dataset.type,
      pageNo:1
    })
    this.init(e.currentTarget.dataset.type,1)
  },
  //跳转
  orderDetail(e){
    wx.navigateTo({
      url: "/pages/ucenter/order/orderDetail/orderDetail?orderId="+e.currentTarget.dataset.orderId
    })
  },
  //取消订单
  orderCancel(e){
    let arr = e.currentTarget.dataset.index
    let pay = 0; //1 未支付  2已支付
    if(this.data.orderUl[arr].status === 11){
      pay = 1
    }else if(this.data.orderUl[arr].status === 22){
      pay = 2
    }
    wx.navigateTo({
      url: "../orderCancel/orderCancel?orderId="+e.currentTarget.dataset.orderId+"&pay="+pay
    })
  },
  // 退房
  checkout(e){
    let that = this
    wx.showModal({    
      title: '退房手续',
      content: '请确认未在房间遗留随身物品',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let param = {
            orderId:e.currentTarget.dataset.orderId
          }
          util.request(api.UcenterOrderCheckOut , param , 'POST').then(res => {
            wx.showToast({title: "退房申请成功" ,image:'/static/images/icon_success.png'})
            that.init(0,1);
          }).catch((err) => {});
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //续住
  continue(e){
    wx.navigateTo({
      url: "../orderContinue/orderContinue?orderId="+e.currentTarget.dataset.orderId
    })
  },
  //支付
  orderPay(e){
    let index = e.currentTarget.dataset.index;
    //跳转
    wx.redirectTo({
      url: "/pages/customized/pay/pay?money="+this.data.orderUl[index].orderPrice+"&orderId="+this.data.orderUl[index].id+"&rmdesc="+this.data.orderUl[index].orderRoom
    })
  },
  //刷新
  refresh(){
    this.onShow()
  },
  //回调银行
  orderPayCallback(e){
    let that = this;
    let orderIdCallback = e.currentTarget.dataset.orderId
    util.request(api.CustomizedPayCallback ,{orderId:orderIdCallback}, 'GET').then(function(res) {
      wx.showToast({title: "刷新成功" ,image:'/static/images/icon_success.png'})
      that.init(that.data.menuVal,1,1)
    });
  },
})