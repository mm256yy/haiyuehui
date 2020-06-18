const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const pay = require('../../../utils/pay.js');
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
        type:21,
        typeS:'待入住',
        custName:'custName',
        startTime:0,
        startTimeS:'2020-05-11',
        endTime:0,
        endTimeS:'2020-05-12',
        orderRoom:'orderRoom',
        orderPrice:60000,
        orderPriceS:'600.00',
        roomNo:'roomNo',
        show:true,
        canAdd:0,  //判断是否显示续住订单 0 隐藏 1 显示
      }*/
    ],
    pageNo:1,
    menuVal:0,
  },
  onLoad: function () {
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.init(0,1);
    this.setData({
      menuVal:0,
    })
  },
  onHide: function () {

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
      pageSize:15,
      showType:typeVal
    }
    console.log(param)
    util.request(api.UcenterOrderList , param , 'GET').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        let o_ul = [];
        let o_li = {};
        let orderUlNew = []
        if(res.result.records.length == 0){ 
        }else{
          for(let i=0;i<res.result.records.length;i++){
            o_li = {
              id:res.result.records[i].orderId ,
              hotelName:res.result.records[i].hotelName||'暂无获取到酒店名字',
              type:res.result.records[i].status,
              typeS:this.orderType(res.result.records[i].status),
              startTime:new Date(res.result.records[i].arr).getTime(),
              startTimeS:res.result.records[i].arr,
              endTime:new Date(res.result.records[i].dep).getTime(),
              endTimeS:res.result.records[i].dep,
              orderRoom:res.result.records[i].rmdesc,
              orderNum:res.result.records[i].orderId,
              orderPrice:res.result.records[i].money,
              orderPriceS:(res.result.records[i].money/100).toFixed(2),
              roomNo:res.result.records[i].roomNo,
              show:(res.result.records[i].parentOrderId == ""),
              canAdd:res.result.records[i].canAdd
            }
            o_ul.push(o_li)
          }
        }
        if(pull == 1){  //初始化
          orderUlNew = o_ul
        }else{
          if(res.result.records.length == 0){
            orderUlNew = this.data.orderUl.concat(o_ul)
            this.setData({
              pageNo:this.data.pageNo - 1
            })
          }else{
            orderUlNew = this.data.orderUl.concat(o_ul)
          }
        }
        this.setData({
          orderUl:orderUlNew,
        })
      }else{
        //登陆
        wx.navigateTo({
          url: "../../auth/login/login"
        })
      }
    }).catch((err) => {
      console.log(err)
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
    console.log(e)
    wx.navigateTo({
      url: "../orderDetail/orderDetail?orderId="+e.currentTarget.dataset.orderId
    })
  },
  //取消订单
  orderCancel(e){
    let arr = e.currentTarget.dataset.index
    console.log(e.currentTarget.dataset.index)
    let pay = 0; //1 未支付  2已支付
    if(this.data.orderUl[arr].type === 11){
      pay = 1
    }else if(this.data.orderUl[arr].type === 22){
      pay = 2
    }
    wx.navigateTo({
      url: "../orderCancel/orderCancel?orderId="+e.currentTarget.dataset.orderId+"&pay="+pay
    })
  },
  // 退房
  checkout(e){
    let that = this
    wx.showModal({ //cancelColor（取消按钮的文字颜色）confirmColor（确定按钮的文字颜色）
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
            console.log(res)
            if (res.status.code === 0) {
              wx.showModal({ title: '成功',content: '退房申请成功',showCancel: false });
              that.init(0,1);
            }else{
              wx.showModal({ title: '失败',content: '退房申请失败',showCancel: false });
              that.init(0,1);
            }
          }).catch((err) => {
            console.log(err)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    /**/
  },
  //续住
  continue(e){
    wx.navigateTo({
      url: "../orderContinue/orderContinue?orderId="+e.currentTarget.dataset.orderId
    })
  },
  //支付
  orderPay(e){
    console.log(this.data.orderUl[e.currentTarget.dataset.index])
    let param = {
      orderId:this.data.orderUl[e.currentTarget.dataset.index].id,
      rmdesc:this.data.orderUl[e.currentTarget.dataset.index].orderRoom,
    }
    console.log(param)
    pay.usePay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "../../customized/payResult/payResult?result="+'1'
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result="+'0'
      })
    });
  },
  //刷新
  refresh(){
    this.onShow()
  },
  //订单类型
  orderType(type){
    if(type == 11){  //订单生成，未支付
      return "待支付"
    }else if(type == 12){  //下单未支付用户取消
      return "已取消"
    }else if(type == 13){ //下单未支付超期系统自动取消
      return "超时已取消"
    }else if(type == 21){  //订单支付中
      return "支付中"
    }else if(type == 22){  //支付完成，待入住
      return "待入住"
    }else if(type == 23){  //支付完成，未入住，用户申请退款
      return "退款申请中"
    }else if(type == 24){  //管理员执行退款操作，确认退款成功
      return "退款成功"
    }else if(type == 25){  //续租，支付成功
      return "已支付"
    }else if(type == 31){  //已入住
      return "已入住"
    }else if(type == 32){  //已入住 并且续住
      return "已续住"
    }else if(type == 41){  //已退房
      return "已申请退房"
    }else if(type == 51){  //已结单
      return "已结单"
    }
  }
})