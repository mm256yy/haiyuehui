
let util = require('../../../utils/util.js');
let pay = require('../../../utils/pay.js');
let api = require('../../../config/api.js');
Page({
  data: {
    order:{
      num:'',
      money:0,
      time:'',
      timeS:'',
    },
    mode:{
      // balance:0,
      // balanceRadio:false,
    },
    pay:{
      payment:0,
      balance:0,
      total:0,
    },
    rmdescVal:'',
  },
  onLoad: function (options) {
    this.initialize(options);
    this.balance();
    this.total();
  },
  onShow: function () {

  },
  initialize(data){
    console.log(data)
    let orderNew = {
      num:data.orderId,
      money:data.money||0,
      time:new Date().getTime(),
      timeS:this.formatDateTime(new Date().getTime()),
    }
    this.setData({
      order:orderNew,
      rmdescVal:data.rmdesc
    })
  },
  //获取余额
  balance(){
    util.request(api.MemberGet, 'GET').then(res => {
      console.log(res)
      let modeNew = {
        balance:res.result.balance*(-1),
        balanceRadio:false,
      }
      this.setData({
        mode:modeNew
      })
      console.log(modeNew)
    }).catch((err) => {
      if(err == "未找到会员信息"){
        wx.showModal({ 
          title: '获取会员失败',
          content: '你未绑定手机号码',
          success: function(res) {
            wx.navigateTo({
              url: "/pages/auth/registerWx/registerWx"
            })
          }
        })
      }else{
        wx.showModal({title: '错误信息',content: err ,showCancel: false}); 
      }
    });
  },
  //选择支付类型
  bindBalanceSRadio(){
    this.setData({
      'mode.balanceRadio':!this.data.mode.balanceRadio,
    })
    this.total();
  },
  //金额计算
  total(){
    let balanceNew = 0;
    let wayNew = '微信支付'
    if(this.data.order.money <= this.data.mode.balance&&this.data.mode.balanceRadio){
      balanceNew = this.data.order.money;
      wayNew = '余额支付';
    }else if(this.data.order.money>this.data.mode.balance&&this.data.mode.balanceRadio){
      balanceNew = this.data.mode.balance;
      wayNew = '微信支付 + 余额支付';
    }else{
      balanceNew = 0;
      wayNew = '微信支付';
    };
    let totalNew = parseInt(this.data.order.money) - parseInt(this.data.pay.payment) - parseInt(balanceNew);
    let payNew = {
      payment:0,
      balance:balanceNew,
      total:totalNew,
      way:wayNew,
    };
    this.setData({
      pay : payNew ,
    });
  },
  //预支付
  perpay(){
    let param = {
      orderId:this.data.order.num,
      rmdesc:this.data.rmdescVal,
      balance:this.data.pay.balance,
    }
    console.log(param);
    pay.usePay(param).then(res => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result=1&end=0"
      });
    }).catch(() => {
      //跳转
      wx.navigateTo({
        url: "../payResult/payResult?result=0&end=0"
      });
    });
  },
  formatDateTime(inputTime) { let date = new Date(inputTime); let y = date.getFullYear(); let m = date.getMonth() + 1; m = m < 10 ? ('0' + m) : m; let d = date.getDate(); d = d < 10 ? ('0' + d) : d; let h = date.getHours(); h = h < 10 ? ('0' + h) : h; let minute = date.getMinutes(); let second = date.getSeconds(); minute = minute < 10 ? ('0' + minute) : minute; second = second < 10 ? ('0' + second) : second; return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; }
})