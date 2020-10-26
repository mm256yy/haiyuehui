let util = require('../../../../utils/util.js');
let check = require('../../../../utils/check.js');
let api = require('../../../../config/api.js');
let pay = require('../../../../utils/pay.js');
// pages/ucenter/order/index.js
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
        show:true,
        canAdd:0,  //判断是否显示续住订单 0 隐藏 1 显示
        isCis:true,
        isOverdue:true,  //是否超时
        payMoney:0,
        otaId:'',
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
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.menuVal,2)
  },
  //初始化
  init(typeVal,pull){  //pull 1为初始化 2为下拉
    let param = {
      pageNo:this.data.pageNo,
      showType:typeVal,
      pageSize:15,
    }
    util.request(api.UcenterOrderList , param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let orderUlNew = []
      if(res.result.records.length != 0){ 
        for(let i=0;i<res.result.records.length;i++){
          o_li = {
            id:res.result.records[i].orderId ,
            hotelName:res.result.records[i].hotelName||'暂无获取到酒店名字',
            status:res.result.records[i].status,
            startTime:new Date(res.result.records[i].arr).getTime(),
            startTimeS:res.result.records[i].arr,
            endTime:new Date(res.result.records[i].dep).getTime(),
            endTimeS:res.result.records[i].dep,
            orderRoom:res.result.records[i].rmdesc,
            orderNum:res.result.records[i].orderId,
            orderPrice:res.result.records[i].money,
            roomNo:res.result.records[i].roomNo?res.result.records[i].roomNo:'',
            show:(res.result.records[i].parentOrderId == ""),
            canAdd:res.result.records[i].canAdd,
            isCis:res.result.records[i].isCis,
            isOverdue:(check.checkIsOverdue(res.result.records[i].dep) < 0),
            payMoney:res.result.records[i].payMoney?res.result.records[i].payMoney:0,
            otaId:res.result.records[i].otaId?res.result.records[i].otaId:'',
          }
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        orderUlNew = o_ul;
      }else{
        orderUlNew = this.data.orderUl.concat(o_ul);
        if(res.result.records.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        orderUl:orderUlNew,
      })
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
          console.log(param)
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
})