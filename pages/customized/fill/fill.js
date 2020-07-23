let check = require('../../../utils/check.js');
let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');

Page({
  data: {
    pics:[
      '/static/images/person.jpg',
    ],
    room:{
      hotelId:'',
      hotelName:'',
      roomId:'',
      roomName:'',
      roomPrice:0,
      roomPriceS:0,
      roomDeposit:0,
      roomOther:0,
      startTime:'',
      startWeek:'',
      endTime:'',
      endWeek:'',
      timeNum:1,
      rmtype:'',
      ratecode:'',
      arr:'',
      dep:'',
      cis:0,
      wrac:999900,  //门市价
      wec0:999900,  //无早
      wec1:999900,  //单早
      wec:999900,  //双早
      wec3:999900,  //三早
      discount:95,
      coupon:1000,

    },
    fill:{
      // roomNum:1,
      // name:'',
      // mobile:'',
      // mobileDisabled:false,
      // cardLevel:'',
      // grade:0,
      // discount:100,
      // scoreTimes:100,
    },
    breakfastUl:[
      // {price:1200,priceS:'12.00',name:'不选早餐',val:'wec0'},
      // {price:1200,priceS:'12.00',name:'单人早餐',val:'wec1'},
      // {price:1200,priceS:'12.00',name:'双人早餐',val:'wec'},
      // {price:1200,priceS:'12.00',name:'三人早餐',val:'wec3'},
    ],
    breakfastChoose:0,
    // couponUl:[
    //   {
    //     id:0,
    //     typeFill:1,
    //     name:'酒店价格满300减免',
    //     startTime:'2020-05-04',
    //     endTime:'2020-06-04',
    //     onlyTimeS:4,
    //     fullMoney:50000,
    //     fullMoneyS:500.00,
    //     money:500,
    //     moneyS:5.00,
    //   },
    //   {
    //     id:0,
    //     typeFill:0,
    //     name:'酒店价格满500减免',
    //     startTime:'2020-05-04',
    //     endTime:'2020-06-04',
    //     onlyTimeS:4,
    //     fullMoney:10000,
    //     fullMoneyS:100.00,
    //     money:1000,
    //     moneyS:10.00,
    //   },
    // ],
    // couponArr:0,  //未选择为0
    // popShow:false,
    // popHeight:0,
    // popMenu:{
    //   val:0,
    //   menu1:0,
    //   menu2:0,
    // },
    // animationData:{},
    couponId:null,
    couponMoney:0, 
    total:{
      roomPrice:999900,
      roomPriceS:'9999.00',
      deposit:50000,
      depositS:'500.00',
      coupon:0,
      couponS:'0.00',
      discount:100,
      discountS:10,
      other:0,
      otherS:'0.00',
      money:999900,
      moneyS:'9999.00'
    }
  },
  onLoad: function (options) {
    this.hotelInfo();
    this.userInfo();
    this.pics();
    //获取优惠劵信息
    // this.coupon();
  },
  onReady: function (){
    this.popId = this.selectComponent("#popId");
  },
  onShow: function () {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]  // 当前页
    if(currPage.data.info){
      this.setData({
        'fill.name':currPage.data.info.name,
        'fill.mobile':currPage.data.info.mobile,
      })
    }
  },
  //酒店信息
  hotelInfo(){
    let calendarNew = wx.getStorageSync("calendar")
    let hotelNew = wx.getStorageSync("hotel")
    let roomrNew = wx.getStorageSync("room")
    // console.log(calendarNew)
    // console.log(hotelNew)
    // console.log(roomrNew)
    let s_t = new Date(calendarNew.startTime)
    let e_t = new Date(calendarNew.endTime)
    let startTime_s = this.dayZero(s_t.getMonth()+1)+'月'+this.dayZero(s_t.getDate())+'日'
    let endTime_s = this.dayZero(e_t.getMonth()+1)+'月'+this.dayZero(e_t.getDate())+'日'
    let arrTime = this.dayZero(s_t.getFullYear())+'-'+this.dayZero(s_t.getMonth()+1)+'-'+this.dayZero(s_t.getDate())
    let depTime = this.dayZero(s_t.getFullYear())+'-'+this.dayZero(e_t.getMonth()+1)+'-'+this.dayZero(e_t.getDate())
    let roomNew = {
      hotelId:hotelNew.id,
      hotelName:hotelNew.name,
      roomId:roomrNew.id,
      roomName:roomrNew.name,
      roomPrice:this.moneyMin(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3),
      roomPriceS:(this.moneyMin(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3)/100).toFixed(2),
      roomDeposit:hotelNew.deposit,
      roomOther:0,
      startTime:startTime_s,
      startWeek:util.formatWeek(calendarNew.startTime),
      endTime:endTime_s,
      endWeek:util.formatWeek(calendarNew.endTime),
      timeNum:this.dayNum(calendarNew),
      rmtype:roomrNew.rmtype,
      ratecode:'WEC0',
      arr:arrTime,
      dep:depTime,
      cis:(roomrNew.isCis?1:0), //1是 0否
      wrac:roomrNew.wrac,  //门市价
      wec0:roomrNew.wec0,  //无早
      wec1:roomrNew.wec1,  //单早
      wec:roomrNew.wec,  //双早
      wec3:roomrNew.wec3,  //三早
    }
    let breakfastUlNew = [
      {price:roomrNew.wec0,priceS:((roomrNew.wec0)/100).toFixed(2),name:'无早餐',val:'WEC0'},
      {price:roomrNew.wec1,priceS:((roomrNew.wec1)/100).toFixed(2),name:'单人早餐',val:'WEC1'},
      {price:roomrNew.wec,priceS:((roomrNew.wec)/100).toFixed(2),name:'双人早餐',val:'WEC'},
      {price:roomrNew.wec3,priceS:((roomrNew.wec3)/100).toFixed(2),name:'三人早餐',val:'WEC3'},
    ]
    this.setData({
      room : roomNew,
      breakfastUl:breakfastUlNew,
      breakfastChoose:this.breakfastNum(roomrNew.wec0,roomrNew.wec1,roomrNew.wec,roomrNew.wec3),
    })
  },
  //个人信息
  userInfo(){
    let tel = wx.getStorageSync('userInfoMobile');
    if(tel){  //如果存在
      let fillNew = {};
      //获取手机
      this.setData({
        'fill.mobile':tel,
        'fill.mobileDisabled':false
      });
      //获取名字
      util.request(api.MemberGet, 'GET').then(res => {
        fillNew = {
          roomNum:1,
          name:(res.result.name != null?res.result.name:''),
          mobile:tel,
          mobileDisabled:false,
          cardLevel:res.result.cardLevel,
          grade:util.memberGrade(res.result.cardLevel),
          discount:(res.result.discount?res.result.discount:100),
          scoreTimes:(res.result.scoreTimes?res.result.scoreTimes:100),
        }
        this.setData({
          fill:fillNew,
        });
        this.total();
      }).catch((err) => {
        wx.showModal({title: '错误信息',content: err,showCancel: false}); 
      });
    }else{
      console.log("手机号不存在");
      this.setData({
        'fill.mobileDisabled':false
      })
    }
  },
  //早餐选择
  breakfastChoose(e){
    let index = e.currentTarget.dataset.index;
    //传递值进pop
    this.popId.funCouponList(this.data.breakfastUl[index].price*this.data.fill.roomNum*this.data.room.timeNum)
    
    this.setData({
      breakfastChoose: index,
      'room.roomPrice':this.data.breakfastUl[index].price,
      'room.roomPriceS':((this.data.breakfastUl[index].price)/100).toFixed(2),  
      'room.ratecode':this.data.breakfastUl[index].val,
      couponMoney:0,
      couponId:null,
    });
    
    //重新计算
    this.total();
  },
  //couponTotal
  couponTotal(e){
    console.log(e)
    let money = e.detail
    this.setData({
      couponMoney:money.couponMoney,
      couponId:money.couponId,
    });
    this.total();
  },
  // //优惠劵
  // coupon(){
  //   let param = {
  //     pageNo:1,
  //     showType:2,
  //     pageSize:20, 
  //   };
  //   console.log(param);
  //   util.request(api.MemberCouponList , param , 'GET').then(res => {
  //     let data = res.result.records;
  //     this.funCouponUl(data);
  //   }).catch((err) => {
  //     wx.showModal({title: '错误信息',content: err,showCancel: false}); 
  //   });
  // },
  // //优惠劵列表
  // funCouponUl(data){
  //   if(data.length == 0){ return false };
  //   let c_ul = [];
  //   let c_li = {};
  //   let couponUlNew = [];
  //   let couponY = 0;
  //   let couponN = 0;
  //   for(let i=0;i<data.length;i++){
  //     if(data[i].fullMoney<(this.data.breakfastUl[this.data.breakfastChoose].price*this.data.room.timeNum)){
  //       couponY ++;
  //     }else{
  //       couponN ++;
  //     }
  //     c_li = {
  //       id:data[i].id,
  //       typeFill:(data[i].fullMoney<(this.data.breakfastUl[this.data.breakfastChoose].price*this.data.room.timeNum))?0:1,
  //       name:data[i].name,
  //       startTime:data[i].startTime,
  //       endTime:data[i].endTime,
  //       onlyTimeS:this.onlyTimeS(data[i].startTime,data[i].endTime),
  //       fullMoney:data[i].fullMoney,
  //       fullMoneyS:(data[i].fullMoney/100),
  //       money:data[i].money,
  //       moneyS:(data[i].money/100),
  //     }
  //     c_ul.push(c_li)
  //   }
  //   couponUlNew = c_ul;
  //   this.setData({
  //     couponUl:couponUlNew,
  //     'popMenu.menu1':couponY,
  //     'popMenu.menu2':couponN,
  //   });
  //   console.log(this.data.couponUl)
  // },
  // //pop显示
  // popShow(e){
  //   //POP
  //   this.setData({
  //     popShow:true
  //   })
  //   //获取pop的高度
  //   let height = null;
  //   let that = this;
  //   wx.createSelectorQuery().selectAll('#pop').boundingClientRect(function (rect) {
  //     height = rect[0].height;
  //     let animation = wx.createAnimation({
  //         duration:1000,
  //         timingFunction:"ease",  //可以看下表1
  //     });
  //     animation.translate(0, -height).step();  //动画过程可以看下表2
  //     that.setData({
  //       animationData:animation.export()   //设置完毕
  //     });
  //   }).exec();
  // },
  // //pop隐藏
  // popHide(){
  //   let animation = wx.createAnimation({
  //       duration:1000,
  //       timingFunction:"ease",  //可以看下表1
  //   })
  //   animation.translate(0, 440).step();  //动画过程可以看下表2
  //   this.setData({
  //     animationData:animation.export(),   //设置完毕
  //     popShow:false
  //   });
  //   this.total();
  // },
  // //优惠劵选择
  // couponChoose(e){
  //   let index = e.currentTarget.dataset.index;
  //   let couponArrNew = 0;
  //   if(index+1 == this.data.couponArr){
  //     couponArrNew = 0;
  //   }else{
  //     couponArrNew = index+1;
  //   };
  //   this.setData({
  //     couponArr : couponArrNew,
  //   });
  // },
  // //优惠劵类型
  // bindPopMenu(e){
  //   let type = e.currentTarget.dataset.type;
  //   this.setData({
  //     'popMenu.val' : type,
  //   });
  // },
  //总计
  total(){
    //房费
    let roomPriceNew = this.data.room.roomPrice*this.data.fill.roomNum*this.data.room.timeNum;
    //押金
    let depositNew = this.data.room.roomDeposit*this.data.fill.roomNum;
    //优惠劵
    let couponMoney = this.data.couponMoney;
    //会员折扣
    let discountNew = this.data.fill.discount;
    //other
    let otherNew = this.data.room.roomOther;
    //总计
    let totalNew = {
      roomPrice:roomPriceNew,
      roomPriceS:(roomPriceNew/100).toFixed(2),
      deposit:depositNew,
      depositS:(depositNew/100).toFixed(2),
      coupon:couponMoney,
      couponS:(couponMoney/100).toFixed(2),
      discount:discountNew,
      discountS:discountNew/10,
      other:otherNew,
      otherS:(otherNew/100).toFixed(2),
      money:(roomPriceNew-couponMoney+otherNew)*(discountNew/100)+depositNew,
      moneyS:(((roomPriceNew-couponMoney+otherNew)*(discountNew/100)+depositNew)/100).toFixed(2)
    } 
    this.setData({
      total: totalNew
    });
  },
  //立即下单
  placeOrder(){
    if(!check.checkName(this.data.fill.name)){return false};
    if(!check.checkMobile(this.data.fill.mobile)){return false};
    if(!check.checkMoney(this.data.total.money)){return false};
    if(!check.checkMoney(this.data.room.roomPrice)){return false};
    // //优惠劵
    // let couponArrNew = null;
    // let couponMoney = 0;
    // let CouponIdNew = '';
    // if(this.data.couponArr !== 0){
    //   couponArrNew = this.data.couponArr - 1;
    //   couponMoney = this.data.couponUl[couponArrNew].money;
    //   CouponIdNew = this.data.couponUl[couponArrNew].id;
    // }else{
    //   couponMoney = 0;
    //   CouponIdNew = '';
    // }
    //传递
    let param = {
      hotelId: this.data.room.hotelId,
      money: this.data.total.money,
      rmtype:this.data.room.rmtype,
      rmdesc:this.data.room.roomName,
      ratecode:this.data.room.ratecode,
      roomPrice:this.data.room.roomPrice,
      name:this.data.fill.name,
      mobile:this.data.fill.mobile,
      arr:this.data.room.arr,
      dep:this.data.room.dep,
      deposit:this.data.total.deposit,
      cis:this.data.room.cis,
      memberCouponId:this.data.couponId,  //优惠劵id
      subtractMoney:this.data.couponMoney,  //优惠劵减金额
      scoreTimes:this.data.fill.scoreTimes,  //积分倍数
      cardLevel:this.data.fill.cardLevel,  //卡等级
      discount:this.data.fill.discount,  //等级折扣
    };
    console.log(param)
    util.request(api.CustomizedHotelsFill ,param, 'POST').then(res => {
      //跳转
      wx.redirectTo({
        url: "/pages/customized/pay/pay?money="+res.result.money+"&orderId="+res.result.orderId+"&rmdesc="+this.data.room.roomName
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //money
  moneyMin(wec0,wec1,wec,wec3){
    if(util.importantMoney(wec0) != 999900){
      return wec0;
    }else if(util.importantMoney(wec1) != 999900){
      return wec1;
    }else if(util.importantMoney(wec) != 999900){
      return wec;
    }else if(util.importantMoney(wec3) != 999900){
      return wec3;
    }else{
      return 999900
    }
  },
  breakfastNum(wec0,wec1,wec,wec3){
    if(util.importantMoney(wec0) != 999900){
      return 0;
    }else if(util.importantMoney(wec1) != 999900){
      return 1;
    }else if(util.importantMoney(wec) != 999900){
      return 2;
    }else if(util.importantMoney(wec3) != 999900){
      return 3;
    }else{
      return 999900
    }
  },
  //时间
  dayZero(val){
    if(val<=9){
      return "0"+val
    }else{
      return val
    }
  },
  //房间数量
  room(e){
    let type = e.currentTarget.dataset.type
    let numNew = this.data.fill.roomNum
    if(type == 0&&numNew>1){  //减法
      numNew -- ;
    }else if(type == 1){
      numNew ++ ;
    }
    this.setData({
      'fill.roomNum' : numNew
    })
    //重新计算
    this.total()
  },
  //input焦点
  bindNameInput: function(e) {
    this.setData({
      'fill.name': e.detail.value
    });
  },
  bindMobileInput: function(e) {
    this.setData({
      'fill.mobile': e.detail.value
    });
  },
  //剩余时间
  onlyTimeS(startTime,endTime){
    let start = new Date(startTime.replace(/-/g,'/')).getTime();
    let end = new Date(endTime.replace(/-/g,'/')).getTime();
    let num = (end - start)/(100*60*60*24);
    return num;
  },
  //获取房间信息
  pics(){
    let param = {
      hotelId:this.data.room.hotelId,
      rmtype:this.data.room.rmtype,
    }
    console.log(param)
    util.request(api.CustomizedHotelsRoom , param , 'GET').then(res => {
      this.setData({
        pics:res.result.imgList.length == 0?['/static/images/person.jpg']:res.result.imgList
      })
    }).catch((err) => {
      // wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //跳转到常住人
  person(){
    wx.navigateTo({
      url: "/pages/ucenter/set/oftenList/oftenList?oftenType=1"
    })
  },
  dayNum(calendarNew){
    let num = calendarNew.endTime-calendarNew.startTime
    return parseInt(num/60/60/24/1000)
  }
})