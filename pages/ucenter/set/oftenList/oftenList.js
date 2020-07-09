var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
Page({
  data: {
    often:[
      /*{
        id:0,
        name:'陈晓明',
        mobile:'15967125243',
        identity:'330327199508024315',
        identityS:'3303**********24315',
        isDefault:0,
      },*/
    ],
    oftenChoose:0,
    oftenType:0,  //从set进入0   从order进入1
  },
  onLoad: function (options) {
    this.setData({
      oftenType:options.oftenType
    })
  },
  onShow: function () {
    this.init();
  },
  init(){
    let oftenUl = [];
    let oftenLi = {};
    util.request(api.UcenterSetPersonList, 'GET').then(res => {
      //存储用户信息
      for(let i=0;i<res.result.records.length;i++){
        oftenLi = {
          id:res.result.records[i].id,
          name:res.result.records[i].name,
          mobile:res.result.records[i].mobile,
          identity:res.result.records[i].ident,
          identityS:util.identityCard(res.result.records[i].ident),
          isDefault:res.result.records[i].isDefault
        }
        oftenUl.push(oftenLi)
      }
      this.setData({  
        often: oftenUl
      })
    }).catch((err) => {
      wx.showModal({title: '错误信息',content: err,showCancel: false}); 
    });
  },
  //选择同住人
  chooseOften(e){
    let index = e.currentTarget.dataset.index
    let oftenChooseNew = index+1;
    if(oftenChooseNew != this.data.oftenChoose){
      if(this.data.oftenType == 0){  //set
        this.setData({
          oftenChoose:oftenChooseNew,
        })
      }else{  //order
        let pages = getCurrentPages();
        let prevPage = pages[ pages.length - 2 ];
        let infoNew = {
          name:this.data.often[index].name,
          identity:this.data.often[index].identity,
          mobile:this.data.often[index].mobile,
        }
        console.log(infoNew)
        prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          info:infoNew
        })
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }
    }else{
      this.setData({
        oftenChoose:0,
      })
    }
  },
  //编辑
  edit(e){
    let index = e.currentTarget.dataset.index;
    let data = this.data.often[index]
    wx.navigateTo({ 
      url: "../oftenEdit/oftenEdit?id="+data.id
    });
  },
  //删除
  delete(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let data = this.data.often[index]
    console.log(e)
    let param = {
      id:data.id,
    }
    console.log(param)
    wx.showModal({ 
      title: '删除常住人',
      content: '请确认要删除常住人？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          util.request(api.UcenterSetPersonDelete, param, 'GET').then(res => {
            that.onShow();
          }).catch((err) => {
            wx.showModal({title: '错误信息',content: err,showCancel: false}); 
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //新增
  btnSuccess(){
    wx.navigateTo({ 
      url: "../oftenEdit/oftenEdit"
    });
  }
})