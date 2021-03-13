let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    luckUl:[
      [
        {
          img:'/static/images/luck/luck1.png',
          text:'100元优惠券',
          animationVal:1,
          bindtap:'',
          class:'flex_li_b',
          prize:'100元满减优惠券（共计3张）',
          route:'/pages/ucenter/coupon/coupon',
        },
        {
          img:'/static/images/luck/luck2.png',
          text:'5张免房券',
          animationVal:2,
          bindtap:'',
          class:'flex_li_b',
          prize:'同酒店免房券5张',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck1.png',
          text:'100元优惠券',
          animationVal:3,
          bindtap:'',
          class:'flex_li_b',
          prize:'100元满减优惠券（共计3张）',
          route:'/pages/ucenter/coupon/coupon',
        },
      ],
      [
        {
          img:'/static/images/luck/luck2.png',
          text:'5张免房券',
          animationVal:8,
          bindtap:'',
          class:'flex_li_b',
          prize:'同酒店免房券5张',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck3.png',
          text:'共三次机会',
          animationVal:9,
          bindtap:'luckDraw',
          class:'flex_li_go',
          prize:'',
          route:'',
        },
        {
          img:'/static/images/luck/luck2.png',
          text:'5张免房券',
          animationVal:4,
          bindtap:'',
          class:'flex_li_b',
          prize:'同酒店免房券5张',
          route:'/pages/market/marketExchange/marketExchange',
        },
      ],
      [
        {
          img:'/static/images/luck/luck1.png',
          text:'100元优惠券',
          animationVal:7,
          bindtap:'',
          class:'flex_li_b',
          prize:'100元满减优惠券（共计3张）',
          route:'/pages/ucenter/coupon/coupon',
        },
        {
          img:'/static/images/luck/luck2.png',
          text:'5张免房券',
          animationVal:6,
          bindtap:'',
          class:'flex_li_b',
          prize:'同酒店免房券5张',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck1.png',
          text:'100元优惠券',
          animationVal:5,
          bindtap:'',
          class:'flex_li_b',
          prize:'100元满减优惠券（共计3张）',
          route:'/pages/ucenter/coupon/coupon',
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
    // let val = this.funGetValId(9)
    // console.log(val)
    // this.luckDrawAnimation(val);
    util.request(api.ActivityDraw , 'GET').then(res => {
      console.log(res)
      let val = this.funGetValId(res.result)
      this.luckDrawAnimation(val);
    }).catch((err) => {
      this.setData({
        tap:true
      })
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
  //获取到luck-弹窗
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
    if(id == 9){ //满减
      let arr = [0,2,4,6];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 8){
      let arr = [1,3,5,7];
      return arr[Math.floor((Math.random()*arr.length))];
    }else{
      return 0;
    }
  },
})
