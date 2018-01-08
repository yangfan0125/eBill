const qrurl = getApp().globalData.qrurl;
const clurl = getApp().globalData.url;
Page({
  data: {
    holdingUnit:'',
    serialNum:'',
    orderNum:'',
    holdingUnitCode:'',
    from:'',
    forbidden:true,
    resultarr:''
  },
  emailBlur:function(e){
    let that=this;
    let emailAdd=e.detail.value;
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let res = reg.test(emailAdd);
    if(res){
      that.setData({
        forbidden:false
      })
    }else{
      wx.showToast({
        title: '邮箱输入有误',
        image: '../../images/error.png',
        mask: true,
      })
    }
  },
  //表单提交
  formSubmit: function(e){
    let toAddress=e.detail.value.email;
    let that=this;
    let serialNum=that.data.serialNum;
    let holdingUnit = that.data.holdingUnit;
    let from=that.data.from;
    let orderNum = that.data.orderNum;
    let holdingUnitCode = that.data.holdingUnitCode;
    
    let url='';
    let data={};
    if(from=='collection'){
      url = clurl +'/bill/download';
      data={
        orderNum: orderNum,
        holdingUnitCode: holdingUnitCode,
        toAddress: toAddress
      }
      this.sendEmail(url, data)
    } else if (from == 'billdown'){
      let resultarr = JSON.parse(that.data.resultarr);
      for(let key of resultarr){
        url = clurl + '/bill/download';
        data=key;
        data['toAddress']=toAddress
        this.sendEmail(url,data)
      }
    }else{
      url = qrurl + '/dw/proxy/qrbill/download';
      data = {
        orderNum: serialNum,
        holdingUnitCode: holdingUnit,
        toAddress: toAddress
      }
      this.sendEmail(url, data)
    }
  },
  sendEmail: function (url,data) {
    console.log(url,data)
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: (res) => {
        console.log(res)
        let success = res.data.success;
        if (!!success) {
          wx.showModal({
            title: '提示',
            content: '邮件发送成功',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.retMsg,
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var that=this;
    that.setData({
      holdingUnit:options.holdingUnit,
      serialNum : options.serialNum,
      holdingUnitCode: options.holdingUnitCode,
      orderNum: options.orderNum,
      from:options.from,
      resultarr:options.resultarr
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