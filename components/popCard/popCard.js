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
      {
        id:0,
        typeFill:1,
        name:'酒店价格满300减免',
        startTime:'2020-05-04',
        endTime:'2020-06-04',
        onlyTimeS:4,
        fullMoney:50000,
        fullMoneyS:500.00,
        money:500,
        moneyS:5.00,
      },
      {
        id:0,
        typeFill:0,
        name:'酒店价格满500减免',
        startTime:'2020-05-04',
        endTime:'2020-06-04',
        onlyTimeS:4,
        fullMoney:10000,
        fullMoneyS:100.00,
        money:1000,
        moneyS:10.00,
      },
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
  },
  lifetimes: {
    ready: function() {
      this.coupon();
    },
  },
  methods: {
    //优惠劵
    coupon(){
      let param = {
        pageNo:1,
        showType:2,
        pageSize:20, 
      };
      util.request(api.MemberCouponList , param , 'GET').then(res => {
        let data = res.result.records;
        this.funCouponUl(data,this.data.fullMoneyPrice);
      }).catch((err) => {
        wx.showModal({title: '错误信息',content: err,showCancel: false}); 
      });
    },
    //优惠劵列表
    funCouponUl(data,fullMoneyPrice){
      console.log(fullMoneyPrice)
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
          startTime:data[i].startTime,
          endTime:data[i].endTime,
          onlyTimeS:this.onlyTimeS(data[i].startTime,data[i].endTime),
          fullMoney:data[i].fullMoney,
          fullMoneyS:(data[i].fullMoney/100),
          money:data[i].money,
          moneyS:(data[i].money/100),
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
    //父组件传递过来
    funCouponList(fullMoneyPrice){
      this.funCouponUl(this.data.couponUl,fullMoneyPrice);
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
      let animation = wx.createAnimation({
          duration:1000,
          timingFunction:"ease",  
      })
      animation.translate(0, 440).step();  
      this.setData({
        animationData:animation.export(),  
        popShow:false
      });
      //优惠劵传出
      let couponArrNew = null;
      let couponMoney = 0;
      let couponId = null;
      console.log(this.data.couponUl)
      if(this.data.couponArr !== 0){
        couponArrNew = this.data.couponArr - 1;
        couponMoney = this.data.couponUl[couponArrNew].money;
        couponId = this.data.couponUl[couponArrNew].id
      }else{
        couponMoney = 0;
        couponId = null;
      }
      let coupon = {
        couponMoney:couponMoney,
        couponId:parseInt(couponId),
      }
      console.log(coupon);
      this.triggerEvent('couponTotal',coupon)
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
