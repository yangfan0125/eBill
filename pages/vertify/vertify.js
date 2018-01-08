const url = getApp().globalData.url;
Page({
  data: {
    // vCodeSrc:url+'/vcode/image'
    vCodeSrc: ''
  },
  onLoad: function () {
    // 调用应用实例的方法获取全局数据
    let app = getApp();
    // toast组件实例
    new app.ToastPannel();
    let that = this;
    let timenow = new Date().getTime();
    that.setData({
      vCodeSrc: url + '/vcode/image?time=' + timenow
    })
  },
 
  //vCodeSrc验证码切换
  vCodeSrc: function () {
    let that = this;
    let timenow = new Date().getTime();
    that.setData({
      vCodeSrc: url + '/vcode/image?time=' + timenow
    })
  },
  //票据信息查询
  urlSubmit: function (e) {
    let ebillUrl = e.detail.value.ebillUrl;
    let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    let res = reg.test(ebillUrl);
    if (ebillUrl == '') {
      this.show('电子票据URL不能为空');
    } else if(!res){
      this.show('输入的URL有误');      
    }else {
      wx.request({
        url: url + '/bill/auth/url',
        method:"POST",
        data:{
          pdfUrl:ebillUrl
        },
        success: (res) => {
          console.log(res)
          let success = res.data.success;
          if (!!success) {
            wx.showModal({
              title: '提示',
              content: '票据签名真实有效 自签名以来，票据未被修改',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //用户点击确定
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '票据签名无效',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //用户点击确定
                }
              }
            })
          }
        }
      })
    }
  }
})  