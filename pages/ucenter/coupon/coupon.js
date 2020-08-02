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
      //   price:1000,
      // },
    ],
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.setData({
      typeMenu:2,
      pageNo:1,
    })
    this.init(2,1);
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.typeMenu,2)
  },
  init(showType,pull){  //类型 , 是否1初始化 2加载
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
      if(data.length != 0){
        for(let i=0;i<data.length;i++){
          c_li = {
            id:data[i].id,
            type:showType,
            name:data[i].name,
            startTimeS:this.daySplit(data[i].startTime),
            endTimeS:this.daySplit(data[i].endTime),
            onlyTimeS:this.onlyTimeS(data[i].startTime,data[i].endTime),
            fullMoney:data[i].fullMoney,
            price:data[i].subtractMoney,
          }
          c_ul.push(c_li)
        }
      }
      if(pull == 1){  //初始化
        couponUlNew = c_ul;
      }else{  //加载
        couponUlNew = this.data.couponUl.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1,
          })
        }
      };
      this.setData({
        couponUl:couponUlNew
      });
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
    let type = parseInt(e.currentTarget.dataset.type)
    this.setData({
      typeMenu:type,
      pageNo:1,
    });
    this.init(type,1);
  },
  //剩余时间
  onlyTimeS(startTime,endTime){
    let start = new Date().getTime();
    let end = new Date(endTime.replace(/-/g,'/')).getTime();
    let num = parseInt((end - start)/(1000*60*60*24));
    return num+1;
  },
  //跳转到酒店列表
  hotelsList(){
    wx.navigateTo({ 
      url: "/pages/customized/hotelsList/hotelsList"
    });
  },
  //split
  daySplit(time){
    if(time.split(' ')[1] == "00:00:00"){
      let date = new Date(time.split(' ')[0].replace(/-/g,'/')).getTime()-1;
      let year = new Date(date).getFullYear();
      let month = util.formatNumber(new Date(date).getMonth() + 1);
      let day = util.formatNumber(new Date(date).getDate());
      return year + '-' + month + '-' + day;
      // return time.split(' ')[0];
    }else{
      return time.split(' ')[0];
    }
  },
})