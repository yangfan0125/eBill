//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  scan: function () {
    // let res = 'https://qr.axnecp.com/?qid=gS9AN1kH7GYK+K54y0mcAw==';
    let res = 'https://qr.axnecp.com/?qid=PADlhJnXJ5hJCIam2632uA==';

    let index=res.indexOf('?qid=')+5;
    if(res.includes('/?qid')){
      let qid = encodeURIComponent(res.substring(index, res.length))
      wx.navigateTo({
        url: "../ticket/ticket?q=" + qid
      })
    }else{
      //扫码失败
    }
    
    // wx.scanCode({
    //   success: (res) => {
    //     let result=res.result;
    //     let index=result.indexOf('?qid=')+5;
    //     if(result.includes('/?qid')){
    //       let qid = encodeURIComponent(result.substring(index, res.length))
    //       wx.navigateTo({
    //         url: "../ticket/ticket?q=" + qid
    //       })
    //     }else{
    //       //扫码失败
    //       wx.showModal({
    //         title: '提示',
    //         content: '二维码识别失败',
    //         showCancel:false,
    //         success: function (res) {
    //           if (res.confirm) {
    //            //用户点击确定
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
