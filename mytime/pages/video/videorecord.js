// pages/video/videorecord.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploader:null,
    animationData: "",
    showModalStatus: false,
    isWaiting:false,
    progressPercent: 0
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
    if (!app.globalData.token){//发现未登录,跳转到登录页面
      wx.navigateTo({
        url: "../index/index"
      })
    }
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
 // onShareAppMessage: function () {},
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      isWaiting: false,
      progressPercent: 0
    });
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 200);
  },
  clickbtn: function () {
    if (this.data.showModalStatus) {
      this.hideModal();
    } else {
      this.showModal();
    }
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        isWaiting:false,
        progressPercent: 0
      })
    }.bind(this), 200)
  },
  videoRecord: function () {
    /*wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });*/
    var that = this;
    wx.chooseVideo({
      sourceType: [/*'album',*/ 'camera'],
      compressed:false,
      maxDuration: 50,
      success: function (res) {
        console.log(res);
        that.showModal();
        var tempFilePath = res.tempFilePath;
        const uploadTask = wx.uploadFile({
          url: 'https://www.mytime.net.cn/upload',
          filePath: tempFilePath,
          name: 'file',
          header: { Authorization: 'time'+app.globalData.token},
          formData: {
            'duration': res.duration,
            'height':res.height,
            'size':res.size,
            'width':res.width
          },
          success: function (res) {
            var data = res.data;
            that.hideModal();
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2300
            });
          },
          fail:function(){
            wx.showToast({
              title: '上传失败',
              icon: 'fail',
              duration: 2300
            });
          }
        });
        uploadTask.onProgressUpdate((res) => { 
          var p;
          that.data.uploader = uploadTask;
          if (res.progress<=99){
            p = res.progress;
            that.data.isWaiting = false;
          }else{
            p = 99;
            that.data.isWaiting=true;
          } 
          that.setData({ 
            progressPercent: p, 
            totalBytesSent: res.totalBytesSent, 
            totalBytesExpectedToSend: res.totalBytesExpectedToSend,
            isWaiting: that.data.isWaiting
          });
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      },fail:function(){
          wx.showToast({
              title: '拍摄视频失败',
              icon: 'fail',
              duration: 2300
          });
      },complete:function(res){
        console.log(res);
      }
    });

  },
  picRecord: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sourceType: [/*'album',*/ 'camera'],
      success: function (res) {
        that.showModal();
        var tempFilePaths = res.tempFilePaths
        const uploadTask = wx.uploadFile({
          url: 'https://www.mytime.net.cn/upload',
          filePath: tempFilePaths[0],
          header: { Authorization: 'time' + app.globalData.token },
          name: 'file',
          formData: {
            
          },
          success: function (res) {
            var data = res.data;
            that.hideModal();
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
        uploadTask.onProgressUpdate((res) => {
          var p;
          that.data.uploader = uploadTask;
          if (res.progress <= 99) {
            p = res.progress;
            that.data.isWaiting = false;
          } else {
            p = 99;
            that.data.isWaiting = true;
          }
          that.setData({
            progressPercent: p,
            totalBytesSent: res.totalBytesSent,
            totalBytesExpectedToSend: res.totalBytesExpectedToSend,
            isWaiting: that.data.isWaiting
          });
          console.log('上传进度', res.progress);
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
        });
      }
    });
  },
  audioRecord: function () {
    var that = this;
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        const uploadTask = wx.uploadFile({
          url: 'https://www.mytime.net.cn/upload',
          filePath: tempFilePath,
          header: { Authorization: 'time' + app.globalData.token },
          name: 'file',
          formData: {
            
          },
          success: function (res) {
            var data = res.data;
            that.hideModal();
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            });
          }
        });
        uploadTask.onProgressUpdate((res) => {
          var p;
          that.data.uploader = uploadTask;
          if (res.progress <= 99) {
            p = res.progress;
            that.data.isWaiting = false;
          } else {
            p = 99;
            that.data.isWaiting = true;
          }
          that.setData({
            progressPercent: p,
            totalBytesSent: res.totalBytesSent,
            totalBytesExpectedToSend: res.totalBytesExpectedToSend,
            isWaiting: that.data.isWaiting
          });
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      }
    });
    setTimeout(function () {
      //结束录音  
      wx.stopRecord();
      that.showModal();
    }, 20000);

  },
  toRecordList: function () {
    wx.navigateTo({
      url: '../videoList/videoList'
    })
  },
  click_cancel: function () {
    console.log("点击取消");
    this.hideModal();
    if (this.data.uploader){
      this.data.uploader.abort();
    }
  }
})