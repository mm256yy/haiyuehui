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
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  if(pattern.test(str)||str.indexOf(" ") >= 0){
    return false;
  }else{
    return true;
  }
}

module.exports = {
  isValidPhone,
  isNonnum,
  spaceNo,
}