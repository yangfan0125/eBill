const app=getApp();
const wurl =app.globalData.wurl;

Page({
data:{
  wx_token:'',
  isLogin: false
},
//用户名失去焦点
subBlur: function (e) {
  console.log(e.detail.value)
  let sub = e.detail.value;
  if (sub == '') {
    wx.showModal({
      title: '提示',
      content: '用户名不能为空',
      showCancel: false,
      success: function (res) {
      }
    })
  } else if (!(/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/.test(sub))) {
    wx.showModal({
      title: '提示',
      content: '提您输入的用户名有误',
      showCancel: false,
      success: function (res) {
      }
    })
  } 
},
//登录
  formSubmit:function(e){
    wx.login({
      success: res => {
        let code = res.code;
        wx.setStorageSync('code', code)
        let sub = e.detail.value.sub;
        let token = e.detail.value.token
        wx.request({
          url: wurl + '/login',
          method: "POST",
          data: {
            sub: sub,
            token: token,
            code: code
          },
          success: (res) => {
            console.log(res)
            if(sub==''){
              wx.showModal({
                title: '提示',
                content: "用户名不能为空",
                showCancel: false,
                success: (res) => {
                }
              })
            }else if(token==''){
              wx.showModal({
                title: '提示',
                content: "密码不能为空",
                showCancel: false,
                success: (res) => {
                }
              })
            }else{
              let success = res.data.success;
              if (!!success) {
                if(res.data.retData==null){
                  wx.showModal({
                    title: '提示',
                    content: res.data.retMsg,
                    showCancel: false,
                    success: (res) => {
                    }
                  })
                }else{
                  let wx_token = res.data.retData.wx_token;
                  wx.showToast({
                    title: '登录成功',
                    success: (res) => {
                      app.globalData.isLogin = true;
                      wx.setStorageSync('wx_token', wx_token)
                      wx.setStorageSync('sub', sub)
                      wx.switchTab({
                        url: '../admin/admin',
                        success:()=>{
                          let page = getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onLoad(); 
                        }
                      })
                    }
                  })
                }
              
              } else {
              }
            }
          }
        })
      }
    })
   
  },
  onLoad:function(options){


  }
})  