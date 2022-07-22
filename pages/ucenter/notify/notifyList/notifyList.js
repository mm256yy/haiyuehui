let util = require('../../../../utils/util.js');
let badge = require('../../../../utils/badge.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    notifyUl:[]
  },
  onLoad(options) {

  },
  onShow() {
    badge.notifyBadgeClear()
    this.setData({
      pageNo:1,
      menuVal:0,
    })
    this.init(0,1);
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.menuVal,2)
  },
  //初始化
  init(typeVal,pull){  //pull 1为初始化 2为下拉 
    let param = {
      pageNo:this.data.pageNo,
      // showType:typeVal,
      pageSize:15,
    }
    util.request(api.MemberNotifyList , param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let notifyUl = []
      let data = res.result.records
      if(data.length != 0){ 
        for(let i=0;i<data.length;i++){
          o_li = {
            id:data[i].id,
            status:data[i].status,
            content:data[i].content,
            createTime:data[i].createTime,
          }
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        notifyUl = o_ul;
      }else{
        notifyUl = this.data.notifyUl.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        notifyUl:notifyUl,
      })
    }).catch((err) => {
      this.setData({
        orderUl:[]
      })
    });
  },
})