let util = require('../../../utils/util.js');
let api = require('../../../config/api.js');
let user = require('../../../utils/user.js');
let check = require('../../../utils/check.js');
Page({
  data: {
    typeMenu:0,
    pageNo:1,
    exchangeList:[
      // {
      //   id:0,
      //   used:0,
      //   name:'酒店价格满减免酒店满减免酒店满减免酒店满...',
      //   img:'',
      //   spec:'150ml',
      //   code:'4455 5222 5423',
      //   orgCode:'',  //公司
      //   time:'2020-12-12',
      //   choose:false,
      //   tap:'',
      // },
    ],
    info:{
      memberId:''
    },
    totle:{
      choose:false,
      num:0,
    }
  },
  onLoad: function (options) {
    user.goToLogin();
  },
  onReady:function () {
    this.tabValId = this.selectComponent("#tabValId");
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.list(this.data.typeMenu,2)
  },
  onShow: function () {
    this.member();
    this.setData({
      'totle.choose':false,
      'totle.num':0,
    })
  },
  onReady:function(){
    this.badgeHideTo();
  },
  //类型
  typeTap(e){
    let used = parseInt(e.currentTarget.dataset.used)
    this.setData({
      typeMenu:used,
      pageNo:1,
      'totle.num':0,
      'totle.choose':false,
    });
    this.list(used,1);
  },
  //列表
  list(used,pull){
    let param = {
      pageNo:this.data.pageNo,
      used:used,
      pageSize:15, 
      memberId:this.data.info.memberId,
    };
    util.request(api.MallMemberGoodsList , param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let listNew = [];
      let data = res.result.records;
      if(data.length != 0){
        for(let i=0;i<data.length;i++){
          o_li = {
            id:data[i].id,
            used:used,
            name:this.nameLength(data[i].title),
            img:data[i].img,
            spec:data[i].spec,
            code:data[i].code,
            orgCode:data[i].orgCode,
            time:data[i].createTime,
            choose:false,
            tap:this.tapType(data[i].orgCode),
          }
          o_ul.push(o_li)
        }
      }
      if(pull == 1){  //初始化
        listNew = o_ul;
      }else{  //加载
        listNew = this.data.exchangeList.concat(o_ul);
        if(data.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1,
          })
        }
      };
      this.setData({
        exchangeList:listNew
      });
    }).catch((err) => {});
  },
  //会员
  member(){
    user.memberGetInfoStorage().then(res => {
      this.setData({
        'info.memberId':res.result.cardno,
        typeMenu:0,
        pageNo:1,
      })
      this.list(0,1);
    }).catch((err) => {
      console.log(err);
    });
  },
  //单选
  exchangeChoose(e){
    let index = e.currentTarget.dataset.index;
    let exchangeListNew = this.data.exchangeList;
    exchangeListNew[index].choose = !exchangeListNew[index].choose;
    this.setData({
      exchangeList:exchangeListNew
    })
    this.totle()
  },
  //全选
  totleChoose(){
    if(this.data.typeMenu == 0){
      let exchangeListNew = this.data.exchangeList;
      let totleNew = this.data.totle;
      let val = null;
      if(exchangeListNew.length > 0){
        if(totleNew.choose){
          val = false;
        }else{
          val = true;
        }
        for(let i=0;i<exchangeListNew.length;i++){
          exchangeListNew[i].choose = val;
        } 
        this.setData({
          exchangeList:exchangeListNew
        })
        this.totle()
      }
    }
  },
  //判断是否全选
  totle(){
    let exchangeListNew = this.data.exchangeList;
    let totleNew = this.data.totle;
    let num = 0;
    for(let i=0;i<exchangeListNew.length;i++){
      if(exchangeListNew[i].choose){
        num ++
      }
    } 
    if(num == exchangeListNew.length){
      totleNew.choose = true;
    }else{
      totleNew.choose = false;
    }
    totleNew.num = num;
    this.setData({
      totle:totleNew
    })
  },
  //分享
  onShareAppMessage(){
    let exchangeListNew = this.data.exchangeList;
    let ids = [];
    let img = '';
    for(let i=0;i<exchangeListNew.length;i++){
      if(exchangeListNew[i].choose){
        img = exchangeListNew[i].img
        ids.push(exchangeListNew[i].id)
      }
    }
    console.log(ids)
    return {
      title: '您的好友送您'+this.data.totle.num+'张商品兑换码',
      imageUrl:img,//图片地址
      path:"/pages/index/index?ids="+ids.join(","),
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
  },
  //立即使用的存在
  tapType(orgCode){
    if(orgCode == "A01A02A01"){
      return "goExchangeWritten"
    }else{
      return ""
    }
  },
  //隐藏红点
  badgeHideTo(){
    this.tabValId = this.selectComponent("#tabValId");
    let arr = {
      val:2
    }
    this.tabValId.badgeHide(arr);
    // setTimeout(()=>{
      
    // },100)
  },
  totleChooseZero(){
    check.showErrorToast("请选择点击兑换码")
  },
  nameLength(name){
    if(name){
      if(name.length <= 20){
        return name
      }else{
        return name.substring(0,20) + '...';
      }
    }
  },
  goExchangeWritten(e){
    let id = e.currentTarget.dataset.id;
    let orgCode = e.currentTarget.dataset.org;
    wx.navigateTo({ 
      url: "/pages/market/marketWritten/marketWritten?id="+id+"&orgCode="+orgCode
   });
  },
})