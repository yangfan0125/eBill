const app = getApp();
const wurl = app.globalData.wurl;

Page({
  data:{
    list:[],
    wx_token:'',
    blank:true,
    hasMoreData: true,//加载更多
    page: 1,
    pageSize: 10
  },
  //票据查看
  examineBill:function(e){
    let that = this;
    let pdfUrl = e.currentTarget.dataset.pdfurl;
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
  },
  //票据下载
  billDown:function(e){
    let orderNum=e.currentTarget.dataset.ordernum;
    let holdingUnitCode =e.currentTarget.dataset.holdingunitcode;

    wx.navigateTo({
      url: '../email/email?orderNum=' + orderNum + '&holdingUnitCode=' + holdingUnitCode+ '&from='+'collection',
    })
  },
  onLoad:function(options){
    let that=this;
    let wx_token=wx.getStorageSync('wx_token');
    that.setData({
      wx_token:wx_token
    })
    //判断会话是否过期
    wx.request({
      url: wurl + '/login.do',
      header: {
        'Wx-Token': wx_token
      },
      success: (res) => {
        console.log(res)
        let success=res.data.success;
        if(!!success){
              let result=res.data;
              if(!!result.retData){
                app.globalData.isLogin = true;
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  success: () => {
                that.getContent()
                }
              }) 
              }else{
                app.globalData.isLogin = false;
                wx.showModal({
                  title: '提示',
                  content: '请登录后查看信息',
                  success:(res)=>{
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '../login/login',
                      })
                    } else if(res.cancel){
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
              
        }else{
          app.globalData.isLogin = false;          
          wx.showModal({
            title: '提示',
            content: '请登录后查看信息',
            success: (res) => {
              console.log(res)
              if (res.confirm) {
                wx.redirectTo({
                  url: '../login/login',
                })
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
        }
      }
    })

  },
  //获取数据  加载更多
  getContent:function(){
    let that = this;
    let wx_token = wx.getStorageSync('wx_token');
    that.setData({
      wx_token: wx_token
    })
    let page = that.data.page;
    let pageSize = that.data.pageSize;  

    wx.request({
      url: wurl + '/bill/set?page='+page +'&size='+pageSize,
      header: {
        'Wx-Token': wx_token
      },
      success: (res) => {
        wx.hideLoading()
        let contentListTem = that.data.list;
        let success = res.data.success;
        if (!!success) {
          let contentarr = res.data.retData;
          if (that.data.page == 1) {
            contentListTem = []
          }
          if (contentarr && contentarr != null) {
            if (contentarr.length< that.data.pageSize) {
              let longarr = contentListTem.concat(contentarr);
              that.setData({
                hasMoreData: false,
                list: longarr,
                blank:false
              })
            } else {
              that.setData({
                list: contentListTem.concat(contentarr),
                hasMoreData: true,
                page: that.data.page + 1,
                blank: false
                
              })
            }
          }
        }else{

        }
      }
    })
  },
  lower: function () {
    let that = this;
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
})  