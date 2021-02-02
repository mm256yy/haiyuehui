Page({
  data: {
    detail: {
      name: '杭州临武医药科技有限说',
      num: '3125123412312',
      address: '江宁区茶山村',
      tel: '15967125243',
      mobile: '15967125243',
      email: '594412874@#qq.com',
    }
  },
  onShow: function () {

  },
  //确定
  titleDefine(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let infoNew = {
      name: this.data.detail.name,
    }
    console.log(infoNew)
    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      info: infoNew
    })
    wx.navigateBack({
      delta: 2
    });
  },
  //编辑
  titleEdit() {
    wx.navigateTo({
      url: "/pages/ucenter/invoice/invoiceTitleEdit/invoiceTitleEdit"
    });
  },
})