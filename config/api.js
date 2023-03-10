// 以下是业务服务器API地址 
// 手机 开发API地址 
// let WxApiRoot = 'http://112.17.106.101:9001/wx/';  let testing = true; 
// 正式线上ip 
// let WxApiRoot = 'http://124.70.147.182:9001/wx/'; let testing = false; 
// 测试线上ip 
let WxApiRoot = 'http://124.70.132.80:9002/wx/'; let testing = true;
// 本机 开发api地址
// let WxApiRoot = 'http://192.168.188.72:9002/wx/'; let testing = true;  // 明俊本机'http://192.168.188.79:9001/wx/'; 
// let WxApiRoot = 'http://115.238.67.214:9002/wx/'; let testing = true;  //明俊外网地址 
// let WxApiRoot = 'http://192.168.188.73:9002/wx/'; let testing = true;  //益静本机
// let WxApiRoot = 'http://mingtian.gz2vip.91tunnel.com/wx/'; let testing = true;  //临时ip
// 生产地址 
// let WxApiRoot = 'https://hotels.hwhautomall.com/wx/'; let testing = false;  // let WxApiRoot = 'https://www.hwhhotels.com/wx/';
 
module.exports = {
   testing,  //判断是否是测试环境
   AuthCheckSession: WxApiRoot + 'system/forceUpdateSession', //强制刷新Session

   AuthCheckToken: WxApiRoot + 'auth/checkToken', //判断token是否过期 hwh
   AuthLoginByWeixin: WxApiRoot + 'auth/wxLogin', //微信登录 hwhmemberNotify/unreadCount
   AuthRegisterCaptcha: WxApiRoot + 'auth/sendSmsCode', //验证码 hwh
   AuthRegister: WxApiRoot + 'auth/bindMobile', //绑定手机号 hwh
   AuthRegisterWx: WxApiRoot + 'auth/bindWxMobile', //用微信默认手机号/绑定手机号 hwh
   SystemUpload: WxApiRoot + 'system/upload', //上传图片
   
   TndexBannerList: WxApiRoot + 'banner/list', //banner 图片

   CustomizedHotelsDetailed: WxApiRoot + 'hotel/getRoomPrice', //获取酒店房间信息 hwh
   CustomizedHotelsRoom: WxApiRoot + 'hotel/room', //获取房间详情 hwh
   CustomizedHotelsList: WxApiRoot + 'hotel/list', //获取酒店列表 hwh
   CustomizedHotelsFill: WxApiRoot + 'order/submit', //下订单 hwh
   CustomizedPay: WxApiRoot + 'order/prepay', //预支付 hwh
   CustomizedPayCallback: WxApiRoot + 'order/callback', //支付成功回调 hwh

   UcenterOrderList: WxApiRoot + 'order/list', //订单列表 hwh
   UcenterOrderDetail: WxApiRoot + 'order/detail', //订单详情 hwh
   UcenterOrderCancel: WxApiRoot + 'order/cancel', //取消订单 hwh
   UcenterOrderRefund: WxApiRoot + 'order/refund', //发起退款 hwh
  //  UcenterOrderCheckin: WxApiRoot + 'order/checkin', //办理入住 hwh
   UcenterSystemBaseCode: WxApiRoot +  'system/baseCode',  //入住选择查询，获取类型 hwh
   UcenterSystemBaseCodeType: WxApiRoot +  'system/baseCodeType',  //获取类型  
   UcenterOrderFloorRoomNum: WxApiRoot + 'hotel/getFloorRoomNum', //获取房间数量 
   UcenterOrderFloorRoomPosition: WxApiRoot + 'hotel/getFloorRoomPosition', //获取房间坐标 
   UcenterOcrIdent: WxApiRoot + 'member/ocrIdent', // 上传身份证
   UcenterOrderCheckPerson: WxApiRoot + 'order/checkPerson', // 人脸识别认证(悉点)

   UcenterOrderRWCheckPerson: WxApiRoot + 'order/rwCheckin', // 人脸识别认证(瑞沃)
   UcenterOrderRWCheckout: WxApiRoot + 'order/rwCheckout',  // 退房(瑞沃)

  //  UcenterMoveInto: WxApiRoot + 'hotel/getAvailableRoomNo', // 入住查询房间 hwh
   UcenterOrderAddPerson: WxApiRoot + 'order/addPerson', //添加同住 hwh
   UcenterOrderCheckOut: WxApiRoot + 'order/checkout', //退房 hwh
   UcenterOrderDaysSubmit: WxApiRoot + 'order/submitAdds', //续住下订单 hwh
   UcenterAddDaysList: WxApiRoot + 'order/addDaysList', //查询续住列表 hwh
   
   //UcenterVisitorSendMobile: WxApiRoot + 'visitor/sendMobile', //访客发起手机号 
   //UcenterVisitorAddInfo: WxApiRoot + 'visitor/addInfo', //添加访客
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
   MemberInviteOrderBonus:WxApiRoot + 'member/orderBonus',  //会员邀请金额 (收益详情)
   MemberInviteBonusHistory:WxApiRoot + 'member/bonusHistory',  //会员邀请金额 (余额流水)
   MemberInviteSendAllowance:WxApiRoot + 'memberInvite/sendAllowance',  //发送邀请码到后台获取津贴

   MemberGet:WxApiRoot + 'member/get', //会员信息获取和余额
   MemberRechargeSubmit:WxApiRoot +'recharge/submit',  //充值下订单
   MemberRechargePrepay:WxApiRoot +'recharge/prepay',  //充值调起
   MemberRechargeCallback:WxApiRoot +'recharge/callback',  //充值返回
   MemberRechargeHistory:WxApiRoot +'recharge/history', //余额查询
   MemberRechargeList:WxApiRoot +'recharge/rule/list', //充值规则
   
   MemberUpToHJK:WxApiRoot +'member/upToHJK', //兑换黑金卡
   
   MemberCouponList:WxApiRoot +'memberCoupon/list',//优惠劵列表

   MallCategory:WxApiRoot +'mall/main/category',  //商城类别
   MallGoods:WxApiRoot +'mall/main/goods',  //商城商品列表
   MallGoodsDetail:WxApiRoot +'mall/main/goodsDetail',  //商品详细
   MallGoodsInviteImg:WxApiRoot +'mall/main/inviteImg',  //商品详细商品海报与二维码
   MallOrderSubmit:WxApiRoot +'mall/order/submit', //提交订单
   MallPay: WxApiRoot + 'mall/order/prepay', //商城预支付 hwh
   MallPayCallback: WxApiRoot + 'mall/order/callback', //商城支付成功回调 hwh
   MallOrderList:WxApiRoot +'mall/order/list', //订单列表
   MallOrderDetail:WxApiRoot +'mall/order/detail', //订单详细
   MallOrderCancel:WxApiRoot +'mall/order/cancel', //取消订单
   MallOrderRefund:WxApiRoot +'mall/order/refund', //订单退款

   MallMemberGoodsList:WxApiRoot +'mall/memberGoods/list', //兑换码列表
   MallMemberGoodsConnect:WxApiRoot +'mall/memberGoods/connect', //兑换码转接
   MallCarWashStart:WxApiRoot +'mall/memberGoods/carWashStart', //洗车信息填写

   PointsList:WxApiRoot +'exchange/list', //积分兑换列表
   PointsDetail:WxApiRoot +'exchange/getCouponById', //积分兑换详情
   PointsExchange:WxApiRoot +'exchange/coupon', //积分兑换
   PointHistory:WxApiRoot +'member/pointHistory', //积分查询
   PointRecord:WxApiRoot +'exchange/record', //积分兑换商品记录

   ActivityDraw:WxApiRoot +'activity/draw', // 抽奖活动
   
   GiftList:WxApiRoot+'present/list',// 礼品卡列表
   GiftMemberList:WxApiRoot+'present/memberPresent',// 我的礼品卡列表
   GiftSubmit:WxApiRoot +'present/submit',//礼品提交订单
   GiftPay:WxApiRoot+'present/prepay',//礼品预支付
   GiftCallback:WxApiRoot+'present/callback',//礼品支付成功回调
   GiftUsePresent:WxApiRoot+'present/usePresent', //微信使用礼品卡接口
   GiftOrderReceive:WxApiRoot+'present/receive',  //微信接受礼品卡接口
   GiftOrderDetail:WxApiRoot+'present/presentOrder',//礼品订单详情
   GiftOrderRefund:WxApiRoot+'present/doRefund',//订单退款
   GiftPresentSend:WxApiRoot +'present/send', //礼品卡发送

   HongbaocashOut:WxApiRoot +'hongbao/cashOut', //红包提现
   SendGoods:WxApiRoot +'sendGoods/getGoods', //实物赠送id
   
   
   personnelSubmit:WxApiRoot +'apply/submit', //人事招聘请求
   personnelCompany:WxApiRoot +'apply/company', //人事招聘公司列表

   memberCheckQrcode:WxApiRoot +'member/checkQrcode', //核酸健康-查询
   memberGetPersonInfo:WxApiRoot +'member/getPersonInfo', //核酸健康-获取用户信息
   memberHealthRecord:WxApiRoot +'hotelCheckRecord/submit', //核酸健康-提交用户信息和图片

   MemberGoodsCheckQrcode:WxApiRoot +'mall/memberGoods/goodsCheckQrcode', //兑换码二维码
   MemberGoodsQueryByCode:WxApiRoot +'mall/memberGoods/queryByCode', //兑换码查询商品信息
   MemberGoodsConsumeCode:WxApiRoot +'mall/memberGoods/consumeCode', //兑换码员工核销

   UcenterOrderInvoiceOpening:WxApiRoot +'system/invoiceOpening', //开发票
   UcenterOrderInvoicePdf:WxApiRoot +'system/queryPdf', //发票查询
   UcenterOrderInvoiceGetPdf:WxApiRoot +'invoice/getPdfByOrderId', //发票本地查询
   UcenterInvoiceTitleList:WxApiRoot +'invoice/title/list', //发票抬头-列表
   UcenterInvoiceTitleAdd:WxApiRoot +'invoice/title/add', //发票抬头-新增
   UcenterInvoiceTitleEdit:WxApiRoot +'invoice/title/edit', //发票抬头-编辑
   UcenterInvoiceTitleDel:WxApiRoot +'invoice/title/delete', //发票抬头-删除
   UcenterInvoiceTitleDefault:WxApiRoot +'invoice/title/setDefaultAddress', //发票抬头-设置默认

   MemberNotifyUnreadCount:WxApiRoot +'memberNotify/unreadCount', //消息-消息数量
   MemberNotifyList:WxApiRoot +'memberNotify/list', //消息-消息列表
 }
