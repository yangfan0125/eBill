const qrurl = getApp().globalData.qrurl;
const axnurl = getApp().globalData.url;
Page({
  data: {
    billNum:'',
    billCode:'',
    billstatus:'',
    createTime:'',
    billAction:'',
    stateIcon:'',
    billState:'',
    year:'',
    month:"",
    day:'',
    content: [],
    hasMoreData: true,//加载更多
    page: 1,
    pageSize: 10,
    from:''
  },
  //处理不同情况
  resolveStatus: function (billstatus, createTime,billAction){
    let that=this;    
    var statussucarr = ["未报销", "无此票据", "已报销", "已作废"];
    var statuserrarr = ["重复作废", "重复报销", "作废票据报销"];
    if (statussucarr.toString().indexOf(billstatus) > -1) {
      if (billstatus=='无此票据'){
        that.setData({
          stateIcon: '/images/normal-icon.png',
          billState:billstatus
        })
      }else{
        let timearr = createTime.split(" ");
        let newtimearr = timearr[0].split("-");
        let year = newtimearr[0];
        let month = newtimearr[1];
        let day = newtimearr[2];
        that.setData({
          stateIcon: '/images/normal-icon.png',
          billState: billstatus,
          billAction: billAction,
          
          year: year,
          month: month,
          day: day

        })
      }
    } else if (statuserrarr.toString().indexOf(billstatus) > -1){
      let timearr = createTime.split(" ");
      let newtimearr = timearr[0].split("-");
      let year = newtimearr[0];
      let month = newtimearr[1];
      let day = newtimearr[2];
      that.setData({
        stateIcon: '/images/abnormal-icon.png',
        billState: billstatus,
        year: year,
        month: month,
        day: day
      })
    }
  },
  //加载更多
  getContent: function () {
    let that = this;
    let billNum=that.data.billNum;
    let billCode = that.data.billCode;
    let from=that.data.from;
    let page = that.data.page;
    let pageSize = that.data.pageSize;    
    let url = from == 'ticket' ? qrurl + '/dw/proxy/bill/validation/status' : axnurl + '/bill/validation/status';
    wx.request({
      url: url+'?billCode=' + billCode + '&billNum=' + billNum + '&page=' + page + '&size=' + pageSize,
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        let contentListTem = that.data.content;
        let success = res.data.success;
        if (!!success) {
          let result = res.data.retData;
          // let billstatus = result.publicBillFinalStatusResp.billStatus;
          // let createTime = result.publicBillFinalStatusResp.createTime;
          let billstatus = result.billStatus;
          let createTime = result.createTime;
          let billAction = result.billAction;
          
          this.resolveStatus(billstatus, createTime,billAction)          
          let contentarr = result.userBillStatusRespList;
          if(that.data.page==1){
            contentListTem=[]
          }
          if(contentarr&&contentarr!=null){
            if (contentarr.length < that.data.pageSize) {
              that.setData({
                content: contentListTem.concat(contentarr),
                hasMoreData: false
              })
            } else {
              that.setData({
                content: contentListTem.concat(contentarr),
                hasMoreData: true,
                page: that.data.page + 1
              })
            }
          }
          
        } else {
        }
      }
    })
  },
  lower:function(){
    let that = this;
    console.log('bottom')
    if (that.data.hasMoreData) {
      wx.showToast({
        icon: 'loading',
        title: '加载更多数据',
        success: (res) => {
          that.getContent()
        }
      })

    } else {
      wx.showToast({
        title: '没有更多数据',
        image: '../../images/error.png'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let billNum=options.billNum;
    let billCode = options.billCode;
    let from=options.from;
    let that=this;
    that.setData({
      billNum:billNum,
      billCode:billCode,
      from:from
    })
    wx.showLoading({
      title: '加载中',
      success:()=>{
        this.getContent()        
      }
    })    
  }


})