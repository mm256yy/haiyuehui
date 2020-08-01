Component({
  behaviors: [],
  properties: {
    passTotal: {
      type: String,
      value: '',
    }
  },
  data: { 
    total:{
      timeNum:1,
      roomPrice:999900,
      roomTotalPrice:999900,
      coupon:0,
      discount:0,
      deposit:0,
      other:0,
      money:999900,
    }
  },
  lifetimes: {
    ready: function() {
      console.log(properties)
      this.setData({
      })
    },
  },
  methods: {   
    funTotal(total){
      let totalNew = {
        timeNum:total.timeNum,
        roomPrice:total.roomPrice,
        roomTotalPrice:total.roomTotalPrice,
        coupon:total.coupon,
        discount:total.discount,
        deposit:total.deposit,
        other:total.other,
        money:total.money,
      }
      this.setData({
        total:totalNew
      })
    },
  }
})
