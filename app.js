let user = require('./utils/user');
let util = require('./utils/util');
//app.js
App({
  onLaunch: function () { 
    this.update();  //是否更新
    // this.userInfo();// 获取用户信息
  },
  onShow: function(data) {
    this.renderingTime();  //日历
    this.otherVal(data);  //获取 邀请码/商城id/兑换码
    // this.invite(data);  //邀请人
    // this.exchange(data); //兑换码转接
  },
  //判断是否有更新内容
  update(){
    //更新
    let updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },

  //邀请人
  

  otherVal(data){

    let option = data.query;
    let json = {};
    let hasVal = false; //判断是否有值？有值则剩下的不赋予值

    let inviteCode = "";
    let goodsId = "";
    let exchangeCode = "";
    let sendId = "";
    console.log('option',option)
    //邀请码
    if(option.inviteCode && !hasVal){  //链接
      inviteCode = option.inviteCode;
    }else if(option.scene  && !hasVal){  //二维码
      json = this.urlToJson(option.scene)
      inviteCode = json.inviteCode
    }
    if(inviteCode){
      hasVal = true
    }
    //商品id
    if(option.goodsId && !hasVal){
      goodsId = option.goodsId;
    }else if(option.scene && !hasVal){
      json = this.urlToJson(option.scene)
      inviteCode = json.code;
      goodsId = json.gid;
    }
    if(goodsId){
      hasVal = true
    }
    //兑换码
    if(option.ids && !hasVal){
      exchangeCode = option.ids;
    }else if(option.scene && !hasVal){
      json = this.urlToJson(option.scene)
      exchangeCode = json.ids
    }
    if(exchangeCode){
      hasVal = true
    }
    //发送会员实物码
    if(option.sendId && !hasVal){
      sendId = option.sendId;
    }else if(option.scene && !hasVal){
      json = this.urlToJson(option.scene)
      sendId = json.sendId
    }
    if(sendId){
      hasVal = true
    }
    //存储
    console.log(inviteCode)
    wx.setStorageSync('othersInviteCode', inviteCode);
    wx.setStorageSync('othersgoodsId', goodsId);
    wx.setStorageSync('exchangeCode', exchangeCode);
    wx.setStorageSync('sendId', sendId);
  },
  //邀请人
  // invite(data){
  //   let option = data.query;
  //   let inviteCode = "";
  //   let goodsId = "";
  //   //用户id
  //   if(option.inviteCode){
  //     inviteCode = option.inviteCode;
  //   }else if(option.scene){
  //     inviteCode = this.sceneSplit(option.scene,0)
  //   }
  //   console.log('code',inviteCode)
  //   // 商城id
  //   if(option.goodsId){
  //     goodsId = option.goodsId;
  //   }else if(option.scene){
  //     goodsId = this.sceneSplit(option.scene,1)
  //   }
  //   wx.setStorageSync('othersInviteCode', inviteCode);
  //   wx.setStorageSync('othersgoodsId', goodsId);
  // },
  //转接兑换码
  // exchange(data){
  //   let option = data.query;
  //   let exchangeCode = option.ids;
  //   wx.setStorageSync('exchangeCode', exchangeCode);
  // },
  //获取用户信息
  userInfo(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('userInfo', res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
            }
          })
        }
      }
    })
  },
  //进行日历处理
  renderingTime(){
    let calendar = wx.getStorageSync("calendar");  //获取数据
    let d_today = new Date();
    if(calendar && (calendar.startTime+1000*60*60*24)>=d_today.getTime()){  //判断是否有储存时间/储存时间大于当前时间 --有
      // console.log(calendar.startTime+1000*60*60*24)
      // console.log(d_today.getTime())
    }else{ //--没有
      let calendarSto = {};
      calendarSto = {
        startTime:new Date(new Date().toLocaleDateString()).getTime(),
        endTime:new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000,
      };
      wx.setStorageSync("calendar", calendarSto);
    }
  },
  //切割scene
  // sceneSplit(date,val){
  //   let str = decodeURIComponent(date).toString().split('&');
  //   console.log('str',this.urlToJson(decodeURIComponent(date).toString()))
  //   if(str[val]){
  //     let pa = str[val].split('=');
  //     return pa[1]
  //   }else{
  //     return null
  //   }
  // },
  //url转json
  urlToJson(date){
    let ret = {};
    let string = decodeURIComponent(date).toString().split('&')
    for(let i = 0;i<string.length;i++){
      let str = string[i].split('=');
      ret[str[0]] = str[1];
    }
    return ret;
  },
  //
  globalData: {},  //切勿删除
}) 