//判断是否是数字 true 数字 false 非数字
function isNonnum(str){
  let myreg = /^[0-9]*$/;
  if(myreg.test(str)){
    return true;
  }else{
    return false;
  };
};
//判断是否存在 true 纯字符串 false 存在空格或者特殊字符
function spaceNo(str){
  let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if(pattern.test(str)||str.indexOf(" ") >= 0){
    return false;
  }else{
    return true;
  };
};
//判断是否存在值 存在true 不存在 false
function existValue(val){
  if(val&&val != null&&val != 'null'&&val != 'undefined'&&val != undefined){
    return true;
  }else{
    return false;
  }
}
//半透明黑色提示(失败)
function showErrorToast(msg) {
  if(msg.length <= 7){
    wx.showToast({title: msg,image:'/static/images/icon_error.png'})
  }else{
    wx.showToast({title: msg ,icon:'none'})
  }
}
//半透明黑色提示(成功)
function showSuccessToast(msg) {
  wx.showToast({
    title: msg,
    image:'/static/images/icon_success.png'
  })
}
/*验证并且提示*/
//手机号码验证
function checkMobile(mobile){  //使用：if(!check.checkMobile(this.data.mobile)){return false}
  if(mobile.length == 0){
    showErrorToast('手机号不能空');
    return false;
  }else if(mobile.length != 11){
    showErrorToast('手机号长度不正确');
    return false;
  }else if(!spaceNo(mobile)){
    showErrorToast('不能存在特殊字符');
    return false;
  }else{
    return true;
  };
};
//姓名验证
function checkName(name){ //使用：if(!check.checkName(this.data.name)){return false}
  if(name.length == 0){
    showErrorToast('姓名不能为空');
    return false;
  }else if(name.length > 30){
    showErrorToast('姓名不能过长');
    return false;
  }else if(isNonnum(name)){
    showErrorToast('姓名存在数字');
    return false;
  }else if(!spaceNo(name)){
    showErrorToast('不能有特殊字符');
    return false;
  }else{
    return true;
  };
};
//身份证验证
function checkIdentity(identity){  //使用：if(!check.checkIdentity(this.data.identity)){return false}
  if(identity.length == 0){
    showErrorToast('身份证不能为空');
    return false;
  }else if(identity.length < 18){
    showErrorToast('身份证不能小于18位');
    return false;
  }else if(identity.length > 18){
    showErrorToast('身份证不能大于18位');
    return false;
  }else if(!spaceNo(identity)){
    showErrorToast('不能存在特殊字符');
    return false;
  }else{
    return true;
  };
};
//邮箱地址验证
function checkEmail(email){ //使用：if(!check.checkEmail(this.data.email)){return false}
  let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if(email == ''){
    showErrorToast('请正确填写邮箱地址');
  }else if(re.test(email)){
    return true;
  }else {
    showErrorToast('邮箱地址格式错误');
    return false;
  }
}
//金钱验证
function checkMoney(money){ //使用：if(!check.checkMoney(this.data.identity)){return false}
  if(money == 999900 ||money == '0' ||money <= 0 ||money == ''||money == null||money == undefined ||money == 'undefined'){
    showErrorToast('金额错误');
    return false;
  }else{
    return true;
  };
};

//时间验证 是否是当前时间 0 当前时间 大于0 未来时间 小于0 过去时间
function checkIsOverdue(day){
  let dayOld = new Date(day.replace(/-/g,'/')).getTime();
  let date = new Date();
  let YY = date.getFullYear() + '-';
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let dayNew = new Date((YY+MM+DD).replace(/-/g,'/')).getTime();
  let dayNum = (dayOld - dayNew)/(1000*60*60*24);
  // console.log(dayNew);
  // console.log(dayOld);
  if(dayNew === dayOld){
    return 0;
  }else if(dayOld > dayNew){
    return dayNum;
  }else{
    return dayNum;
  };
};

module.exports = {
  isNonnum,
  spaceNo,
  existValue,

  showErrorToast,
  showSuccessToast,

  checkMobile,
  checkName,
  checkIdentity,
  checkEmail,
  checkMoney,

  checkIsOverdue,
}