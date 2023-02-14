Page({
  data: {
    problemUl:[
      {
        problem:'预定房间后，如何办理入住？',
        answer:'请点击我的订单，点击我要入住，填写身份证信息和手机号，可以进行办理入住'
      },
      {
        problem:'如何一次预定多个房间？',
        answer:'目前系统暂不支持一次订多个房间，敬请谅解。'
      },
      {
        problem:'如何升级会员？',
        answer:'活动期间内，可以在【商城】购买会员升级服务，或者在【我的】=>【会员权益】里查看会员升级条件。'
      },
      {
        problem:'我在携程，飞猪等平台上买的房间如何在海悦会小程序内办理入住？',
        answer:'点击【酒店】=>【查询订单】=>【第三方平台订单】，选择需要入住的酒店以及第三方平台上的订单号，即可把在海悦会小程序接收对应的订单。'
      },
    ],
    answerUl:[
      // {type:1,val:'预定房间后，如何办理入住？'},
      // {type:2,val:'正在输入...'},
    ]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  chooseProblem(e){
    let arr = e.currentTarget.dataset.arr
    let user = {
      type:1,
      val:this.data.problemUl[arr].problem
    }
    let serviceLoding = {
      type:2,
      val: '正在输入...'
    }
    let service = this.data.problemUl[arr].answer
    
    let answerArr = this.data.answerUl.length
    let answerUl = [...this.data.answerUl,user,serviceLoding]
    this.setData({
      answerUl:answerUl
    })
    answerUl[answerArr+1].val = service
    setTimeout(()=>{
      this.setData({
        answerUl:answerUl
      })
      wx.createSelectorQuery().select('#box').boundingClientRect(function (rect) {
        console.log(rect)
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec()
    },500)
  },
})