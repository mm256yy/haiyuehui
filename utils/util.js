var api = require('../config/api.js');
var app = getApp();
var check = require('./check.js')
var debug = true;  //开启测试

//时间转化 时间戳 ==> 2020-05-14 16:40:08
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//时间转化 5 ==> '05'
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时间转化 数字转化星期 0 ==> '周日'
function formatWeek(n){
  let week = ['周日','周一','周二','周三','周四','周五','周六']
  return week[new Date(val).getDay()]
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
        jhxLoadHide()
        if (res.statusCode == 200) {
          resolve(res.data);
          /*if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/auth/login/login'
            });
          } else {
            resolve(res.data);
          }*/
        } else {
          reject(res.errMsg);
        }
      },
      fail: function(err) {
        jhxLoadHide()
        reject(err)
        showErrorToast("网络异常")
      }
    })
  });
}
//半透明黑色提示(失败)
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image:'/static/images/icon_error.png'
  })
}
//半透明黑色提示(成功)
function showSuccessToast(msg) {
  wx.showToast({
    title: msg,
    image:'/static/images/icon_success.png'
  })
}
//加载中效果（显示）
function jhxLoadShow(message) {
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
  if (wx.hideLoading) {    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}
//身份证信息处理 	350102200103077639 ==> 35010*******77639
function identityCard(val){  
  //let val = JSON.stringify(num)
  let valLength = val.length;
  let valNew = val.substring(0,5) +'**********'+val.substring(valLength-2,valLength)
  return valNew
}

/*验证并且提示*/
//手机号码验证
function checkMobile(mobile){  //使用：if(!util.checkMobile(this.data.mobile)){return false}
  if(mobile.length == 0){
    wx.showModal({
      title: '错误信息',
      content: '手机号不能为空',
      showCancel: false
    });
    return false;
  }else if(!check.isValidPhone(mobile)){
    wx.showModal({
      title: '错误信息',
      content: '手机号输入不正确',
      showCancel: false
    });
    return false;
  }else if(!check.spaceNo(mobile)){
    wx.showModal({
      title: '错误信息',
      content: '手机号不能存在空格或者特殊字符',
      showCancel: false
    });
    return false;
  }else{
    return true;
  }
}
//姓名验证
function checkName(name){ //使用：if(!util.checkName(this.data.name)){return false}
  if(name.length == 0){
    wx.showModal({
      title: '错误信息',
      content: '姓名不能为空',
      showCancel: false
    });
    return false;
  }else if(check.isNonnum(name)){
    wx.showModal({
      title: '错误信息',
      content: '姓名不能为数字',
      showCancel: false
    });
    return false;
  }else if(!check.spaceNo(name)){
    wx.showModal({
      title: '错误信息',
      content: '姓名不能存在空格或者特殊字符',
      showCancel: false
    });
    return false;
  }else{
    console.log("姓名成功+"+name)
    return true;
  }
}
//身份证验证
function checkIdentity(identity){  //使用：if(!util.checkIdentity(this.data.identity)){return false}
  if(identity.length == 0){
    wx.showModal({
      title: '错误信息',
      content: '身份证不能为空',
      showCancel: false
    });
    return false;
  }else if(identity.length < 18){
    wx.showModal({
      title: '错误信息',
      content: '身份证不能小于18位',
      showCancel: false
    });
    return false;
  }else if(!check.spaceNo(identity)){
    wx.showModal({
      title: '错误信息',
      content: '身份证不能存在空格或者特殊字符',
      showCancel: false
    });
    return false;
  }else{
    return true;
  }
}

//网络监听
function networkManage(){
  let that = this
    //监听网络状态
  wx.onNetworkStatusChange(function (res) {
    if (!res.isConnected) {
      that.msg('网络似乎不太顺畅');
    }
  })
}
//测试环境
function aa(val){
  if(debug){  //测试环境
    console.log(val)
  }
}
module.exports = {
  formatTime,
  formatWeek,
  request,
  showErrorToast,
  showSuccessToast,
  jhxLoadShow,
  jhxLoadHide,
  identityCard,
  networkManage,

  checkMobile,
  checkName,
  checkIdentity,

  aa,
}