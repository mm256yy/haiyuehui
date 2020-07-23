let check = require('../../../utils/check.js');
let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');

Page({
  data: {
    typeMenu:2,
    detailedShow:0,
    pageNo:1,
    couponUl:[
      // {
      //   id:0,
      //   type:1,
      //   name:'酒店价格满300减免',
      //   startTimeS:'2020-05-04',
      //   endTimeS:'2020-06-04',
      //   onlyTimeS:4,
      //   fullMoney:20000,
      //   fullMoneyS:200.00,
      //   price:1000,
      //   priceS:10.00,
      // },
      // {
      //   id:0,
      //   type:2,
      //   name:'酒店价格满500减免',
      //   startTimeS:'2020-05-04',
      //   endTimeS:'2020-06-04',
      //   onlyTimeS:0,
      //   fullMoney:20000,
      //   fullMoneyS:200.00,
      //   price:1000,
      //   priceS:10.00,
      // },
      // {
      //   id:0,
      //   type:3,  
      //   name:'酒店价格满700减免',
      //   startTimeS:'2020-05-04',
      //   endTimeS:'2020-06-04',
      //   onlyTimeS:0,
      //   fullMoney:20000,
      //   fullMoneyS:200.00,
      //   price:1000,
      //   priceS:10.00,
      // },
    ],
    
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.init(2,1);
    this.setData({
      typeMenu:2,
    })
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.typeMenu,2)
  },
  init(showType,pull){  //类型 , 是否初始化
    let param = {
      pageNo:this.data.pageNo,
      showType:showType,
      pageSize:15, 
    };
    console.log(param)
    util.request(api.MemberCouponList , param , 'GET').then(res => {
      let c_ul = [];
      let c_li = {};
      let couponUlNew = [];
      let data = res.result.records;
      if(data.length == 0){
      }else{
        for(let i=0;i<data.length;i++){
          c_li = {
            id:data[i].id,
            type:showType,
            name:data[i].name,
            startTimeS:data[i].startTime,
            endTimeS:data[i].endTime,
            onlyTimeS:this.onlyTimeS(data[i].startTime,data[i].endTime),
            fullMoney:data[i].fullMoney,
            fullMoneyS:(data[i].fullMoney/100),
            price:data[i].money,
            priceS:(data[i].money/100),
          }
          c_ul.push(c_li)
        }
        if(pull == 1){  //初始化
          couponUlNew = c_ul;
        }else{
          if(data.length == 0){
            couponUlNew = this.data.couponUl.concat(c_ul);
            this.setData({
              pageNo:this.data.pageNo - 1,
            })
          }else{
            couponUlNew = this.data.couponUl.concat(o_ul);
          };
        };
        this.setData({
          couponUl:couponUlNew
        });
      }
    }).catch((err) => {
      // wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //使用规则
  detailedShow(e){
    if(e.currentTarget.dataset.detailedId == this.data.detailedShow){
      this.setData({
        detailedShow:0
      })
    }else{
      this.setData({
        detailedShow:e.currentTarget.dataset.detailedId
      })
    }
  },
  //选择类型
  typeBind(e){
    this.setData({
      typeMenu:e.currentTarget.dataset.type,
      pageNo:1,
    });
    this.init(this.data.typeMenu,1);
  },
  //剩余时间
  onlyTimeS(startTime,endTime){
    let start = new Date(startTime.replace(/-/g,'/')).getTime();
    let end = new Date(endTime.replace(/-/g,'/')).getTime();
    let num = (end - start)/(100*60*60*24);
    return num;
  },
})