let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    chooseDate:'本月',
    chooseType:0,
    consumeUl:[
      // {type:'充值',date:'2020-12-12',ref:'备注',money:'-5000',hotelName:''},
    ]
  },
  onLoad: function (options) {
    let date = new Date();
    let val = date.getFullYear()+'-'+ util.formatNumber(date.getMonth() + 1)
    this.setData({
      chooseDate:val
    })
  },
  onShow: function () {
    this.bindConsume();
  },
  //选择时间
  bindDateChange(e) {
    let chooseDateNew = e.detail.value
    this.setData({
      chooseDate: chooseDateNew
    })
    this.bindConsume();
  },
  bindConsume(){  
    let chooseDateNew = this.data.chooseDate;
    let param = {
      startDate:chooseDateNew+'-01', 
      endDate:this.endDate(chooseDateNew)+'-01',
    }
    console.log(param)
    util.request(api.MemberRechargeHistory, param , 'GET').then(res => {
      let ul=[];
      let li={};
      let liType = '';
      let liMoney = '';
      let liRef = '';
      for(let i=0;i<res.result.length;i++){
        let li_credit = (res.result[i].credit != 0);  //充值
        let li_charge = (res.result[i].charge != 0);  //消费
        let li_ref = (res.result[i].ref||res.result[i].ref == '');  //余额

        if(li_credit&&li_ref){  //余额充值
          liType = '充值';  
          liMoney = '+'+(res.result[i].credit/100).toFixed(2);
          liRef = res.result[i].ref == ''?'(未备注)':res.result[i].ref;
        }else if(li_charge&&li_ref){ //余额消费
          liType = '消费';  
          liMoney = '-'+Math.abs(res.result[i].charge/100).toFixed(2);
          liRef = res.result[i].ref == ''?'(未备注)':res.result[i].ref;
        }else{
          liType = '异常';  
          liMoney = '异常';
          liRef = '异常';
        }
        li = {
          type:liType,
          date:res.result[i].date,
          ref:liRef,
          money:liMoney,
          hotelName:res.result[i].hotelName
        }
        ul.push(li)
      }
      this.setData({
        consumeUl : ul
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