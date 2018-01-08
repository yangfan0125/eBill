const url = getApp().globalData.url;
const wurl = getApp().globalData.wurl;

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,// tab切换  
    vCodeSrc:wurl+'/vcode/image',
    // vCodeSrc: '',
    WxCode:''
    
  },
  onLoad: function () {
    // 调用应用实例的方法获取全局数据
    let app = getApp();
    // toast组件实例
    new app.ToastPannel();
    let that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });  

     
  },
  onShow:function(){
    let that=this;
    //验证码
    wx.request({
      url: wurl + '/vcode/image',
    
      success: (res) => {
        let WxCode = res.header['Wx-Code'];
        let newWxCode = wx.getStorageSync("WxCode")
        console.log(newWxCode)
        if (newWxCode !== '' && newWxCode !== null) {
          that.setData({
            // vCodeSrc: wurl + '/vcode/image'
          })
        } else {
          that.setData({
            // vCodeSrc: wurl + '/vcode/image'
          })
          wx.setStorageSync("WxCode", WxCode)
        }
      }
    })
  },
  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // vCodeSrc验证码切换
  vCodeSrc:function(){
    let that=this;
    let timenow = new Date().getTime();
    let WxCode = wx.getStorageSync("WxCode");
    if (WxCode == "" || WxCode == null) {
      wx.getStorageSync("WxCode")
    } else {

    }
    wx.request({
      url: wurl + '/vcode/image?time=' + timenow,
      header: {
        'Wx-Code': WxCode
      },
      success: (res) => {
        console.log(res)
        that.setData({
          vCodeSrc: wurl + '/vcode/image?time=' + timenow
        })
      }
    })
  },
  //票据状态查询
  stateSubmit:function(e){
    let that=this;
    let billCode=e.detail.value.billCode;
    let billNum = e.detail.value.billNum;
    let vCode = e.detail.value.vCode;  
    // let WxCode=that.data.WxCode;
    let WxCode = wx.getStorageSync('WxCode')
    
    wx.request({
      url: wurl +'/vcode/validate',
      method:'POST',
      header:{
        'Wx-Code': WxCode
      },
      data:{
        vcode:vCode
      },
      success:(res)=>{
        console.log(res)
      }
    })
    if (billCode == '') {
      this.show('票据代码不能为空');
    }else if(billCode.length<8){
      this.show('请输入8位票据代码');
    }else if (billNum == '') {
      this.show('票据号码不能为空');
    } else if (billNum.length < 10) {
      this.show('请输入10位票据号码');
    } else{
      wx.showToast({
        title: '查询中...',
        icon: 'loading',
        mask: true,
        success: (res) => {
          wx.navigateTo({
            url: '../result/result?billNum=' + billNum + '&billCode=' + billCode + '&from=' + 'billcheck',
          })
        }
      })  
    }  
     
  },
  //票据信息查询
  infoSubmit:function(e){
    console.log(e)
    let billCode = e.detail.value.billCode;
    let billNum = e.detail.value.billNum;
    let holdingUnit = e.detail.value.holdingUnit;  
    let payName = e.detail.value.payName;
    let totalAmount = e.detail.value.totalAmount;
    if (billCode == '') {
      this.show('票据代码不能为空');
    } else if (billCode.length < 8) {
      this.show('请输入8位票据代码');
    } else if (billNum == '') {
      this.show('票据号码不能为空');
    } else if (billNum.length < 10) {
      this.show('请输入10位票据号码');
    } else if (holdingUnit == '') {
      this.show('收款单位不能为空');
    } else if (payName == '') {
      this.show('缴款人不能为空');
    } else if (totalAmount == '') {
      this.show('缴款金额不能为空');
    }else{
      wx.request({
        url: url + '/bill/validation/info?billCode=' + billCode + '&billNum=' + billNum + '&holdingUnit=' + holdingUnit + '&payName=' + payName + '&totalAmount=' + totalAmount,
        success: (res) => {
          console.log(res)
          let success = res.data.success;
          if (!!success) {
            let pdfUrl = res.data.retData;
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
                        console.log('打开文档成功')
                      }
                    })
                  } else {
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
          } else {
            console.log(res.data.retMsg)
            wx.showToast({
              title: '无此电子票据',
              image: '../../images/error.png',
              mask: true,
            })
          }
        }
      })
    }
  }
})  