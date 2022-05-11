let user = require('../../utils/user.js');
Page({
  data: {
    type:0,
  },
  onLoad: function (options) {
    let type = options.type
    this.setData({
      type:type
    })
  },
  onShow: function () {
    user.memberGetInfo().then(res => {
      let type = this.data.type;
      if(type == 1){
        wx.redirectTo({  
          url:"/pages/member/activity/recruit/recruit"
        });
      }else if(type == 2){
        wx.redirectTo({  
          url:"/pages/member/activity/aprilFools/aprilFools"
        });
      }
    }).catch((err) => {
      console.log(err)
    });
  },
})