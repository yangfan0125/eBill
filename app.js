import { ToastPannel } from './component/toast/toast';
//app.js
App({
  ToastPannel,
  onLaunch: function () {
    let that = this;    
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              let avatarUrl = res.userInfo.avatarUrl
              that.globalData.avatarUrl=avatarUrl;
            }
          })
        } else if (!res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              let avatarUrl = res.userInfo.avatarUrl
              that.globalData.avatarUrl = avatarUrl;
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    url: 'https://dev.axnecp.com/cs/user/proxy',
    qrurl: 'https://qr.axnecp.com/qr',
    wurl:'https://dev.axnecp.com/cs/user/wechat',
    isLogin:false,
    avatarUrl: '',
  }
})