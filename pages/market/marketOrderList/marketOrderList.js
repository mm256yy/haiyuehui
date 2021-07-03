let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    menuUl:[
      {name:'全部',val:'0'},
      {name:'待付款',val:'1'},
      {name:'已付款',val:'2'},
      {name:'待退款',val:'3'},
    ],
    orderUl:[
      // {
      //   orderId:456789,
      //   money:6500,
      //   state:'1',
      //   canRefund:0, //1支持退款 0不支持退款
      //   goods:[
      //     {id:2,img:'/static/images/logo.png',name:'五等广式月饼礼盒装780g中秋礼品送礼大礼包五芳合价月饼礼盒',price:'2400',spec:'',num:2},
      //     {id:2,img:'/static/images/logo.png',name:'五等广式月饼礼盒装780g中秋礼品送礼大礼包五芳合价月饼礼盒',price:'2400',spec:'',num:2}
      //   ],
      // },
    ],
    pageNo:1,
    menuVal:0,
  },
  onLoad: function (options) {
    user.goToLogin();
  },
  onShow: function () {
    this.setData({
      pageNo:1,
      menuVal:0
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
  init(type,pull){  //pull 1为初始化 2为下拉
    let param = {
      pageNo:this.data.pageNo,
      showType:type,
      pageSize:5,
    }
    util.request(api.MallOrderList ,param , 'GET').then(res => {
      let data = res.result.records;
      let o_ul = [];
      let o_li = {};
      let g_ul = [];
      let g_li = {};
      let orderUlNew = [];
      for(let i=0;i<data.length;i++){
        for(let j=0;j<data[i].goods.length;j++){
          g_li = {
            id:data[i].goods[j].id,
            img:data[i].goods[j].goodsImg,
            name:data[i].goods[j].goodsTitle,
            price:data[i].goods[j].unitPrice,
            spec:data[i].goods[j].spec?data[i].goods[j].spec:'',
            num:data[i].goods[j].amount,
          }
          g_ul.push(g_li)
        }
        o_li = {
          orderId:data[i].id,
          money:data[i].money,
          state:data[i].status,
          canRefund:this.funcanRefund(data[i].canRefund),
          goods:g_ul,
        }
        g_ul = [];
        o_ul.push(o_li)
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
      }
      this.setData({
        orderUl:orderUlNew
      })
    }).catch((err) => {
      // this.setData({
      //   orderUl:[]
      // })
    });
  },
  //选择类型
  menuOn(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      menuVal:index,
      pageNo:1
    })
    this.init(index,1)
  },
  //取消订单/订单退款
  orderCancel(e){
    let arr = e.currentTarget.dataset.index;
    let orderId = e.currentTarget.dataset.orderId;
    let pay = 0; //1 未支付  2已支付
    if(this.data.orderUl[arr].state === 0){
      pay = 1
    }else if(this.data.orderUl[arr].state === 3){
      pay = 2
    }
    wx.navigateTo({
      url: "/pages/market/marketOrderCancel/marketOrderCancel?orderId="+orderId+"&pay="+pay
    })
  },
  //是否支持退款
  funcanRefund(val){
    if(val == 0){
      return false
    }else if(val == 0){
      return true
    }else{
      return true
    }
  },
  //订单支付
  orderPay(e){
    let index = e.currentTarget.dataset.index;
    //跳转
    wx.navigateTo({
      url: "/pages/market/marketPay/marketPay?money="+this.data.orderUl[index].money+"&orderId="+this.data.orderUl[index].orderId+"&rmdesc="+this.data.orderUl[index].orderId
    })
  },
  //跳转
  orderDetail(e){
    wx.navigateTo({
      url: "/pages/market/marketOrderDetailed/marketOrderDetailed?orderId="+e.currentTarget.dataset.orderId
    })
  },
})