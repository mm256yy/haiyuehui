 // 以下是业务服务器API地址 
 // 手机 开发API地址 
 // let WxApiRoot = 'http://112.17.106.101:9001/wx/';  let testing = true;
 // 正式线上ip 
 // let WxApiRoot = 'http://124.70.147.182:9001/wx/'; let testing = false;
 // 测试线上ip
 // let WxApiRoot = 'http://124.70.132.80:9001/wx/'; let testing = true;
 // 本机 开发api地址
 // let WxApiRoot = 'http://192.168.133.67:9002/wx/'; let testing = true;    //'http://192.168.188.79:9001/wx/';
 // 生产地址
 let WxApiRoot = 'https://www.hwhhotels.com/wx/'; let testing = false;
 
 module.exports = {
   testing,  //判断是否是测试环境
   AuthCheckToken: WxApiRoot + 'auth/checkToken', //判断token是否过期 hwh
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
   //UcenterVisitorSendMobile: WxApiRoot + 'visitor/sendMobile', //访客发起手机号 
  //  UcenterVisitorAddInfo: WxApiRoot + 'visitor/addInfo', //添加访客
   UcenterVisitorAdd: WxApiRoot + 'visitor/add', //访客扫描二维码自行添加
   UcenterConnectOrder: WxApiRoot + 'order/connectOrder', //查询订单（转移订单-接受）
   UcenterOrderOta: WxApiRoot + 'order/otaOrder', //查询订单（转移订单-接受）(OTA)
   UcenterOrderAllowConnect: WxApiRoot + 'order/allowConnect', //是否可转接（转移订单-发送-复制）
   UcenterOrderGetRoomPwd: WxApiRoot + 'order/getRoomPwd', //获取到当前订单的房间密码

   UcenterSetMemberEdit:WxApiRoot + 'member/edit', //会员信息编辑
   UcenterSetPersonList:WxApiRoot + 'memberPerson/list', //常住人列表
   UcenterSetPersonAdd:WxApiRoot + 'memberPerson/add', //常住人添加
   UcenterSetPersonEdit:WxApiRoot + 'memberPerson/edit', //常住人编辑
   UcenterSetPersonDelete:WxApiRoot + 'memberPerson/delete', //常住人删除
   UcenterSetPersonQuery:WxApiRoot + 'memberPerson/queryById', //常住人查询
   UcenterMemberQuery:WxApiRoot + 'member/query', //会员信息查询
   MemberInviteCode:WxApiRoot + 'member/qrCode',  //会员二维码
   MemberInviteList:WxApiRoot + 'memberInvite/list',  //会员邀请列表

   MemberGet:WxApiRoot + 'member/get', //会员信息获取和余额
   MemberRechargeSubmit:WxApiRoot +'recharge/submit',  //充值下订单
   MemberRechargePrepay:WxApiRoot +'recharge/prepay',  //充值调起
   MemberRechargeCallback:WxApiRoot +'recharge/callback/doCallback',  //充值返回
   MemberRechargeHistory:WxApiRoot +'recharge/history', //余额查询
   MemberPointHistory:WxApiRoot +'member/pointHistory', //积分查询
 }