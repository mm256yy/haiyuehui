 // 以下是业务服务器API地址
 // 手机 开发API地址
 // var WxApiRoot = 'http://112.17.106.101:9001/wx/';  
 // 正式线上ip
  var WxApiRoot = 'http://124.70.147.182:9001/wx/'; 
 // 测试线上ip
 // var WxApiRoot = 'http://124.70.132.80:9001/wx/';  
 // 本机 开发api地址
 // var WxApiRoot = 'http://192.168.188.79:9001/wx/';  // http://192.168.133.67:9002/wx/;
 // 线上地址
 //var WxApiRoot = 'https://www.hwhhotels.com/wx/';
 
 module.exports = {
   AuthLoginByWeixin: WxApiRoot + 'auth/wxLogin', //微信登录 hwh
   AuthRegisterCaptcha: WxApiRoot + 'auth/sendSmsCode', //验证码 hwh
   AuthRegister: WxApiRoot + 'auth/bindMobile', //绑定手机号 hwh
   AuthRegisterWx: WxApiRoot + 'auth/bindWxMobile', //用微信默认手机号/绑定手机号 hwh
   
   CustomizedHotelsDetailed: WxApiRoot + 'hotel/getRoomPrice', //获取酒店房间信息 hwh
   CustomizedHotelsRoom: WxApiRoot + 'hotel/room', //获取房间详情 hwh
   CustomizedHotelsList: WxApiRoot + 'hotel/list', //获取酒店列表 hwh
   CustomizedHotelsFill: WxApiRoot + 'order/submit', //下订单 hwh
   CustomizedPay: WxApiRoot + 'order/prepay', //预支付 hwh
   CustomizedPayCallback: WxApiRoot + 'order/callback/doCallback', //支付成功回调 hwh

   UcenterOrderList: WxApiRoot + 'order/list', //订单列表 hwh
   UcenterOrderDetail: WxApiRoot + 'order/detail', //订单详情 hwh
   UcenterOrderCancel: WxApiRoot + 'order/cancel', //取消订单 hwh
   UcenterOrderRefund: WxApiRoot + 'order/refund', //发起退款 hwh
   UcenterOrderCheckin: WxApiRoot + 'order/checkin', //办理入住 hwh
   UcenterSystemBaseCode: WxApiRoot +  'system/baseCode',  //入住选择查询，获取类型 hwh
   UcenterMoveInto: WxApiRoot + 'hotel/getAvailableRoomNo', // 入住查询房间 hwh
   UcenterOrderAddPerson: WxApiRoot + 'order/addPerson', //添加同住 hwh
   UcenterOrderCheckOut: WxApiRoot + 'order/checkout', //退房 hwh
   UcenterOrderDaysSubmit: WxApiRoot + 'order/addDaysSubmit', //续住下订单 hwh
   UcenterAddDaysList: WxApiRoot + 'order/addDaysList', //查询续住列表 hwh
   UcenterVisitorSendMobile: WxApiRoot + 'visitor/sendMobile', //访客发起手机号 hwh
 };