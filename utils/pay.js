/*支付*/
var util = require('../utils/util.js');
var api = require('../config/api.js');
var app = getApp();

function usePay(param){
  console.log(app.globalData.canPay)
  if(!app.globalData.canPay&&app.globalData.canPay != undefined){  //不能支付
    return false
  }
  app.globalData.canPay = false
  let orderIdCallback = param.orderId
  util.jhxLoadShow("支付中")
  return new Promise(function(resolve, reject){
    util.request(api.CustomizedPay ,param, 'POST').then(res => {
      console.log(res)
      let data = JSON.parse(res.result.respData)
      console.log(data)
      if (res.status.code === 0) { 
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success (res) {
            console.log(res)
            app.globalData.canPay = true
            if(res.errMsg == "requestPayment:ok"){  //成功
              //回调支付是否成功
              util.request(api.CustomizedPayCallback ,{orderId:orderIdCallback}, 'GET').then(function(res) {
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
      }else{
        app.globalData.canPay = true
        reject(false);
      }
    }).catch((err) => {
      app.globalData.canPay = true
      console.log(err)
      reject(false);
    });
  })
  
}

module.exports = {
  usePay,
}