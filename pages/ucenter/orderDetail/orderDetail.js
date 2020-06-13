// pages/ucenter/orderDetail/orderDetail.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const pay = require('../../../utils/pay.js');
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
      contactsName:'',
      contactsTel:'',
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
        subtotalS:'200.00'
      }*/
    ],
    money:{
      roomPrice:0,
      roomPriceS:'0.00',
      deposit:0,
      depositS:'0.00',
      addition:0,
      additionS:'0.00',
      total:0,
      totalS:'0.00'
    },
  },
  onLoad(options) {
    this.init(options)
  },
  onReady() {

  },
  onShow() {
    this.orderList();
    
  },
  onHide() {

  },
  //初始化
  init(options){
    console.log(options)
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
      console.log(res)
      if (res.status.code === 0) {
        let data = res.result
        let detailNew = {},personUlNew = [],moneyNew = {};
        detailNew = {
          status:data.status,
          statusS:this.orderType(data.status),
          hotelId:data.hotelId,
          hotelName:data.hotelName,
          rmtype:data.rmtype,
          roomNo:data.roomNo,
          startTimeS:data.arr,
          endTimeS:data.dep,
          rmdesc:data.rmdesc,
          orderId:this.data.detail.orderId,
          contactsName:data.name,
          contactsTel:data.mobile,
        }
        let dayNum = (new Date(data.dep) - new Date(data.arr))/1000/60/60/24
        moneyNew = {
          roomPrice:data.roomPrice*dayNum,
          roomPriceS:(data.roomPrice/100*dayNum).toFixed(2),
          deposit:data.deposit,
          depositS:(data.deposit/100).toFixed(2),
          addition:0,
          additionS:'0.00',
          total:data.money,
          totalS:(data.money/100).toFixed(2)
        }
        let personsUL = [];
        let personsLi = {};
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
        personUlNew = personsUL;
        this.setData({
          detail:detailNew,
          personUl:personUlNew,
          money:moneyNew
        })
        this.addDaysList();
      }
    }).catch((err) => {
      console.log(err)
    });
  },
  //获取续住列表
  addDaysList(){
    let param = {
      orderId:this.data.detail.orderId
    }
    util.request(api.UcenterAddDaysList ,param, 'GET').then(res => {
      console.log(res)
      if (res.status.code === 0) {
        let additionUlNew = [],additionliNew = {},additionMoney = 0;
        for(let i=0;i<res.result.length;i++){
          additionliNew = {
            orderId:res.result[i].id,
            rmdesc:res.result[i].rmdesc,
            time:this.TimeR(res.result[i].inDay)+'至'+this.TimeR(res.result[i].outDay),
            status:res.result[i].status,
            statusS:this.orderType(res.result[i].status),
            subtotal:res.result[i].money,
            subtotalS:(res.result[i].money/100).toFixed(2),
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
        console.log(this.data.money.totalS)
      }
    }).catch((err) => {
      console.log(err)
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
        url: "../../customized/payResult/payResult?result="+'1'
      })
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result="+'0'
      })
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
    wx.navigateTo({
      url: "../orderChoose/orderChoose?arr="+this.data.detail.startTimeS+"&dep="+this.data.detail.endTimeS+"&hotelId="+this.data.detail.hotelId+"&rmtype="+this.data.detail.rmtype+"&orderId="+this.data.detail.orderId
    })
  },
  //添加同住人/访客  0 同住人 1 访客
  goOrderAddition(e){
    let additionType = e.currentTarget.dataset.type
    wx.navigateTo({
      url: "../orderAddition/orderAddition?orderId="+this.data.detail.orderId+"&additionType="+additionType+"&hotelId="+this.data.detail.hotelId
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
      return "退款中"
    }else if(type == 24){  //管理员执行退款操作，确认退款成功
      return "退款成功"
    }else if(type == 25){  //续租，支付成功
      return "已支付"
    }else if(type == 31){  //已入住
      return "已入住"
    }else if(type == 32){  //已入住 并且续住
      return "已续住"
    }else if(type == 41){  //已退房
      return "已退房"
    }else if(type == 51){  //已结单
      return "已结单"
    }
  },
  //时间转换
  TimeR(val){
    let arr = val.toString().split("");
    return arr[0]+arr[1]+arr[2]+arr[3]+"-"+arr[4]+arr[5]+"-"+arr[6]+arr[7]
  },
})