let util = require('../../../../utils/util.js');
let api = require('../../../../config/api.js');
Page({
  data: {
    titleUl:[
      // {
      //   id: 0,
      //   name:'杭州临武医药科技有限公司',
      //   code:'45645645645',
      //   type: 0,
      //   phone: 0,
      //   address: 0,
      //   isDefault:0,
      // },
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
    this.init()
  },
  init(){
    util.request(api.UcenterInvoiceTitleList , 'GET').then(res => {
      let data = res.result
      let titleUl = data.map((obj)=>{
        return obj = {
          id: obj.id,
          name: obj.name,
          code: obj.code,
          type: obj.type,
          phone: obj.phone,
          address: obj.address,
          isDefault: obj.isDefault,
        }
      })
      this.setData({
        titleUl:titleUl
      })
    }).catch((err) => {});
  },
  //选择抬头
  chooseOften(e){
    let index = e.currentTarget.dataset.index
    let oftenChooseNew = index+1;
    console.log(oftenChooseNew)
    if(oftenChooseNew != this.data.oftenChoose){
      if(this.data.oftenType == 0){  //set
        this.setData({
          oftenChoose:oftenChooseNew,
        })
      }else{  //order
        let pages = getCurrentPages();
        let prevPage = pages[ pages.length - 2 ];
        let titleUl = this.data.titleUl
        console.log(titleUl[index])
        prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          companyType: titleUl[index].type,
          'detail.name': titleUl[index].name,
          'detail.code': titleUl[index].code,
          'detail.phone': titleUl[index].phone,
          'detail.address': titleUl[index].address,
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
    let data = this.data.titleUl[index]
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/invoiceTitleEdit/invoiceTitleEdit?id="+data.id
    });
  },
  //删除
  delete(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let data = this.data.titleUl[index]
    let param = {
      id:data.id,
    }
    wx.showModal({ 
      title: '删除发票抬头',
      content: '请确认要删除发票抬头？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          util.request(api.UcenterInvoiceTitleDel, param, 'GET').then(res => {
            that.onShow();
          }).catch((err) => {});
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //新增
  btnSuccess(){
    wx.navigateTo({ 
      url: "/pages/ucenter/invoice/invoiceTitleEdit/invoiceTitleEdit"
    });
  }
})