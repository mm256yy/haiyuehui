/*支付*/
let util = require('../utils/util.js');
let check = require('../utils/check.js');
let api = require('../config/api.js');
let app = getApp();
//订房支付
function usePay(param){
  if(!app.globalData.canPay&&app.globalData.canPay != undefined){  //不能支付
    return false;
  }
  app.globalData.canPay = false;
  let orderIdCallback = param.orderId;
  util.jhxLoadShow("支付中");
  return new Promise(function(resolve, reject){
    util.request(api.CustomizedPay ,param, 'POST').then(res => {
      console.log(res);
      if(res.result == null){  //余额支付
        app.globalData.canPay = true;
        //回调支付是否成功
        util.request(api.CustomizedPayCallback ,{orderId:orderIdCallback}, 'GET').then(function(res) {
          console.log(res);
        });
        util.jhxLoadHide();
        resolve(true);
      }else{  //微信支付
        // if(!res.result.respData){
        //   check.showErrorToast(res.result.respMsg)
        //   reject(false);
        //   return false
        // }
        let data = JSON.parse(res.result.respData); //message
        let ssn = res.result.respTxnSsn;
        console.log(data);
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success (res) {
            console.log(res);
            app.globalData.canPay = true;
            if(res.errMsg == "requestPayment:ok"){  //成功
              //回调支付是否成功
              util.request(api.CustomizedPayCallback ,{orderId:orderIdCallback,ssn:ssn}, 'GET').then(function(res) {
                console.log(res);
              });
              util.jhxLoadHide();
              resolve(true);
            }else{
              reject(false);
              util.jhxLoadHide();
            }
          },
          fail (res) {
            console.log(res);
            app.globalData.canPay = true;
            util.jhxLoadHide();
            reject(false);
          }
        })
      }
    }).catch((err) => {
      console.log(err);
      wx.showModal({
        title: '失败',
        content: err,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.canPay = true;
            reject(false);
          } else if (res.cancel) {
            console.log('用户点击取消')
            app.globalData.canPay = true;
            reject(false);
          }
        }
      })
    });
  })
}
//充值
function rechargePay(param){
  if(!app.globalData.canPay&&app.globalData.canPay != undefined){  //不能支付
    return false;
  };
  app.globalData.canPay = false;
  let orderIdCallback = param.rechargeId;
  util.jhxLoadShow("支付中");
  return new Promise(function(resolve, reject){
    util.request(api.MemberRechargePrepay ,param, 'POST').then(res => {
      console.log(res);
      // if(!res.result.respData){
      //   check.showErrorToast('支付失败')
      //   reject(false);
      //   return false
      // }
      let data = JSON.parse(res.result.respData);
      let ssn = res.result.respTxnSsn;
      console.log(data);
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success (res) {
          console.log(res);
          app.globalData.canPay = true;
          if(res.errMsg == "requestPayment:ok"){  //成功
            //回调支付是否成功
            util.request(api.MemberRechargeCallback ,{rechargeId:orderIdCallback,ssn:ssn}, 'GET').then(function(res) {
              console.log(res);
            });
            util.jhxLoadHide();
            resolve(true);
          }else{
            reject(false);
            util.jhxLoadHide();
          }
        },
        fail (res) {
          console.log(res);
          app.globalData.canPay = true;
          util.jhxLoadHide();
          reject(false);
        }
      })
    }).catch((err) => {
      console.log(err);
      wx.showModal({
        title: '失败',
        content: err,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.canPay = true;
            reject(false);
          } else if (res.cancel) {
            console.log('用户点击取消')
            app.globalData.canPay = true;
            reject(false);
          }
        }
      })
    });
  });
}
//商城支付
function mallPay(param){
  if(!app.globalData.canPay&&app.globalData.canPay != undefined){  //不能支付
    return false;
  }
  app.globalData.canPay = false;
  let orderIdCallback = param.orderId;
  util.jhxLoadShow("支付中");
  return new Promise(function(resolve, reject){
    util.request(api.MallPay ,param, 'POST').then(res => {
      console.log(res);
      if(res.result == null){  //余额支付
        app.globalData.canPay = true;
        //回调支付是否成功
        util.request(api.MallPayCallback ,{orderId:orderIdCallback}, 'GET').then(function(res) {
          console.log(res);
        });
        util.jhxLoadHide();
        resolve(true);
      }else{  //微信支付
        // if(!res.result.respData){
        //   check.showErrorToast(res.result.respMsg)
        //   reject(false);
        //   return false
        // }
        let data = JSON.parse(res.result.respData); //message
        let ssn = res.result.respTxnSsn;
        console.log(data);
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success (res) {
            console.log(res);
            app.globalData.canPay = true;
            if(res.errMsg == "requestPayment:ok"){  //成功
              //回调支付是否成功
              util.request(api.MallPayCallback ,{orderId:orderIdCallback,ssn:ssn}, 'GET').then(function(res) {
                console.log(res);
              });
              util.jhxLoadHide();
              resolve(true);
            }else{
              reject(false);
              util.jhxLoadHide();
            }
          },
          fail (res) {
            console.log(res);
            app.globalData.canPay = true;
            util.jhxLoadHide();
            reject(false);
          }
        })
      }
    }).catch((err) => {
      console.log(err);
      wx.showModal({
        title: '失败',
        content: err,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.canPay = true;
            reject(false);
          } else if (res.cancel) {
            console.log('用户点击取消')
            app.globalData.canPay = true;
            reject(false);
          }
        }
      })
    });
  })
}
module.exports = {
  usePay,
  rechargePay,
  mallPay,
};