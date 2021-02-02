Page({
  data: {
    titleUl:[
      {id:'2',name:'杭州临武医药科技有限公司',num:'45645645645'},
      {id:'2',name:'杭州临武医药科技有限公司',num:'45645645645'},
    ]
  },
  onShow: function () {

  },
  goInvoiceTitleDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/invoiceTitleDetail/invoiceTitleDetail?id="+id
    });
  },
  addInvoiceTitle(){
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/invoiceTitleEdit/invoiceTitleEdit"
    });
  },
})