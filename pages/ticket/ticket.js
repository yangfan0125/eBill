const qrurl = getApp().globalData.qrurl;
Page({
  data: {
    billName:'暂无数据',//票据名称
    checkCode:'暂无数据',//校验码
    billNum:'暂无数据',//票据代码
    billCode:'暂无数据',//票据号码
    payee:'暂无数据',//收款单位
    payer: '暂无数据',//收款单位
    payAmount: '暂无数据',//付款金额
    openTime: '暂无数据',//开票时间
    pdfUrl:'',//pdfurl
    holdingUnit:'',//
    serialNum: ''//
  },
  //票据查看
  examineBill:function(){
    let that=this;
    let pdfUrl = that.data.pdfUrl;
    wx.showLoading({
      title: '加载中',
    })
    if (wx.downloadFile) {
      wx.downloadFile({
        url: pdfUrl,
        success: (res) => {
          console.log(res)
          if (res.statusCode === 200) {
            let filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                  wx.hideLoading()
              }
            })
          }else{
            //文档打开失败
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }   
  },
  //下载票据到邮箱
  downBill:function () {
    let that=this;
    let holdingUnit = that.data.holdingUnit;
    let serialNum = that.data.serialNum;
    
    wx.navigateTo({
      url: '../email/email?holdingUnit=' + holdingUnit + '&serialNum=' + serialNum,
    })
  },
  //查验票据
  checkBill: function () {
    let that = this;
    let billNum = that.data.billNum;
    let billCode = that.data.billCode;
    wx.navigateTo({
      url: '../result/result?billNum=' + billNum + '&billCode=' + billCode + '&from=' + 'ticket',
    })
  },
  //处理错误情况
  handleErr:function(errMsg){
    wx.showModal({
      title: '提示',
      content: errMsg,
      showCancel:false,
      success:(res)=>{
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    let qid = decodeURIComponent (options.q);
    this.setData({
      qid:qid
    })
    let that=this;
    wx.request({
      url: qrurl+'/proxy/qrCodeUrl',
      method:'POST',
      data:qid,
      header: {
        'content-type': 'application/json' 
      },
      success: (res) =>{
        console.log(res.data)        
        let success=res.data.success;
        if(!!success){
          let result=res.data.retData;
          if(!!result){
            that.setData({
              billName: result.billName,//票据名称
              checkCode: result.checkCode,//校验码
              billNum: result.billNum,//票据代码
              billCode: result.billCode,//票据号码
              payee: result.payee,//付款单位
              payer: result.payer,//收款单位
              payAmount: result.payAmount,//付款金额
              openTime: result.openTime.split('.')[0],//开票时间
              pdfUrl: result.pdfUrl,//开票时间
              holdingUnit: result.holdingUnit,//
              serialNum: result.serialNum//
              
            })
          }else{

          }
        }else{
          this.handleErr(res.data.retMsg)
          
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})