let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
let check = require('../../../../utils/check.js');
Page({
  data: {
    luckUl:[
      [
        {
          img:'/static/images/luck/luck1.png',
          text:'早餐劵1张',
          animationVal:1,
          bindtap:'',
          class:'flex_li_b',
          prize:'海外海皇冠大酒店通兑早餐券1张',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck4.png',
          text:'20元优惠劵',
          animationVal:2,
          bindtap:'',
          class:'flex_li_b',
          prize:'海悦会日历房优惠券20元',
          route:'/pages/ucenter/coupon/coupon',
        },
        {
          img:'/static/images/luck/luck3.png',
          text:'延迟退房券',
          animationVal:3,
          bindtap:'',
          class:'flex_li_b',
          prize:'海外海皇冠大酒店延迟退房1小时券',
          route:'/pages/market/marketExchange/marketExchange',
        },
      ],
      [
        {
          img:'/static/images/luck/luck1.png',
          text:'早餐券1张',
          animationVal:8,
          bindtap:'',
          class:'flex_li_b',
          prize:'千岛湖海外海假日酒店早餐券1张',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luckGO.png',
          text:'立即抽奖',
          animationVal:9,
          bindtap:'luckDraw',
          class:'flex_li_go',
          prize:'',
          route:'',
        },
        {
          img:'/static/images/luck/luck4.png',
          text:'10元优惠劵',
          animationVal:4,
          bindtap:'',
          class:'flex_li_b',
          prize:'海悦会日历房优惠券10元',
          route:'/pages/ucenter/coupon/coupon',
        },
      ],
      [
        {
          img:'/static/images/luck/luck4.png',
          text:'30元优惠劵',
          animationVal:7,
          bindtap:'',
          class:'flex_li_b',
          prize:'海悦会日历房优惠券30元',
          route:'/pages/ucenter/coupon/coupon',
        },
        {
          img:'/static/images/luck/luck5.png',
          text:'总统套房券',
          animationVal:6,
          bindtap:'',
          class:'flex_li_b',
          prize:'杭州海外海通信大厦总统套房券1张',
          route:'/pages/market/marketExchange/marketExchange',
        },
        {
          img:'/static/images/luck/luck2.png',
          text:'客房升级券',
          animationVal:5,
          bindtap:'',
          class:'flex_li_b',
          prize:'客房升级券（客房升一档）',
          route:'/pages/market/marketExchange/marketExchange',
        },
      ],
    ],
    ruleTitleChoose:2,
    animationVal:1,
    tap:true,
    popShow:false,
    prize:'海悦会日历房优惠劵10元',
    route:'',
    //time
    dayTime:false,
    hoursTime:0,
    minutesTime:0,
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.luckTime()
  },
  luckTime(){
    let date = new Date()
    let day = date.getDate();
    let hours = 23-date.getHours();
    let minutes = 60-date.getMinutes();
    this.setData({
      dayTime: day,
      hoursTime: hours,
      minutesTime: minutes,
    })
  },
  //点击go进行抽奖
  luckDraw(){
    if(!this.data.tap){ return false}
    this.setData({
      tap:false
    })
    // let val = this.funGetValId(1)
    // this.luckDrawAnimation(val);
    util.request(api.ActivityDraw , 'GET').then(res => {
      let val = this.funGetValId(res.result)
      this.luckDrawAnimation(val);
    }).finally((err) => {
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
    },50)
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
    wx.redirectTo({  //关闭当前页(卸载)，跳转到指定页
      url:route
    });
  },
  //转换传过来的id
  funGetValId(id){
    if(id == 1){ 
      let arr = [3];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 2){
      let arr = [1];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 3){
      let arr = [6];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 4){
      let arr = [0];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 5){
      let arr = [2];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 6){
      let arr = [8];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 7){
      let arr = [5];
      return arr[Math.floor((Math.random()*arr.length))];
    }else if(id == 8){
      let arr = [4];
      return arr[Math.floor((Math.random()*arr.length))];
    }else{
      return 3;
    }
  },
  //选择头部
  funRuleTitleChoose(e){
    let val = e.currentTarget.dataset.val;
    this.setData({
      ruleTitleChoose: val
    })
  }
})
