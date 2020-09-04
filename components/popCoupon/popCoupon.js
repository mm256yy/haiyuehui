let util = require('../../utils/util.js');
let api = require('../../config/api.js');

Component({
  properties: { 
    fullMoneyPrice:{
      type:String,
      value:'',
    }
  },
  data: {
    couponUl:[
      // {
      //   id:0,
      //   typeFill:1,
      //   name:'酒店价格满300减免',
      //   startTime:'2020-05-04',
      //   endTime:'2020-06-04',
      //   onlyTimeS:4,
      //   fullMoney:50000,
      //   fullMoneyS:500.00,
      //   subtractMoney:500,
      //   subtractMoneyS:5.00,
      // },
      // {
      //   id:0,
      //   typeFill:0,
      //   name:'酒店价格满500减免',
      //   startTime:'2020-05-04',
      //   endTime:'2020-06-04',
      //   onlyTimeS:4,
      //   fullMoney:10000,
      //   fullMoneyS:100.00,
      //   subtractMoney:1000,
      //   subtractMoneyS:10.00,
      // },
    ],
    couponArr:0,  //未选择为0
    popShow:false,
    popHeight:0,
    popMenu:{
      val:0,
      menu1:0,
      menu2:0,
    },
    animationData:{},
    show:{
      fullMoney:0,
      fullMoneyS:'0',
      subtractMoney:0,
      subtractMoneyS:'0',
    }
  },
  lifetimes: {
    ready: function() {
    },
  },
  methods: {
    //优惠劵
    coupon(fullMoneyPrice){
      let param = {
        pageNo:1,
        showType:2,
        pageSize:20, 
      };
      util.request(api.MemberCouponList , param , 'GET').then(res => {
        let data = res.result.records;
        this.funCouponUl(data,fullMoneyPrice);
      }).catch((err) => {
        this.funCouponUl(this.data.couponUl,fullMoneyPrice);
      });
    },
    //优惠劵列表
    funCouponUl(data,fullMoneyPrice){
      if(data.length == 0){ return false };
      let c_ul = [];
      let c_li = {};
      let couponUlNew = [];
      let couponY = 0;
      let couponN = 0;
      for(let i=0;i<data.length;i++){
        // console.log(data[i].fullMoney)
        // console.log(fullMoneyPrice)
        if(data[i].fullMoney<fullMoneyPrice){
          couponY ++;
        }else{
          couponN ++;
        }
        c_li = {
          id:data[i].id,
          typeFill:(data[i].fullMoney<fullMoneyPrice)?0:1,
          name:data[i].name,
          startTime:data[i].startTime.split(' ')[0],
          endTime:data[i].endTime.split(' ')[0],
          onlyTimeS:this.onlyTimeS(data[i].startTime,data[i].endTime),
          fullMoney:data[i].fullMoney,
          fullMoneyS:(data[i].fullMoney/100),
          subtractMoney:data[i].subtractMoney,
          subtractMoneyS:(data[i].subtractMoney/100),
        }
        c_ul.push(c_li)
      }
      couponUlNew = c_ul;
      this.setData({
        couponUl:couponUlNew,
        'popMenu.menu1':couponY,
        'popMenu.menu2':couponN,
      });
    },
    //加载时父组件传递过来
    funCouponFrist(fullMoneyPrice){
      this.coupon(fullMoneyPrice);
    },
    //父组件传递过来
    funCouponList(fullMoneyPrice){
      this.funCouponUl(this.data.couponUl,fullMoneyPrice);
      //
      let showNew = {
        fullMoney:0,
        fullMoneyS:'0',
        subtractMoney:0,
        subtractMoneyS:'0',
      }
      this.setData({
        show:showNew
      })
    },
    //pop显示
    popShow(){
      //POP
      this.setData({
        popShow:true
      })
      //获取pop的高度
      let height = null;
      let that = this;
      const query = wx.createSelectorQuery().in(this);
      query.selectAll('#pop').boundingClientRect(function (rect) {
        height = rect[0].height;
        let animation = wx.createAnimation({
            duration:1000,
            timingFunction:"ease",  
        });
        animation.translate(0, -height).step();  
        that.setData({
          animationData:animation.export()   
        });
      }).exec();
    },
    //pop隐藏
    popHide(){
      //优惠劵传出
      let couponArrNew = null;
      let couponMoney = 0;
      let couponId = '';
      let fullMoney = 0;
      console.log(this.data.couponUl)
      if(this.data.couponArr !== 0){
        couponArrNew = this.data.couponArr - 1;
        couponMoney = this.data.couponUl[couponArrNew].subtractMoney;
        couponId = parseInt(this.data.couponUl[couponArrNew].id);
        fullMoney = this.data.couponUl[couponArrNew].fullMoney;
      }else{
        couponMoney = 0;
        couponId = '';
        fullMoney = 0;
      }
      let coupon = {
        couponMoney:couponMoney,
        couponId:couponId,
        fullMoney:fullMoney,
      }
      console.log(coupon);
      this.triggerEvent('couponTotal',coupon)
      //动画效果
      let animation = wx.createAnimation({
        duration:1000,
        timingFunction:"ease",  
      })
      animation.translate(0, 440).step();  
      //展示
      let showNew = {
        fullMoney:fullMoney,
        fullMoneyS:(fullMoney/100),
        subtractMoney:couponMoney,
        subtractMoneyS:(couponMoney/100),
      }
      this.setData({
        show:showNew,
        animationData:animation.export(),  
        popShow:false
      });
    },
    //优惠劵选择
    couponChoose(e){
      let index = e.currentTarget.dataset.index;
      let couponArrNew = 0;
      if(index+1 == this.data.couponArr){
        couponArrNew = 0;
      }else{
        couponArrNew = index+1;
      };
      this.setData({
        couponArr : couponArrNew,
      });
    },
    //优惠劵类型
    bindPopMenu(e){
      let type = e.currentTarget.dataset.type;
      this.setData({
        'popMenu.val' : type,
      });
    },
    //剩余时间
    onlyTimeS(startTime,endTime){
      let start = new Date(startTime.replace(/-/g,'/')).getTime();
      let end = new Date(endTime.replace(/-/g,'/')).getTime();
      let num = (end - start)/(100*60*60*24);
      return num;
    },
  }
})
