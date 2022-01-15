let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    chooseDate:'今年',
    consumeUl:[
      // {type:'充值',date:'2020-12-12',ref:'备注',money:'-5000',hotelName:''},
    ],
    pageNo:1,
  },
  onLoad: function (options) {
    let date = new Date();
    let val = date.getFullYear()
    this.setData({
      chooseDate:val
    })
  },
  onShow: function () {
    this.setData({
      pageNo:1,
    })
    this.bindConsume(1);
  },
  //选择时间
  bindDateChange(e) {
    let chooseDateNew = e.detail.value
    this.setData({
      chooseDate: chooseDateNew
    })
    this.bindConsume(1);
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.bindConsume(2)
  },
  //获取积分历史
  bindConsume(pull){   //pull 1为初始化 2为下拉
    let chooseDateNew = this.data.chooseDate.toString();
    let param = {
      startDate:chooseDateNew+'-01-01', 
      endDate:chooseDateNew+'-12-01',
      pageNo:this.data.pageNo,
      pageSize:15,
    }
    util.request(api.PointHistory, param , 'GET').then(res => {
      let consumeUl = [];
      let o_ul=[];
      let o_li={};
      let liType = '';
      let liMoney = '';
      let liRef = '';
      let data = res.result.records
      if(data.length != 0){
        for(let i=0;i<data.length;i++){
          let li_credit = (data[i].credit != 0);  //充值
          let li_charge = (data[i].charge != 0);  //消费
          let li_descript = (data[i].descript||data[i].descript == '');  //积分
  
          if(li_credit&&li_descript){  //积分充值
            liType = '充值';  
            liMoney = '+'+data[i].credit;
            liRef = data[i].descript == ''?'(未备注)':data[i].descript
          }else if(li_charge&&li_descript){  //积分消费
            liType = '消费';  
            liMoney = '-'+Math.abs(data[i].charge);
            liRef = data[i].descript == ''?'(未备注)':data[i].descript
          }else{
            liType = '异常';  
            liMoney = '异常';
            liRef = '异常';
          }
          o_li = {
            type:liType,
            date:data[i].date,
            ref:liRef,
            money:liMoney,
            hotelName:data[i].hotelName
          }
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        consumeUl = o_ul;
      }else{
        consumeUl = this.data.consumeUl.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        consumeUl : consumeUl
      })
    }).catch((err) => {});
  },
  endDate(endDate){
    let endDateNew = endDate.split("-");
    if(endDateNew[1] == '12'){
      return (parseInt(endDateNew[0])+1) + '-01'
    }else{
      if(parseInt(endDateNew[1])+1<10){
        return endDateNew[0] + '-0' + (parseInt(endDateNew[1])+1)
      }else{
        return endDateNew[0] + '-' + (parseInt(endDateNew[1])+1)
      }
    }
  },
})