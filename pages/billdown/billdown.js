const app = getApp();
const wurl = app.globalData.wurl;

Page({
  data:{
    list:[],
    selectedAllStatus: false,
    blank: true,
    hasMoreData: true,//加载更多
    page: 1,
    pageSize: 10
  },
  //checkbox
  bindCheckbox: function (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let selected = this.data.list[index].selected;
    let list = this.data.list;
    list[index].selected = !selected;
    let arr = []
    for (let key of list) {
      if (key.selected) {
        arr.push(key)
      }
    }
    let selectedAllStatus = '';
    if (arr.length != list.length) {
      selectedAllStatus = false;
    } else {
      selectedAllStatus = true;
    }
    this.setData({
      list: list,
      selectedAllStatus: selectedAllStatus
    });
  },
  //全选
  bindSelectAll: function () {
    let selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    let list = this.data.list;
    for (let key of list) {
      key.selected = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      list: list
    })
  },
  //下载
  down: function () {
    let list = this.data.list;
    let selectedarr = []
    for (let key of list) {
      if (key.selected) {
        selectedarr.push(key)
      }
    }
    let resultarr=[]
    for (let key of selectedarr) {
      resultarr.push({ 
        'orderNum': key.orderNum, 
        'holdingUnitCode': key.holdingUnitCode
        })
    }
    resultarr= JSON.stringify(resultarr)
    wx.navigateTo({
      url: '../email/email?resultarr=' + resultarr + '&from=' + 'billdown',
    })
  },
  onLoad: function (options) {
    let that = this;
    let wx_token = wx.getStorageSync('wx_token');
    that.setData({
      wx_token: wx_token
    })
    wx.request({
      url: wurl + '/login.do',
      header: {
        'Wx-Token': wx_token
      },
      success: (res) => {
        let success = res.data.success;
        if (!!success) {
              let result = res.data;
              if (!!result.retData) {
                app.globalData.isLogin = true;
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  success: () => {
                     that.getContent()
                  }
                })   
              } else {
                app.globalData.isLogin = false;
                wx.showModal({
                  title: '提示',
                  content: '请登录后查看信息',
                  success: (res) => {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '../login/login',
                      })
                    }else if(res.cancel){
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
        } else {
          app.globalData.isLogin = false;

          wx.showModal({
            title: '提示',
            content: '请登录后查看信息',
            // showCancel: false,
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
  getContent: function () {
    let that = this;
    let wx_token = wx.getStorageSync('wx_token');
    that.setData({
      wx_token: wx_token
    })
    let page = that.data.page;
    let pageSize = that.data.pageSize;

    wx.request({
      url: wurl + '/bill/set?page=' + page + '&size=' + pageSize,
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
            if (contentarr.length < that.data.pageSize) {
              let longarr = contentListTem.concat(contentarr);
              that.setData({
                hasMoreData: false,
                list: longarr,
                blank: false
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