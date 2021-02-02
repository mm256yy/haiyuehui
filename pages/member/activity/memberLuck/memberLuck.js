let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    luckUl:[
      [
        {
          img:'/static/images/luck/luck1.png',
          text:'早餐周卡',
          animationVal:1,
          bindtap:'',
          class:'flex_li_b',
          prize:'早餐周卡兑换券（海外海国际酒店、海外海纳川大酒店、海外海通信大厦选其一）',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck2.png',
          text:'健身周卡',
          animationVal:2,
          bindtap:'',
          class:'flex_li_b',
          prize:'游泳健身周卡兑换券（千岛湖海外海假日酒店）',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck1.png',
          text:'下午茶周卡',
          animationVal:3,
          bindtap:'',
          class:'flex_li_b',
          prize:'下午茶周卡兑换券（杭州海外海皇冠大酒店大堂吧）',
          route:'/pages/market/marketExchange/marketExchange',
        },
      ],
      [
        {
          img:'/static/images/luck/luck2.png',
          text:'100元优惠券',
          animationVal:8,
          bindtap:'',
          class:'flex_li_b',
          prize:'100元满减优惠券（共计3张）',
          route:'/pages/ucenter/coupon/coupon',
        },
        {
          img:'/static/images/luck/luck3.png',
          text:'点击抽奖',
          animationVal:9,
          bindtap:'luckDraw',
          class:'flex_li_go',
          prize:'',
          route:'',
        },
        {
          img:'/static/images/luck/luck2.png',
          text:'100元优惠券',
          animationVal:4,
          bindtap:'',
          class:'flex_li_b',
          prize:'100元满减优惠券（共计3张）',
          route:'/pages/ucenter/coupon/coupon',
        },
      ],
      [
        {
          img:'/static/images/luck/luck1.png',
          text:'下午茶次卡',
          animationVal:7,
          bindtap:'',
          class:'flex_li_b',
          prize:'下午茶次卡兑换券（杭州海外海皇冠大酒店）',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck1.png',
          text:'健身次卡',
          animationVal:6,
          bindtap:'',
          class:'flex_li_b',
          prize:'游泳健身次卡兑换券（千岛湖海外海假日酒店）',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck1.png',
          text:'早餐次卡',
          animationVal:5,
          bindtap:'',
          class:'flex_li_b',
          prize:'早餐次卡兑换券（海外海国际酒店、海外海纳川大酒店、海外海通信大厦选其一）',
          route:'/pages/market/marketExchange/marketExchange',
        },
      ],
    ],
    animationVal:1,
    tap:true,
    popShow:false,
    prize:'客房满减券满300减30',
    route:'',
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  //点击go进行抽奖
  luckDraw(){
    if(!this.data.tap){ return false}
    this.setData({
      tap:false
    })
    // this.luckDrawAnimation(2);
    util.request(api.ActivityDraw , 'GET').then(res => {
      console.log(res)
      let val = this.funGetValId(res.result)
      this.luckDrawAnimation(val);
    }).catch((err) => {
      this.setData({
        tap:true
      })
      // check.showErrorToast(err)
    });
  },
  //抽奖内部代码
  luckDrawAnimation(luck){
    let speed = 1; // 越大速度越快
    let v = 0; // 结束值
    let v_end = 49+luck*4; // 50
    let val = 1; // 当前值
    let time = setInterval(()=>{
      v ++;
      if(val<8 && v<=v_end){
        if(v%speed === 0){
          val ++;
        }
      }else if(val>=8 && v<=v_end){
        if(v%speed === 0){
          val = 1;
          speed ++;
        }
      }else{
        clearInterval(time)
        this.setData({
          tap:true
        });
        this.funPopShow(luck);
      }
      this.setData({
        animationVal:val
      })
    },150)
  },
  //pop显示
  funPopShow(luck){
    let prizeNew = '';
    let routeNew = '';
    let luckUl = this.funGetLuck(luck)
    prizeNew = luckUl.prize;
    routeNew = luckUl.route;
    this.setData({
      popShow:!this.data.popShow,
      prize:prizeNew,
      route:routeNew,
    });
  },
  //获取到luck
  funGetLuck(luck){
    let luckUl = this.data.luckUl
    switch (luck) {
      case 0: return luckUl[0][0];
      case 1: return luckUl[0][1];
      case 2: return luckUl[0][2];
      case 3: return luckUl[1][2];
      case 4: return luckUl[2][2];
      case 5: return luckUl[2][1];
      case 6: return luckUl[2][0];
      default: return luckUl[1][0];
    }
  },
  //route
  funRoute(){
    let route = this.data.route;
    console.log(this.data.route)
    wx.redirectTo({  //关闭当前页(卸载)，跳转到指定页
      url:route
    });
  },
  //转换传过来的id
  funGetValId(id){
    switch (id) {
      case 1: return 0;
      case 2: return 1;
      case 3: return 2;
      case 4: return 4;
      case 5: return 5;
      case 6: return 6;
      case 7: return 3;
      default: return 3;
    }
  },
})
