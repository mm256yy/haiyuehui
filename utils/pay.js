/*支付*/
let util = require('../utils/util.js');
let api = require('../config/api.js');
let app = getApp();
//订房支付
function usePay(param){
  console.log(app.globalData.canPay);
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
      app.globalData.canPay = true;
      console.log(err);
      reject(false);
    });
  })
}
//充值
function rechargePay(param){
  console.log(app.globalData.canPay);
  if(!app.globalData.canPay&&app.globalData.canPay != undefined){  //不能支付
    return false;
  };
  app.globalData.canPay = false;
  let orderIdCallback = param.rechargeId;
  util.jhxLoadShow("支付中");
  return new Promise(function(resolve, reject){
    util.request(api.MemberRechargePrepay ,param, 'POST').then(res => {
      console.log(res);
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
      app.globalData.canPay = true;
      console.log(err);
      reject(false);
    });
  });
}
module.exports = {
  usePay,
  rechargePay,
};