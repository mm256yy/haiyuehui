//判断是否是手机号
function isValidPhone(str) {
  let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}
//判断是否是数字 true 数字 false 非数字
function isNonnum(str){
  let myreg = /^[0-9]*$/;
  if(myreg.test(str)){
    return true;
  }else{
    return false;
  }
}
//判断是否存在 true 纯字符串 false 存在空格或者特殊字符
function spaceNo(str){
  let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if(pattern.test(str)||str.indexOf(" ") >= 0){
    return false;
  }else{
    return true;
  }
}

/*验证并且提示*/
//手机号码验证
function checkMobile(mobile){  //使用：if(!check.checkMobile(this.data.mobile)){return false}
  if(mobile.length == 0){
    wx.showModal({
      title: '错误信息',
      content: '手机号不能为空',
      showCancel: false
    });
    return false;
  }else if(!isValidPhone(mobile)){
    wx.showModal({
      title: '错误信息',
      content: '手机号输入不正确',
      showCancel: false
    });
    return false;
  }else if(!spaceNo(mobile)){
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
function checkName(name){ //使用：if(!check.checkName(this.data.name)){return false}
  if(name.length == 0){
    wx.showModal({
      title: '错误信息',
      content: '姓名不能为空',
      showCancel: false
    });
    return false;
  }else if(isNonnum(name)){
    wx.showModal({
      title: '错误信息',
      content: '姓名不能为数字',
      showCancel: false
    });
    return false;
  }else if(!spaceNo(name)){
    wx.showModal({
      title: '错误信息',
      content: '姓名不能存在空格或者特殊字符',
      showCancel: false
    });
    return false;
  }else{
    return true;
  }
}
//身份证验证
function checkIdentity(identity){  //使用：if(!check.checkIdentity(this.data.identity)){return false}
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
  }else if(identity.length > 18){
    wx.showModal({
      title: '错误信息',
      content: '身份证不能大于18位',
      showCancel: false
    });
    return false;
  }else if(!spaceNo(identity)){
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
//金钱验证
function checkMoney(money){ //使用：if(!check.checkMoney(this.data.identity)){return false}
  if(money == 999900 ||money == '0' ||money <= 0 ||money == ''||money == null||money == undefined ||money == 'undefined'){
    wx.showModal({
      title: '错误信息',
      content: '金额错误',
      showCancel: false
    });
    return false;
  }else{
    return true;
  }
}
//时间验证 是否过期
function checkIsOverdue(time){
  let timeNew = new Date(time).getTime();
  let day = new Date().getTime();
  if(day>(timeNew+1000*60*60*24)){
    return true;
  }else{
    return false;
  }
}
//时间验证 是否是当前时间
function checkCanStay(day){
  let dayOld = new Date(day).getTime();
  let date = new Date();
  let YY = date.getFullYear() + '-';
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let dayNew = new Date(YY+MM+DD).getTime();
  console.log(dayNew)
  console.log(dayOld)
  if(dayNew === dayOld){
    return true;
  }else{
    return false;
  }
}

module.exports = {
  isValidPhone,
  isNonnum,
  spaceNo,

  checkMobile,
  checkName,
  checkIdentity,
  checkMoney,

  checkIsOverdue,
  checkCanStay,
}