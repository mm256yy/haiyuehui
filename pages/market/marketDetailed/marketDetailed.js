let api = require('../../../config/api.js');
let util = require('../../../utils/util.js');
let check = require('../../../utils/check.js');
let user = require('../../../utils/user.js');
Page({
  data: {
    id: 1,
    detailed: {
      // id:1,
      // name:'五芳斋月饼礼盒中秋节双蛋黄莲蓉等广式月饼礼盒装780g中秋礼品送礼大礼包五芳合价月饼礼盒',
      // categoryId:2,
      // img:'',
      // sliderImg:[],
      // content:'这是一个测试产品打扫打扫打扫的大事',
      // shareUrl:'',
      // introduce:'这是一个测试产品打扫打扫打扫的大事',
      // sort:'',
      // amount:320,  //库存 值为-1 时为不限制
      // isNew:0, //1 是 0 否
      // isHot:0, //1 是 0 否
      // isOnSale:1, //1 上架 0下架
      // browse:2300,  //浏览量
      // sales:55,
      // noticeLimit:[],
      // noticeRefund:[],
      // noticeDate:[],
      // noticeRule:[],
      // noticePoint:[],
      // orgCode:'',  //商品属于哪个部门
      // isSingle:0,  //是否单独购买 1 是(不能加入购物车) 0 否 null 否\
      // startBuy:'',  //开卖时间 null 值为没有限制 
      // countdown:'',  //倒计时
      // actual:0, //是否虚拟产品 0（有兑换码） 1（没有兑换码）
      // canAmount:0, //最多购买数量 null 和 -1 都是为无限期
      // cardLevelCan:0, //购买卡等级限制
    },
    pop: false,
    goodsNum: 1,
    redTip: 1,
    buyMode: 0, //0 加入购物车 1 立即购买
    numTipShow: 0,
    total: {
      // price:23000,  //优惠前
      // salePrice:22000, //优惠后
      // discount:95,  //折扣 
      // money:'',
    },
    specList: [
      // {
      //   name:"颜色",
      //   list:[
      //     {name:'白色',choose:false,abled:true,hide:true},
      //     {name:'黑色',choose:false,abled:true,hide:true}
      //   ]
      // },
      // {
      //   name:"大小",
      //   list:[
      //     {name:'150ml',choose:false,abled:true,hide:true},
      //     {name:'250ml',choose:false,abled:true,hide:true}
      //   ]
      // },
    ],
    productList: [
      // {spec:'白色$150ml',price:100,amount:1},
      // {spec:'白色$250ml',price:200,amount:1},
      // {spec:'黑色$150ml',price:300,amount:1},
    ],
    specChoose: [],
    info: {
      cardLevel: '',
    },
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  onShow: function () {
    this.member();
  },
  //点击转发按钮
  onShareAppMessage: function (ops) {
    let that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: (that.data.detailed.name).slice(0, 30) + '...',
      imageUrl: that.data.detailed.sliderImg[0], //图片地址
      path: '/pages/market/marketDetailed/marketDetailed?id=' + that.data.detailed.id, // 用户点击首先进入的当前页面
      success: function (res) { // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) { // 转发失败
        console.log("转发失败:");
      }
    }
  },
  //会员
  member() {
    user.memberGetInfoStorage().then(res => {
      this.setData({
        'info.cardLevel': res.result.cardLevel
      })
      this.init();
    }).catch((err) => {
      this.init();
      console.log(err)
    });
  },
  init() {
    let inviteCode = wx.getStorageSync('othersInviteCode');
    console.log(inviteCode)
    let param = {
      id: this.data.id,
      cardLevel: this.data.info.cardLevel,
      inviteCode:inviteCode
    }
    util.request(api.MallGoodsDetail, param, 'GET').then(res => {
      let data = res.result;
      //轮播图
      let sliderImgNew = data.sliderImg ? data.sliderImg.split(',') : '';
      //订购须知
      let noticeUl = [];
      let noticeLi = [];
      noticeLi = data.orderingInfo.split('|');
      for (let i = 0; i < noticeLi.length; i++) {
        noticeUl[i] = noticeLi[i].split('\n');
      }
      //图文详情
      let contentNew = data.content ? data.content : ''
      contentNew = contentNew.replace(/width="300"/g, 'width="100%"').replace(/width="600"/g, 'width="100%"').replace(/display: block/g, 'display: block;padding-bottom: 10px;').replace(/height="300"/g, '').replace(/height="600"/g, '');
      let detailedNew = {
        id: data.id,
        name: data.title,
        categoryId: data.categoryId,
        img: data.img,
        sliderImg: sliderImgNew ? sliderImgNew : '',
        content: contentNew, //图片详情
        shareUrl: data.shareUrl ? data.shareUrl : '',
        introduce: data.instruction,
        sort: data.sort,
        amount: data.amount == -1 ? '不限制' : data.amount, //库存
        isNew: data.isNew, //1 是 0 否
        isHot: data.isHot, //1 是 0 否
        isOnSale: data.isOnSale, //1 上架 0下架
        browse: data.browse, //浏览量
        sales: data.sales,
        noticeLimit: noticeUl[0],
        noticeRefund: noticeUl[1],
        noticeDate: noticeUl[2],
        noticeRule: noticeUl[3],
        noticePoint: noticeUl[4],
        orgCode: data.orgCode,
        isSingle: data.isSingle,
        startBuy: data.startBuy ? data.startBuy : '',
        countdown: this.funCountdown(data.startBuy), //倒计时
        actual:data.actual, //是否是虚拟产品
        bonusRate:data.bonusRate,  //佣金比例
        canAmount:data.canAmount,
        cardLevelCan:data.cardLevel,
        canBuy:this.funcanBuy(data.canBuy),
        canRefund:data.canRefund,
      };
      //规格
      let specListNew = '';
      let spec_o_ul = [];
      let spec_o_li = {};
      let spec_i_ul = [];
      let spec_i_li = {};
      if (data.specList) {
        for (let i = 0; i < data.specList.length; i++) {
          for (let j = 0; j < data.specList[i].list.length; j++) {
            spec_i_li = {
              name: data.specList[i].list[j],
              choose: false,
              abled: true,
              hide: true,
            }
            spec_i_ul.push(spec_i_li)
          }
          spec_o_li = {
            name: data.specList[i].name,
            list: spec_i_ul,
          }
          spec_i_ul = [];
          spec_o_ul.push(spec_o_li)
        }
        specListNew = spec_o_ul;
      }
      //规格组合
      let productListNew = [];
      let product_o_ul = [];
      let product_o_li = {};
      let amountTotal = detailedNew.amount;
      if (data.productList) {
        for (let i = 0; i < data.productList.length; i++) {
          product_o_li = {
            spec: data.productList[i].spec,
            price: data.productList[i].price,
            amount: data.productList[i].amount == -1 ? '不限制' : data.productList[i].amount,
          }
          product_o_ul.push(product_o_li)
        }
        productListNew = product_o_ul;
        //判断是否有规格组合，若是有，总库存设置为规格的总数
        if (productListNew.length > 0) {
          amountTotal = 0;
          for (let i = 0; i < productListNew.length; i++) {
            if (productListNew[i].amount == '不限制') {
              amountTotal = '不限制'
              break;
            } else {
              amountTotal += productListNew[i].amount
            }
          }
        }
      }
      //价格
      let totalNew = {
        price: data.price,
        salePrice: data.salePrice,
        discount: data.discount ? data.discount : 100,
        money: 0,
      }
      this.setData({
        detailed: detailedNew,
        total: totalNew,
        specList: specListNew,
        productList: productListNew,
        'detailed.amount': amountTotal
      })
      this.redTipNum();
      this.total();
      this.delSpec(specListNew, productListNew);
      //清除index穿进来的两个本地存储值
      wx.removeStorage({key: 'othersInviteCode'})
      wx.removeStorage({key: 'othersgoodsId'})
    }).catch((err) => {});
  },
  //总计
  total() {
    let moneyNew = 0;
    if (this.data.total.discount > 0) {
      moneyNew = parseInt(this.data.total.discount) / 100 * this.data.total.salePrice
    } else {
      moneyNew = this.data.total.salePrice
    }

    this.setData({
      'total.money': moneyNew
    })
  },
  //判断商品购物车数量
  redTipNum() {
    let shoppingCartUl = [];
    let num = 0;
    if (wx.getStorageSync("shoppingCart")) {
      shoppingCartUl = wx.getStorageSync("shoppingCart");
    }
    if (shoppingCartUl.length > 0) {
      for (let i = 0; i < shoppingCartUl.length; i++) {
        if (shoppingCartUl[i].id == this.data.detailed.id) {
          num += shoppingCartUl[i].num;
        }
      }
    }
    this.setData({
      redTip: num
    })
  },
  //去购物车
  goShopingCart() {
    wx.navigateTo({
      url: "/pages/market/shoppingCart/shoppingCart"
    })
  },
  //添加购物车
  addShopingCart() {
    let can = this.funChooseCan();
    let specChooseVal = this.data.specChoose.join('$');
    if (can) {
      let shoppingCartUl = [];
      let isExist = false;
      let index = 0;
      if (wx.getStorageSync("shoppingCart")) {
        shoppingCartUl = wx.getStorageSync("shoppingCart");
      }
      if (shoppingCartUl.length > 0) {
        for (let i = 0; i < shoppingCartUl.length; i++) {
          if (shoppingCartUl[i].id == this.data.detailed.id && shoppingCartUl[i].spec == specChooseVal) {
            isExist = true;
            index = i;
          }
        }
      }
      if (isExist) { //是否存在同等商品
        // shoppingCartUl[index].num += this.data.goodsNum;
        if (shoppingCartUl[index].num + this.data.goodsNum > this.data.detailed.amount) {
          check.showErrorToast('添加的商品超过库存')
        } else {
          shoppingCartUl[index].num += this.data.goodsNum;
        }
      } else {
        let shoppingCartLi = {
          choose: false,
          id: this.data.detailed.id,
          name: this.data.detailed.name,
          img: this.data.detailed.img,
          salePrice: this.data.total.salePrice,
          amount: this.data.detailed.amount,
          num: this.data.goodsNum,
          orgCode: this.data.detailed.orgCode,
          spec: this.data.specChoose.join("$"),
        }
        shoppingCartUl.push(shoppingCartLi);
      }
      wx.setStorageSync("shoppingCart", shoppingCartUl)
      this.popShow(null);
      this.setData({
        redTip: this.data.redTip += this.data.goodsNum
      });
      this.animation();
    }
  },
  //添加购物车动画效果
  animation() {
    this.setData({
      numTipShow: 1,
    })
    let that = this;
    setTimeout(function () {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease",
      })
      animation.translate(-50, 50).opacity(0).step();
      that.setData({
        animationData: animation.export(), //设置完毕
      })
      setTimeout(function () {
        animation.translate(0, 0).step();
        that.setData({
          animationData: animation.export()
        })
      }, 1000)
    }, 100)
  },
  //立即购买
  buy() {
    let can = this.funChooseCan();
    if (can) {
      //添加入支付储存
      let shopPayNew = [];
      let shopPayLi = {
        choose: false,
        id: this.data.detailed.id,
        name: this.data.detailed.name,
        img: this.data.detailed.img,
        salePrice: this.data.total.salePrice,
        amount: this.data.detailed.amount,
        num: this.data.goodsNum,
        orgCode: this.data.detailed.orgCode,
        spec: this.data.specChoose.join("$"),
      };
      shopPayNew.push(shopPayLi)
      wx.setStorageSync("shopPay", shopPayNew)

      //跳转
      wx.navigateTo({
        url: "/pages/market/markeConfirm/marketConfirm?discount=" + this.data.total.discount
      })
    }
  },
  //弹窗显示
  popShow(e) {
    let mode = 0;
    if (e) {
      mode = e.currentTarget.dataset.mode
    }
    this.setData({
      pop: !this.data.pop,
      buyMode: mode
    })
  },
  //商品数量加减
  goodsNum(e) {
    let val = e.currentTarget.dataset.val;
    let num = this.data.goodsNum
    let amount = this.data.detailed.amount
    let canAmount = this.data.detailed.canAmount //佣金商品限定数量 null 和 -1 都是为无限期
    if (val == 0 && num > 1) {
      num--
    } else if (val == 1 && (num < amount || amount == "不限制") && (num < canAmount || !canAmount || canAmount == -1)) {
      num++
    }
    this.setData({
      goodsNum: num
    })
  },
  goWalletRecharge() {
    wx.navigateTo({
      url: "/pages/ucenter/wallet/walletRecharge/walletRecharge"
    })
  },
  //规格选择
  funSpecChoose(e) {
    let index1 = e.currentTarget.dataset.index1;
    let index2 = e.currentTarget.dataset.index2;
    let specListNew = this.data.specList;
    let specChooseNew = this.data.specChoose;
    let chooseValOn = specListNew[index1].list[index2].choose
    for (let i = 0; i < specListNew[index1].list.length; i++) {
      specListNew[index1].list[i].choose = false;
    }
    if (specChooseNew.length == 0) {
      specChooseNew[this.data.specList.length - 1] = null
    }
    if (chooseValOn) {
      specListNew[index1].list[index2].choose = false;
      specChooseNew[index1] = null
    } else {
      specListNew[index1].list[index2].choose = true;
      specChooseNew[index1] = specListNew[index1].list[index2].name;
    }
    this.setData({
      specList: specListNew,
      specChoose: specChooseNew
    })
    //判断生成价格/库存
    let productListNew = this.data.productList;
    let salePrice = this.data.total.salePrice;
    let amount = this.data.total.amount;
    let len = specListNew.length;
    let num = 0;
    for (let i = 0; i < len; i++) {
      if (specChooseNew[i]) {
        num++
      }
    }
    if (num == len) {
      for (let i = 0; i < productListNew.length; i++) {
        if (specChooseNew.join("$") == productListNew[i].spec) {
          salePrice = productListNew[i].price
          amount = productListNew[i].amount
        }
      }
      this.setData({
        'total.salePrice': salePrice,
        'detailed.amount': amount
      })
    }
    //进行分割规格组合
    this.specCompose()
  },
  specCompose() {
    let specChoose = this.data.specChoose
    let productList = this.data.productList
    let v_productList = []
    let j_ul = []
    let j_li = []
    let cho_ul = []
    //输出选中列表productList的值
    if (specChoose.length != 0) {
      for (let i = 0; i < specChoose.length; i++) {
        if (specChoose[i]) { //i代表specChoose第几位
          for (let j = 0; j < productList.length; j++) {
            v_productList = productList[j].spec.split('$') //j代表productList第几位
            if (v_productList[i] == specChoose[i]) {
              j_li.push(j)
            }
          }
          j_ul.push(j_li)
          j_li = []
          cho_ul.push(i)
        } else {
          cho_ul.push(i)
        }
      }
      let v_ul = [];
      let v_num = 0
      if (j_ul.length > 1) {
        for (let i = 0; i < j_ul[0].length; i++) {
          for (let j = 0; j < j_ul.length; j++) {
            if (j_ul[j].indexOf(j_ul[0][i]) != -1) {
              v_num++
            }
          }
          if (v_num == j_ul.length) {
            v_ul.push(j_ul[0][i])
          }
          v_num = 0
        }
      } else {
        v_ul = j_ul[0]
      }
      //进行隐藏未被选到的specList
      let specList = this.data.specList
      if (v_ul) {
        for (let i = 0; i < specList.length; i++) {
          for (let j = 0; j < specList[i].list.length; j++) {
            specList[i].list[j].abled = false
          }
        }
        for (let i = 0; i < cho_ul.length; i++) {
          for (let j = 0; j < v_ul.length; j++) {
            for (let k = 0; k < specList[cho_ul[i]].list.length; k++) {
              if (specList[cho_ul[i]].list[k].name == productList[v_ul[j]].spec.split('$')[cho_ul[i]]) {
                specList[cho_ul[i]].list[k].abled = true
              }
            }
          }
        }
      } else {
        for (let i = 0; i < specList.length; i++) {
          for (let j = 0; j < specList[i].list.length; j++) {
            specList[i].list[j].abled = true
          }
        }
      }
      this.setData({
        specList: specList
      })
    }
  },
  //删除规格
  delSpec(specList, productList) {
    for (let i = 0; i < productList.length; i++) {
      let prod_val = productList[i].spec.split('$')
      for (let j = 0; j < prod_val.length; j++) {
        for (let k = 0; k < specList[j].list.length; k++) {
          if (prod_val[j] == specList[j].list[k].name) {
            specList[j].list[k].hide = false
          }
        }
      }
    }
    let hideNum = 0
    for (let i = 0; i < specList.length; i++) {
      for (let j = 0; j < specList[i].list.length; j++) {
        if (specList[i].list[j].hide == true) {
          hideNum++
        }
      }
      if (hideNum == specList[i].list.length) {
        specList.splice(i, 1)
      }
      hideNum = 0
    }
    this.setData({
      specList: specList
    })
  },
  //判断规格是否全部选中,并且判断是否再可卖的时间段
  funChooseCan() {
    //规格选中
    let len = this.data.specList.length;
    let specChooseNew = this.data.specChoose;
    let num = 0;
    for (let i = 0; i < len; i++) {
      if (specChooseNew[i]) {
        num++
      }
    }
    //时间段是否可卖
    let startBuy = true;
    if (this.data.detailed.startBuy != '') {
      let nowDate = new Date().getTime()
      let buyDate = parseInt(this.data.detailed.startBuy)
      if (nowDate >= buyDate) {
        startBuy = true;
      } else {
        startBuy = false;
      }
    }
    //判断
    if (num != len) {
      check.showErrorToast('请选择商品规格')
      return false;
    } else if (!startBuy) {
      check.showErrorToast('活动时间未到')
      return false;
    } else if (this.data.detailed.amount <= 0) {
      check.showErrorToast('当前规格库存不足')
      return false;
    } {
      return true;
    }
  },
  //倒计时
  funCountdown(startBuy) {
    if (startBuy) {
      let nowDate = new Date().getTime()
      let buyDate = parseInt(startBuy)
      let time = 0
      if (buyDate > nowDate) {
        time = parseInt((buyDate - nowDate) / 1000 / 60 / 60)
        if (time == 0) {
          return '活动在一小时内即将开始'
        } else if (time > 0 && time < 24) {
          return '开卖时间还剩' + time + '小时'
        } else {
          let h = time % 24
          let d = parseInt(time / 24)
          return '开卖时间还剩' + d + '天' + h + '小时'
        }
      } else {
        return false
      }
    } else {
      return false
    }
  },
  //立即分享
  // goMarketShare(){
  //   let id = this.data.detailed.id
  //   let name = this.data.detailed.name;
  //   let price = this.data.detailed.sliderImg[0];

  //   wx.navigateTo({
  //     url: '/pages/market/marketShare/marketShare?name='+name+'&price='+price+'&id='+id
  //   })
  // },
  //是否能购买
  funcanBuy(val){
    if(val == null){
      return true
    }else if(val == 0){
      return false
    }else{
      return true
    }
  },

  goMarketShareTwo(){
    let param = {
      id: this.data.detailed.id,
    }
    util.request(api.MallGoodsInviteImg , param , 'GET').then(res => {
      let data = res.result
      wx.previewImage({
        current: data, // 当前显示图片的http链接
        urls: [data] // 需要预览的图片http链接列表
      })
    }).catch((err) => {});
  },
})