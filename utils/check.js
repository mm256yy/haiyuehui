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

module.exports = {
  isValidPhone,
  isNonnum
}