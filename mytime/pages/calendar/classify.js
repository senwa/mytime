// pages/calendar/classify.js
const app = getApp()
const date = new Date()
const years = []
const year2MonthsArr = {}
var curYearIndex = 0;
var curMonthIndex = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.token) {
      wx.request({
        method: 'GET',
        header: { Authorization: 'time' + app.globalData.token },
        url: 'https://www.mytime.net.cn/getDaysMonthsOrYears',
        data: { flag: 'yearMonth'},
        success: res => {
          console.log(res.data);
          if (res.data && res.data.result == 1) {
            if (res.data && res.data.extData && res.data.extData.length > 0) {
              //years.push(i)
              var len = res.data.extData.length;
              var dd = res.data.extData;
              var tmpArr;
              var mTmpArr;
              for (var i = 0; i < len;i++){
                tmpArr = dd[i].split('#');
                years.push(tmpArr[0]);
                year2MonthsArr[tmpArr[0]] = [];
                mTmpArr = tmpArr[1].split(",");
                for (var m = 0; m < mTmpArr.length;m++){
                  year2MonthsArr[tmpArr[0]].push(mTmpArr[m]);
                }
              }

              this.setData({
                years: years,
                months: year2MonthsArr[years[0]]
              });
            }else{
              wx.showModal({
                title: '提示',
                content: "您没有上传任何记录,请先上传记录!",
                showCancel: false,
                success: function (res) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              });
            }
          } else {
            console.error(res);
            var msg = '';
            if (res.data.message == "Access Denied") {
              msg += '您没有权限';
            }

            wx.showModal({
              title: '获取日期失败',
              content: msg,
              showCancel: false,
              success: function (res) {
                //wx.navigateBack({
                //  delta: 1
                //});
                wx.navigateTo({
                  url: '../index/index',
                })
              }
            });
          }
        },
        fail: function (res) {
          console.log(res);
          wx.showModal({
            title: '获取日期失败',
            content: msg,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              });
            }
          });
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
  
  },
  yearChange:function(e){
    curYearIndex = e.detail.current;
    this.setData({
      years: years,
      months: year2MonthsArr[years[curYearIndex]],
      curMonthIndex: 0
    })
  },
  monthChange: function (e) {
    curMonthIndex = e.detail.current;
  },
  goCalGroup:function(){
    app.globalData.year = years[curYearIndex];
    app.globalData.month = year2MonthsArr[years[curYearIndex]][curMonthIndex];
    wx.navigateTo({
      url: 'calendarGroup'
    });
  }
})