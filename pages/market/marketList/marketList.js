let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
Page({
  data: {
    menuUl:[
      {name:' 全部 ',val:''},
    ],
    goodsUl:[
      {img:'/static/images/logo.png',name:'测试产品123123',introduce:'这是一个测试产品打扫打扫打扫的大事',categoryId:'',price:'123',salePrice:'110',content:'',shareUrl:'',},
      {img:'/static/images/logo.png',name:'测试产品123123',introduce:'这是一个测试产品打扫打扫打扫的大事',categoryId:'',price:'123',salePrice:'110',content:'',shareUrl:'',},
    ],
    pageNo:1,
    menuVal:0,
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    wx.hideTabBar()
    this.menu()
    this.setData({
      pageNo:1,
      menuVal:0,
    })
    this.init(0,1);
  },
  // 上拉刷新
  onReachBottom: function() {
    this.setData({
      pageNo:this.data.pageNo + 1,
    })
    this.init(this.data.menuVal,2)
  },
  //加载类型
  menu(){
    util.request(api.MallCategory , 'GET').then(res => {
      let menuUlNew = [{name:' 全部 ', val:0}];
      let menuli = {};
      for(let i=0;i<res.result.length;i++){
        menuli = {
          name:res.result[i].name,
          val:res.result[i].id
        }
        menuUlNew.push(menuli)
      }
      this.setData({
        menuUl:menuUlNew
      })
    }).catch((err) => {});
  },
  //加载商品
  init(typeVal,pull){  //pull 1为初始化 2为下拉
    let param = {
      pageNo:this.data.pageNo,
      categoryId:typeVal,
      pageSize:10,
    }
    util.request(api.MallGoods , param , 'GET').then(res => {
      let o_ul = [];
      let o_li = {};
      let goodsUlNew = [];
      for(let i=0;i<res.result.records.length;i++){
        let data = res.result.records[i]
        o_li = {
          id:data.id,
          name:data.title,
          categoryId:data.categoryId,
          img:data.img,
          price:data.price,
          salePrice:data.salePrice,
          content:data.content,
          shareUrl:data.shareUrl,
          introduce:data.instruction,
          sort:data.sort,
          amount:data.amount,  //库存
          isNew:data.isNew, //1 是 0 否
          isHot:data.isHot, //1 是 0 否
          isOnSale:data.isOnSale, //1 上架 0下架
          browse:data.browse,  //浏览量
          sales:data.sales,  //销售量
        }
        o_ul.push(o_li)
      }
      if(pull == 1){  //初始化
        goodsUlNew = o_ul;
      }else{
        goodsUlNew = this.data.goodsUl.concat(o_ul);
        if(res.result.records.length == 0){
          this.setData({
            pageNo:this.data.pageNo - 1
          });
        }
      };
      this.setData({
        goodsUl:goodsUlNew
      })
    }).catch((err) => {
      this.setData({
        goodsUl:[]
      })
    });
  },
  //选择类型
  menuOn(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      menuVal:index,
      pageNo:1
    })
    this.init(index,1)
  },
  //商品详细
  goGoodsDetailed(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/market/marketDetailed/marketDetailed?orderId="+orderId
    })
  },
})