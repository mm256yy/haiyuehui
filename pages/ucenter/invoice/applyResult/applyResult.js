Page({
  data: {
    result:{
      success:true,
      money:5602300,
      company:'海外海集团',
      orderId:'456484121544564',
      date:'2010-01-01 16:60:05',
    }
  },
  onShow: function () {

  },
  goBillList(){
    wx.navigateBack({ 
      delta: 2  
    }); 
  },
})