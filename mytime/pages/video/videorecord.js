// pages/video/videorecord.js
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
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

  videoRecord:  function () {
    wx.chooseVideo({
        count: 1,
        sourceType: ['album','camera'],
            maxDuration: 120,
      camera: 'back',
      success: function (res) {
        var tempFilePath = res.tempFilePath
        const uploadTask = wx.uploadFile({
          url: 'https://www.mytime.net.cn/upload',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      }
    });
  
  },
  picRecord: function () {
    wx.chooseImage({
      count:1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        const uploadTask = wx.uploadFile({
          url: 'https://www.mytime.net.cn/upload', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress);
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
        });
      }
    });
  },
  audioRecord: function () {
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        const uploadTask = wx.uploadFile({
          url: 'https://www.mytime.net.cn/upload',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      }
    });   
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
    }, 20000);

  },
  toRecordList: function () {
    wx.navigateTo({
      url: '../videoList/videoList'
    })
  },
})