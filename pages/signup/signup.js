const url = getApp().globalData.url;

Page({
 data:{
   userPassword:'',
   selected:true
 },
 //手机号失去焦点
 userLoginNameBlur:function(e){
    console.log(e.detail.value)
    let userLoginName=e.detail.value;
    if (userLoginName == '') {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
        showCancel: false,
        success: function (res) {
        }
      })
    } else if (!(/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/.test(userLoginName))) {
      wx.showModal({
        title: '提示',
        content: '提您输入的手机号码有误',
        showCancel: false,
        success: function (res) {
        }
      })
    }else{
      wx.request({
        url: url + '/user/check?userLoginName=' + userLoginName,
        success:(res)=>{
          console.log(res)
          let success=res.data.success;
          if(!!success){
            if (res.data.retData){
              wx.showModal({
                title: '提示',
                content:'该手机号已注册',
                showCancel: false,
                success: function (res) {
                }
              })
            }else{

            }
          }else{

          }
        }
      })
    } 


 },
 //身份证号失去焦点
 userIdNumBlur:function(e){
   let userIdNum = e.detail.value;
   if (userIdNum == '') {
     wx.showModal({
       title: '提示',
       content: '身份证号码不能为空',
       showCancel: false,
       success: function (res) {
       }
     })
   } else if (!(/^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/.test(userIdNum))) {
     wx.showModal({
       title: '提示',
       content: '提您输入的身份证号码有误',
       showCancel: false,
       success: function (res) {
       }
     })
   } 
 },
 //密码失去焦点
 userPasswordBlur:function(e){
   let that=this;
   let userPassword=e.detail.value;
   that.setData({
     userPassword: userPassword
   })
   if (userPassword == '') {
     wx.showModal({
       title: '提示',
       content: '密码不能为空',
       showCancel: false,
       success: function (res) {
       }
     })
   }
 },
 //确认密码失去焦点
 userPasswordBlur2: function (e) {
   let that = this;   
   let userPassword2 = e.detail.value;
   let userPassword = that.data.userPassword;
   if (userPassword2 == '') {
     wx.showModal({
       title: '提示',
       content: '确认密码不能为空',
       showCancel: false,
       success: function (res) {
       }
     })
   } else if (userPassword !== userPassword2){
     wx.showModal({
       title: '提示',
       content: '两次密码输入不一致',
       showCancel: false,
       success: function (res) {
       }
     })
   }
 },
 bindCheckbox:function(){
  let selected=this.data.selected;
  selected=!selected;
  this.setData({
    selected: selected
  })
 },
 //网站注册协议
 protocal:function(){

 },
formSubmit:function(e){
  let that=this;
  let userLoginName = e.detail.value.userLoginName;
  let userIdNum = e.detail.value.userIdNum;
  let userPassword = e.detail.value.userPassword;
  let userPassword2 = e.detail.value.userPassword2;
  let selected=that.data.selected;
  if(!selected){
    wx.showModal({
      title: '提示',
      content: '请先同意网站注册协议',
      showCancel: false,
      success: function (res) {
      }
    })
  }else if (userLoginName == '') {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
        showCancel: false,
        success: function (res) {
        }
      })
  } else if (!(/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/.test(userLoginName))) {
      wx.showModal({
        title: '提示',
        content: '提您输入的手机号码有误',
        showCancel: false,
        success: function (res) {
        }
      })
  } else if (userIdNum == '') {
    wx.showModal({
      title: '提示',
      content: '身份证号码不能为空',
      showCancel: false,
      success: function (res) {
      }
    })
  } else if (!(/^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/.test(userIdNum))) {
    wx.showModal({
      title: '提示',
      content: '提您输入的身份证号码有误',
      showCancel: false,
      success: function (res) {
      }
    })
  } else if (userPassword == '') {
    wx.showModal({
      title: '提示',
      content: '密码不能为空',
      showCancel: false,
      success: function (res) {
      }
    })
  } else if (userPassword2 == '') {
    wx.showModal({
      title: '提示',
      content: '确认密码不能为空',
      showCancel: false,
      success: function (res) {
      }
    })
  }else if(userPassword!==userPassword2){
    wx.showModal({
      title: '提示',
      content: '两次密码输入不一致',
      showCancel:false,
      success:function(res){
      }
    })
  }else{
    wx.request({
      url: url +'/user/signup',
      method:'POST',
      data:{
        userLoginName: userLoginName,
        userPassword: userPassword,
        idNum: userIdNum
      },
      success:(res)=>{
        console.log(res)
        let success=res.data.success;
        if(!!success){
          if(res.data.retData){
            wx.showModal({
              title: '提示',
              content: '注册成功',
              showCancel: false,
              success: function (res) {
                if(res.confirm){
                  wx.navigateTo({
                    url: '../login/login',
                  })
                }
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '注册失败',
              showCancel: false,
              success: function (res) {
              }
            })
          }
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.retMsg,
            showCancel: false,
            success: function (res) {
            }
          })
        }
      }
    })
  }
},
onLoad:function(){
  let that = this;
 
},
 
})  