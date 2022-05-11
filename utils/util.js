let api = require('../config/api.js');
let check = require('./check.js')
let app = getApp();

//时间转化 时间戳 ==> 2020-05-14 16:40:08
function formatTime(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//时间转化 5 ==> '05'
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
//时间转化 数字转化星期 0 ==> '周日'
function formatWeek(n){
  let week = ['周日','周一','周二','周三','周四','周五','周六'];
  return week[new Date(n).getDay()];
}
//设置白名单（白名单的地址列表不会强制跳转登陆和绑定手机号）
function whiteList(){
  let pages = getCurrentPages();
  let currPage = null;
  if (pages.length) {
    currPage = pages[pages.length - 1].route;
  }
  let whiteList = [null,"pages/index/index","pages/ucenter/index/index","pages/ucenter/order/orderList/orderList","pages/market/marketOrderList/marketOrderList","pages/market/shoppingCart/shoppingCart","pages/market/marketList/marketList","pages/market/marketDetailed/marketDetailed","pages/market/marketExchange/marketExchange"];  //跳转白名单
  if(whiteList.indexOf(currPage) >= 0){ //存在
    return true;
  }else{
    return false;
  }
}
/*封封微信的的request*/
function request(url, data = {}, method = "GET") {
  jhxLoadShow("加载中")
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        console.log(res);
        jhxLoadHide();
        if (res.statusCode == 200) {
          if(res.data.code == 0||res.data == "ok"){  //判断是否成功
            resolve(res.data);
          }else if(res.data.message == "未登录"||res.data.message == '请先登录'){
            let iswhiteList = whiteList();
            if(iswhiteList){ //存在
              //未登陆
            }else{
              let pages = getCurrentPages();
              if(pages.length <= 1){
                wx.navigateTo({
                  url: "/pages/auth/login/login"
                });
              }else{
                wx.redirectTo({
                  url: "/pages/auth/login/login"
                });
              }
            }
            wx.showToast({title: "未登陆" ,image:'/static/images/icon_error.png'})
            reject("未登陆");
          }else if(res.data.message){
            if(res.data.message.length <= 7){
              wx.showToast({title: res.data.message ,image:'/static/images/icon_error.png'})
            }else if(res.data.message.length <= 14&&res.data.message.length>7){
              wx.showToast({title: res.data.message ,icon:'none'})
            }else{
              wx.showModal({title: '提示',content: res.data.message})
            }
            reject(res.data.message);
          }else if(res.data.message == null){
            console.log(res.data.message);
          }else{
            wx.showToast({title: "未知异常" ,image:'/static/images/icon_error.png'})
            reject("未知异常");
          }
        } else {
          wx.showToast({title: "未连接服务器" ,image:'/static/images/icon_error.png'})
          reject("未连接到服务器200+");
          console.log(res.errMsg);
        }
      },
      fail: function(err) {
        jhxLoadHide()
        wx.showToast({title: "网络连接失败" ,image:'/static/images/icon_error.png'})
        reject("网络连接失败")
        console.log(err)
      }
    })
  });
}
/*封封微信的的request*/
function requestPOST(url, data = {}, method = "POST") {
  jhxLoadShow("加载中")
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-HWH-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        // console.log(res.data);
        jhxLoadHide();
        if (res.statusCode == 200) {
          if(res.data.code == 0||res.data == "ok"){  //判断是否成功
            resolve(res.data);
          }else if(res.data.message == "未登录"||res.data.message == '请先登录'){
            let iswhiteList = whiteList();
            if(iswhiteList){ //存在
              //未登陆
            }else{
              let pages = getCurrentPages();
              if(pages.length <= 1){
                wx.navigateTo({
                  url: "/pages/auth/login/login"
                });
              }else{
                wx.redirectTo({
                  url: "/pages/auth/login/login"
                });
              }
            }
            wx.showToast({title: "未登陆" ,image:'/static/images/icon_error.png'})
            reject("未登陆");
          }else if(res.data.message){
            if(res.data.message.length <= 7){
              wx.showToast({title: res.data.message ,image:'/static/images/icon_error.png'})
            }else if(res.data.message.length <= 14&&res.data.message.length>7){
              wx.showToast({title: res.data.message ,icon:'none'})
            }else{
              wx.showModal({title: '提示',content: res.data.message})
            }
            reject(res.data.message);
          }else if(res.data.message == null){
            console.log(res.data.message);
          }else{
            wx.showToast({title: "未知异常" ,image:'/static/images/icon_error.png'})
            reject("未知异常");
          }
        } else {
          wx.showToast({title: "未连接服务器" ,image:'/static/images/icon_error.png'})
          reject("未连接到服务器200+");
          console.log(res.errMsg);
        }
      },
      fail: function(err) {
        jhxLoadHide()
        wx.showToast({title: "网络连接失败" ,image:'/static/images/icon_error.png'})
        reject("网络连接失败")
        console.log(err)
      }
    })
  });
}

//加载中效果（显示）
function jhxLoadShow(message) {
  wx.setStorageSync("jhxLoadShow", 1);
  if (wx.showLoading) {  // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message, 
      mask: true
    });
  } else {    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message, 
      icon: 'loading', 
      mask: true, 
      duration: 20000
    });
  }
}
//加载中效果（隐藏）
function jhxLoadHide() {
  let jhxLoadShow = wx.getStorageSync("jhxLoadShow");
  if(jhxLoadShow == 1){
    wx.setStorageSync("jhxLoadShow", 0);
    if (wx.hideLoading) {    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.hideLoading();
    } else {
      wx.hideToast();
    }
  }
}
//身份证信息处理 	350102200103077639 ==> 35010*******77639
function identityCard(val){  
  //let val = JSON.stringify(num)
  if(val){
    let valLength = val.length;
    let valNew = val.substring(0,5) +'**********'+val.substring(valLength-2,valLength)
    return valNew
  }else{
    return '未查询到身份证信息'
  }
}
//手机号隐藏
function mobileCard(val){
  let valLength = val.length;
  let valNew = val.substring(0,3) +'******'+val.substring(valLength-2,valLength)
  return valNew
}
//会员类型
function memberGrade(type){
  if(type == "GBK"){
    return 0;
  }else if(type == "YK"){
    return 1;
  }else if(type == "JK"){
    return 2;
  }else if(type == "BJK"){
    return 3;
  }else if(type == "HJK"){
    return 4;
  }else{
    return 0;
  }
}
//金钱判断
function importantMoney(money){
  if(money == '0' ||money <= 0 ||money == ''||money == null||money == undefined ||money == 'undefined'){
    return 999900;
  }else{
    return money;
  }
}


//网络监听
function networkManage(){
  let that = this;
    //监听网络状态
  wx.onNetworkStatusChange(function (res) {
    if (!res.isConnected) {
      that.msg('网络似乎不太顺畅');
    }
  })
}

module.exports = {
  formatTime,
  formatNumber,
  formatWeek,

  whiteList,
  request,
  requestPOST,

  jhxLoadShow,
  jhxLoadHide,
  identityCard,
  mobileCard,
  networkManage,

  memberGrade,
  importantMoney,
}