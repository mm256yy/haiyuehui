Page({
  data: {
    type:0,
  },
  onLoad: function (options) {
    let type = options.type
    this.setData({
      type:type
    })
    if(type == 1){
      wx.redirectTo({  
        url:"/pages/member/activity/recruit/recruit"
      });
    }
  },
  onShow: function () {
    
    
  },
  onHide: function () {

  },
})