// pages/calendar/calendarGroup.js

const app = getApp()
const baseUrl = "https://time.mytime.net.cn/";
var pageSize = 20;
var currentPage = 1;
const weekDayDic = {
  1:'星期日',
  2:'星期一',
  3:'星期二',
  4:'星期三',
  5:'星期四',
  6:'星期五',
  7:'星期六'
}
function getWeekDay(numStr){

  return weekDayDic[numStr] ? weekDayDic[numStr] : numStr;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log(res.windowHeight)
        that.setData({
          wHeight: res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.globalData.year);
    console.log(app.globalData.month);
    if (app.globalData.token) {
      wx.request({
        method: 'GET',
        header: { Authorization: 'time' + app.globalData.token },
        url: 'https://www.mytime.net.cn/getFileNames',
        data: { page: 0, pageSize: 20 },//, yearStr: app.globalData.year, monthStr:app.globalData.month
        success: res => {
          //console.log(res.data);
          if (res.data && res.data.result == 1) {

            if (res.data && res.data.extData && res.data.extData.length > 0) {
              var arrayTemp; var imgurls = [];
              for (var i = 0; i < res.data.extData.length; i++) {
                res.data.extData[i].weekdayStr = getWeekDay(res.data.extData[i].weekdayStr);
                if (res.data.extData[i].filepath) {
                  res.data.extData[i].largefilepath = baseUrl + res.data.extData[i].filepath;
                  imgurls.push(baseUrl + res.data.extData[i].filepath);
                  arrayTemp = res.data.extData[i].filepath.split('.');
                  if (arrayTemp.length == 2) {
                    res.data.extData[i].filepath = arrayTemp[0] + '_' + res.data.extData[i].slavePostfix + '.' + arrayTemp[1];
                  }
                }
              }

              this.setData({
                imgurls: imgurls,
                records: res.data.extData
              });
            }
          } else {
            console.error(res);
            var msg = '';
            if (res.data.message == "Access Denied") {
              msg += '您没有权限';
            }

            wx.showModal({
              title: '获取失败',
              content: msg,
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          }
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }
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
  
  }, preViewImg: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current:src, 
      urls: imgList 
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})