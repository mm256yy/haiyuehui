let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    chooseDate:'本月',
    chooseType:1,
    orderBonusUl:[  //收益详情
      // {type:1,bonus:6600,orderId:'4564564564646',time:"2020-08-10T16:25:45"},
    ],
    bonusHistoryUl:[  //余额流水
      // {memberId:'4564564564646',changes:2300,balance:6600,time:"2020-08-10T16:25:45"},
    ],
    pageNo:1,
  },
  onLoad: function (options) {
    this.todayMonth();
  },
  onShow: function () {
    this.setData({
      pageNo:1,
      chooseType:1,
    })
    this.bindorderBonus(1);
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    });
    if(this.data.chooseType == 1){
      this.bindorderBonus(2)
    }else{
      this.bindbonusHistory(2)
    }
  },
  //显示当前月份
  todayMonth(){
    let date = new Date();
    let val = date.getFullYear()+'-'+ util.formatNumber(date.getMonth() + 1)
    this.setData({
      chooseDate:val
    })
  },
  //选择类型
  funChooseType(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      chooseType : index,
      pageNo:1,
    })
    if(index == 1){
      this.bindorderBonus(1)
    }else{
      this.bindbonusHistory(1)
    }
  },
  //选择时间
  bindDateChange(e) {
    let chooseDateNew = e.detail.value
    this.setData({
      chooseDate: chooseDateNew,
      pageNo:1,
    })
    if(this.data.chooseType == 1){
      this.bindorderBonus(1);
    }else{
      this.bindbonusHistory(1);
    }
  },
  bindorderBonus(pull){//1收益详情 1初始化 2下拉
    let chooseDateNew = this.data.chooseDate;
    let param = {
      startDate:chooseDateNew+'-01', 
      endDate:this.endDate(chooseDateNew)+'-01',
      pageSize:15,
      pageNo:this.data.pageNo
    }
    console.log(param);
    util.request(api.MemberInviteOrderBonus, param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let incomeUlNew = [];
      let data = res.result.records;
      if(data.length != 0){ 
        for(let i=0;i<data.length;i++){
          o_li = {
            type:data[i].reason,
            bonus:data[i].bonus,
            orderId:data[i].orderId,
            time:data[i].createTime
          }
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        incomeUlNew = o_ul;
      }else{
        incomeUlNew = this.data.orderBonusUl.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        orderBonusUl:incomeUlNew,
      })
    }).catch((err) => {});
  },
  bindbonusHistory(pull){//2余额流水 1初始化 2下拉
    let that = this;
    let chooseDateNew = this.data.chooseDate;
    let param = {
      startDate:chooseDateNew+'-01', 
      endDate:this.endDate(chooseDateNew)+'-01',
      pageSize:15,
      pageNo:this.data.pageNo
    }
    console.log(param);
    util.request(api.MemberInviteBonusHistory, param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let incomeUlNew = [];
      let data = res.result.records;
      if(data.length != 0){ 
        for(let i=0;i<data.length;i++){
          o_li = {
            memberId:data[i].memberId?data[i].memberId:'暂无',
            changes:data[i].changes,
            balance:data[i].balance,
            time:data[i].createTime,
            remark:data[i].remark,
          }
          o_ul.push(o_li)
        }
      }
      console.log(pull)
      if(pull == 1){  //初始化
        incomeUlNew = o_ul;
      }else{
        console.log(data.length == 0)
        incomeUlNew = that.data.bonusHistoryUl.concat(o_ul);
        console.log(data.length == 0)
        if(data.length == 0){
          console.log(666)
          that.setData({
            pageNo:that.data.pageNo - 1
          });
        }
      };
      console.log(incomeUlNew)
      this.setData({
        bonusHistoryUl:incomeUlNew,
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