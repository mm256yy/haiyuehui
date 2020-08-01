Page({
  data: {
    questionUl:[
      {
        question:'1.总余额如何提现？',
        answer:'小程序上暂时不能提现，如需提现，需要到酒店内前台办理。',
        show:false,
      },
      {
        question:'2.线下的消费会扣除余额吗？',
        answer:'会的，小程序的余额是和线下同步的，线下消费以及小程序消费都是扣除同一个账户上面的余额。',
        show:false,
      },
      {
        question:'3.线上可以用余额和微信一起支付吗？',
        answer:'可以的，支付时，用户可选择是否扣除余额，当余额不足时，剩余的金额将采用微信支付。',
        show:false,
      },
    ]
  },
  onLoad: function (options) {

  },
  onShow: function () {
    
  },
})