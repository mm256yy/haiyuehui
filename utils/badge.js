let util = require('../utils/util.js');
let api = require('../config/api.js');
function notifyBadgeSet() {
  let notifyBadge = wx.getStorageSync('notifyBadge')
  if(!notifyBadge){
    util.request(api.MemberNotifyUnreadCount , 'GET').then(res => {
      let num = res.result
      wx.setStorageSync('notifyBadge', num);
      if(num > 0){
        wx.setTabBarBadge({
          index: 3,
          text: num.toString(),
        })
      }
    }).catch((err) => {});
  }
}
function notifyBadgeClear() {
  let notifyBadge = wx.getStorageSync('notifyBadge')
  if(notifyBadge){
    wx.clearStorageSync('notifyBadge')
    wx.removeTabBarBadge({
      index: 3,
    })
  }
}
module.exports = {
  notifyBadgeSet,
  notifyBadgeClear
};