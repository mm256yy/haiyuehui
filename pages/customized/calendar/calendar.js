
Page({
  data: {
    weeksE:["SUM","MON","TUS","WED","THU","FRI","SAT"],
    weeksC:["日","一","二","三","四","五","六"],
    days:[
      // {val:"1",class:"",abled:true,time},
      // {val:"1",class:"",abled:true,time}
    ],
    setVal:0, //计算月份前后退
    monthOneDay:'',
    show:{  //展示信息
      month:'',
      startTimeM:"", //05 月份
      startTimeD:"",  //12 日期
      startTimeW:"", //周二 星期
      endTimeM:"",  //05 月份
      endTimeD:"",  //13 日期
      endTimeW:""  //周三 星期
    },
    time:{  //最终时间
      startTime:0,
      endTime:0,
    },
    clickNum:0, //点击次数
  },
  onLoad: function () {
    let now_data = new Date().getTime()
    console.log(now_data)
    this.rendering(now_data)
    this.setData({
      monthOneDay:now_data
    })
    this.renderingChoose()
  },
  //渲染日历
  rendering(d){
    let d_today = new Date()  //现在时间
    let d_new = new Date(d)  //传递过来的时间
    let monthState = this.monthState(d_new)   //1 过去 2 现在 3 未来 0 错误
    //获取到当前月份的天数
    let dayNum = new Date(d_new.getFullYear(),d_new.getMonth()+1,0).getDate();
    let dayNumBefore = null;
    if(d_new.getMonth() == 0){  //今年一月
      dayNumBefore = new Date(d_new.getFullYear()-1,12,0).getDate();
    }else{
      dayNumBefore = new Date(d_new.getFullYear(),d_new.getMonth(),0).getDate();
    }
    let oneDay = new Date(d_new.setDate(1)).getDay()  //获取到当月第一天星期几
    let headDay = d_today.getDate();  //当前的天数
    //布置
    let days_ul = [];
    let days_li = {};
    for(let i=1;i<=42;i++){
      let i_val = null;
      let i_stamp = 0;
      let i_class = null;
      let i_abled = false;
      let i_time = "";
      if(i-oneDay<=0){ //上个月
        i_val = i-oneDay+dayNumBefore//""//
        i_class = "calendar_td_disabled"
      }else if(i-oneDay>dayNum){  //下个月
        i_val = i-oneDay-dayNum//""//
        i_class = "calendar_td_disabled"
      }else{  //当前月份
        i_val = i-oneDay;
        i_time = new Date((d_new.getFullYear()+'-'+(d_new.getMonth()+1)+'-'+(i-oneDay)).replace(/-/g,'/')).getTime()
        if(i-oneDay == headDay&&monthState == 2){ //本月本日 今天
          i_class = "calendar_td_today calendar_td_abled"
          i_abled = true
        }else if(i-oneDay < headDay&&monthState == 2){  //本月之前日
          i_class = "calendar_td_disabled"
        }else if(monthState == 1){  //之前月
          i_class = "calendar_td_disabled"
        }else{
          if(this.selectDay(i_time) == 1){
            i_class = "calendar_td_choose"
          }else if(this.selectDay(i_time) == 2){
            i_class = "calendar_td_choose_pass"
          }else{
            i_class = "calendar_td_abled" 
          }
          i_abled = true
        }
      }
      days_li = {
        val:this.dayZero(i_val),
        class:i_class,
        abled:i_abled,
        time:i_time
      }
      days_ul.push(days_li)
    }
    //渲染头部
    let monthC = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
    let calendarNew = wx.getStorageSync("calendar")
    let st_t = new Date(calendarNew.startTime)
    let end_t = new Date(calendarNew.endTime)
    let showNew = {
      month : monthC[d_new.getMonth()],
      startTimeM:this.dayZero(st_t.getMonth()+1),
      startTimeD:this.dayZero(st_t.getDate()),
      startTimeW:this.dayWeek(calendarNew.startTime),
      endTimeM:this.dayZero(end_t.getMonth()+1),
      endTimeD:this.dayZero(end_t.getDate()),
      endTimeW:this.dayWeek(calendarNew.endTime)
    }
    this.setData({
      days : days_ul,
      show : showNew
    })
  },
  //选择月份
  calendarButtom(e){
    console.log(e)
    let val = e.currentTarget.dataset.val;
    if(val == 1&&this.data.setVal>0){  //后退
      this.setData({
        setVal : this.data.setVal - 1
      })
    }else if(val == 2){  //前进
      this.setData({
        setVal : this.data.setVal + 1
      })
    }
    console.log(this.data.setVal)
    this.afresh()
  },
  //选择日期
  daysButtom(e){
    let arr = e.currentTarget.dataset.day
    if(!this.data.days[arr].abled){ //不能点击
      return false;
    }
    let daysNew = this.data.days;
    let timeNew = {}
    let d = new Date(this.data.monthOneDay)
    if(this.data.clickNum == 0){  //初始化/
      //清除
      daysNew = this.cleanClass()
      //附加点击
      daysNew[arr].class = "calendar_td_choose"
      this.setData({
        clickNum:1
      })
      //赋值
      timeNew = {
        startTime:new Date((d.getFullYear()+'-'+(d.getMonth()+1)+'-'+daysNew[arr].val).replace(/-/g,'/')).getTime(),
        endTime:new Date((d.getFullYear()+'-'+(d.getMonth()+1)+'-'+daysNew[arr].val).replace(/-/g,'/')).getTime()+24*60*60*1000,
      }
    }else if(this.data.clickNum == 1){  //已经有第一个
      //附加点击
      daysNew[arr].class = "calendar_td_choose"
      this.setData({
        clickNum:0
      })
      //赋值
      let one = this.data.time.startTime
      let two = new Date((d.getFullYear()+'-'+(d.getMonth()+1)+'-'+daysNew[arr].val).replace(/-/g,'/')).getTime()
      if(two<one){
        timeNew = {
          startTime:two,
          endTime:one,
        }
      }else if(two == one){
        timeNew = {
          startTime:one,
          endTime:one+24*60*60*1000,
        }
      }else{
        timeNew = {
          startTime:one,
          endTime:two,
        }
        // len = (timeNew.endTime - timeNew.startTime)/24/60/60/1000-1
        // for(let i=1;i<=len;i++){
        //   daysNew[arr-i].class = "calendar_td_choose_pass"
        // }
      }
    }
    this.setData({
      days:daysNew,
      time:timeNew
    })
    wx.setStorageSync("calendar", timeNew);
    this.afresh()
    //渲染
    this.renderingChoose()
  },
  //确认
  confirm(){
    wx.navigateBack({ 
      delta: 1  //返回
    }); 
  },
  //选择后渲染
  renderingChoose(){
    let calendarNew = wx.getStorageSync("calendar");  //获取数据
    let st_t = new Date(calendarNew.startTime);
    let end_t = new Date(calendarNew.endTime);
    let showNew = {
      month:this.data.show.month,
      startTimeM:this.dayZero(st_t.getMonth()+1),
      startTimeD:this.dayZero(st_t.getDate()),
      startTimeW:this.dayWeek(calendarNew.startTime),
      endTimeM:this.dayZero(end_t.getMonth()+1),
      endTimeD:this.dayZero(end_t.getDate()),
      endTimeW:this.dayWeek(calendarNew.endTime)
    }
    this.setData({
      show : showNew
    })
  },
  cleanClass(){
    let daysNew = this.data.days;
    //布置
    let days_ul = [];
    let days_li = {};
    for(let i=0;i<42;i++){
      let i_class = null;
      if(daysNew[i].abled){ //可以使用
        i_class = "calendar_td_abled"
      }else{
        i_class = "calendar_td_disabled"
      }
      days_li = {
        val:daysNew[i].val,
        class:i_class,
        abled:daysNew[i].abled
      }
      days_ul.push(days_li)
    }
    this.setData({
      days : days_ul,
    })
    return days_ul
  },
  dayZero(val){
    if(val<=9){
      return "0"+val
    }else{
      return val
    }
  },
  dayWeek(val){
    let week = ['周日','周一','周二','周三','周四','周五','周六']
    return week[new Date(val).getDay()]
  },  
  //判断传递过来的月份的状态 //1 过去 2 现在 3 未来 0 错误
  monthState(d_new){
    let d_today = new Date()  //现在时间
    if(d_new.getFullYear() == d_today.getFullYear()&&d_new.getMonth() == d_today.getMonth()){
      return 2;
    }else if(d_new.getFullYear() <= d_today.getFullYear()&&d_new.getMonth() < d_today.getMonth()){
      return 1;
    }else if(d_new.getFullYear() > d_today.getFullYear()||d_new.getMonth() > d_today.getMonth()){
      return 3;
    }else{
      return 0;
    }
  },
  //判断当前时间戳是否属于选中区域
  selectDay(time){ //1 选中 2 范围内 0没有选中
    let calendarNew = wx.getStorageSync("calendar");  //获取数据
    let st_t = calendarNew.startTime;
    let end_t = calendarNew.endTime;
    if(time === st_t||time === end_t){
      return 1;
    }else if(time>st_t&&time<end_t){
      return 2;
    }else{
      return 0;
    }
  },
  //重新渲染
  afresh(){
    let data = this.data.setVal+new Date().getMonth()
    let m_del = data%12+1;
    let y_del = (data-data%12)/12

    //重新渲染
    let dNew = new Date((y_del+(new Date().getFullYear())+"-"+m_del+"-"+"1").replace(/-/g,'/')).getTime();
    this.rendering(dNew);
    //赋予this.monthOneDay
    this.setData({
      monthOneDay:dNew
    })
  },
})