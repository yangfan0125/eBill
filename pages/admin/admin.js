const app = getApp();
const wurl = app.globalData.wurl;
// const avatarUrl=app.globalData.avatarUrl;
// console.log(avatarUrl)
Page({
data: {
  // avatarUrl: app.globalData.avatarUrl,
  // avatarUrl: '/images/admin-icon.png',
  avatarUrl: '/images/admin-icon.png',
  
  sub:'',
  isLogin:app.globalData.isLogin
},
//退出登录
loginOut: function () {
  let that=this;
  let wx_token = wx.getStorageSync('wx_token')
  wx.request({
    url: wurl + '/logout',
    header: {
      'Wx-Token': wx_token
    },
    success: (res) => {
      let success=res.data.success;
      if(!!success){
        if(res.data.retData){
          wx.showModal({
            title: '提示',
            content: '退出成功',
            showCancel: false,
            success: (res) => {
              app.globalData.isLogin = false;
              that.setData({
                isLogin: false
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.retMsg,
            showCancel: false,
            success: (res) => {
            }
          })
        }
      }else{
      }
    }
  })
},
onLoad:function(options){
  let that = this;
  let isLogin = app.globalData.isLogin;
  if(isLogin){
    //判断会话是否过期
    let wx_token = wx.getStorageSync('wx_token');
    let sub = wx.getStorageSync('sub');    
    wx.request({
      url: wurl + '/login.do',
      header: {
        'Wx-Token': wx_token
      },
      success: (res) => {
        console.log(res)
        let success=res.data.success;
        if(!!success){
          let retData=res.data.retData;
          if(retData){
            app.globalData.isLogin=true;
            that.setData({
              isLogin: true,
              sub:sub
            })
          }else{
            app.globalData.isLogin = false;
            that.setData({
              isLogin: false
            })
          }
        }else{
        }
      }
    })
  }
  //授权userInfo
  if (app.globalData.avatarUrl!==''){
    that.setData({
      avatarUrl: app.globalData.avatarUrl
    })
  }else{
  
  }
}
})  