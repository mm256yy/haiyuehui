// pages/ucenter/teamNumber/teamNumber.js
var util = require('../../../utils/util.js');
Page({
  data: {
    chooseNum:3,
    teamNum:0,
    pwdVal:[],
    pwdBtn:[1,2,3,4,5,6,7,8,9],
    peopleType:0,
    info:[
      {
        name:'',
        mobile:'',
        identity:'',
      }
    ]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  //下一步
  define(){
    if(this.data.chooseNum == 4){
      if(!util.checkName(this.data.info[0].name)){return false}
      if(!util.checkIdentity(this.data.info[0].identity)){return false}
      //if(!util.checkMobile(this.data.info[0].mobile)){return false}
    }else{
      this.setData({
        chooseNum:this.data.chooseNum + 1 
      })
    }
  },
  //上一步
  back(){
    this.setData({
      chooseNum:this.data.chooseNum - 1 
    })
  },
  //input
  bindNumInput(e){
    this.setData({
      teamNum: e.detail.value
    });
  },
  bindMobileInput(e) {
    this.setData({
      'info[0].mobile': e.detail.value
    });
  },
  bindNameInput(e) {
    this.setData({
      'info[0].name': e.detail.value
    });
  },
  bindIdentityInput(e) {
    this.setData({
      'info[0].identity': e.detail.value
    });
  },
  //输入按钮
  pwdBtn(e){
    let val = e.currentTarget.dataset.val;
    console.log(val);
    let pwdValNew = this.data.pwdVal;
    if(this.data.pwdVal.length<3){
      pwdValNew.push(val)
      this.setData({
        pwdVal:pwdValNew
      })
    }else if(this.data.pwdVal.length == 3){
      pwdValNew.push(val)
      this.setData({
        pwdVal:pwdValNew
      })
      //调起下一步
      this.define()
    }
  },
  //输入删除
  pwdDel(){
    let pwdValNew = this.data.pwdVal;
    pwdValNew.pop();
    console.log(pwdValNew)
    this.setData({
      pwdVal:pwdValNew
    })
  },
  //选择入住类型
  peopleType(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      peopleType:type
    })
    //调起下一步
    this.define()
  }
})