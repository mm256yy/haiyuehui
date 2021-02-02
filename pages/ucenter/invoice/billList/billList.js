Page({
  data: {
    chooseDate:'本月',
    billUl:[
      {title:'杭州海外海国际酒店敖德萨打扫打扫打扫打扫打扫打扫打扫打扫打扫',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
      {title:'海外海',money:264500,date:'2021-01-09'},
    ]
  },
  onShow: function () {

  },
  //选择时间
  bindDateChange(e) {
    let chooseDateNew = e.detail.value
    this.setData({
      chooseDate: chooseDateNew
    })
    this.bindConsume(this.data.chooseType);
  },
  //去开发票
  goApplyInvoice(){
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/applyInvoice/applyInvoice"
    });
  },
})