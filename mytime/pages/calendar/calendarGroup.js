// pages/calendar/calendarGroup.js

const app = getApp()
const baseUrl = "https://time.mytime.net.cn/";
var pageSize = 10;
var currentPage = 0;
var oldDis,oldScale=1;
var winWidth, winHeight;
var silkTempPath;
var files=[];
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

function loadFileNames(that) {
  wx.request({
    method: 'GET',
    header: { Authorization: 'time' + app.globalData.token },
    url: 'https://www.mytime.net.cn/getFileNames',
    data: { page: currentPage, pageSize: pageSize, yearStr: app.globalData.year, monthStr: app.globalData.month },
    success: res => {
      console.log(res.data);
      if (res.data && res.data.result == 1) {

        if (res.data && res.data.extData && res.data.extData.length > 0) {
          currentPage++;
          var arrayTemp; var wJson;
          for (var i = 0; i < res.data.extData.length; i++) {
            res.data.extData[i].weekdayStr = getWeekDay(res.data.extData[i].weekdayStr);
            if (res.data.extData[i].weather) {
              try {
                wJson = JSON.parse(res.data.extData[i].weather);
                if (wJson && wJson.liveData) {
                  res.data.extData[i].area = wJson.liveData.province + " " + wJson.liveData.city;
                  res.data.extData[i].weatherStr = wJson.liveData.weather + " " + wJson.liveData.temperature + "℃ " + wJson.liveData.winddirection + "风 " + wJson.liveData.windpower + "级 湿度" + wJson.liveData.humidity + "%";
                }
              } catch (e) { }

            }

            if (res.data.extData[i].filepath) {
              res.data.extData[i].largefilepath = baseUrl + res.data.extData[i].filepath;
              arrayTemp = res.data.extData[i].filepath.split('.');
              if (arrayTemp.length == 2 && res.data.extData[i].slavePostfix) {
                res.data.extData[i].filepath = arrayTemp[0] + '_' + res.data.extData[i].slavePostfix + '.' + arrayTemp[1];
              }
            }
          }
          files = files.concat(res.data.extData);
          that.setData({
            records: files
          });
        }else{
          wx.showToast({
            title: '没有更多内容了',
            icon: 'none',
            duration:1000
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
        //console.log(res.windowHeight)
        winWidth = res.windowWidth;// * res.pixelRatio-60
        winHeight = res.windowHeight-10;
        that.setData({
          scaleWidth:winWidth,
          winHeight: winHeight
        });
      }
    })
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    currentPage = 0;
    files = [];
    //console.log(app.globalData.year);
    //console.log(app.globalData.month);
    if (app.globalData.token) {
      // 使用 wx.createAudioContext 获取 audio 上下文 context
      this.audioCtx = wx.createAudioContext('myAudio')
      loadFileNames(this);

    }
  },
  loadMore:function(){
    loadFileNames(this);
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
  showPreview: function (event){
    oldScale = 1;
    var src = event.currentTarget.dataset.src;//获取data-src
    this.setData({
      largefilepath:src,
      isShowPreview:true,
      scaleWidth: winWidth 
    });
  },
  hidePreview:function(){
    this.setData({
      isShowPreview: false
    });
  },
  preimgtmover: function (e){
    if (e.touches){
      if (e.touches.length>1){
        var xMove = e.touches[1].clientX - e.touches[0].clientX;
        var yMove = e.touches[1].clientY - e.touches[0].clientY;
        var distance = Math.sqrt(xMove * xMove + yMove * yMove);
        if (!oldDis){
          oldDis = distance;
        }
        var newScale = oldScale + 0.0001 * (distance-oldDis);
        oldScale = newScale;
        if (newScale < 0.9) { newScale=1}
        this.setData({
          scaleWidth:newScale * winWidth
        });
      }else{
        //oldScale=1;
        oldDis=0;
      }
    } else {
      oldDis = 0;
    }
   
  },
  preimgtmoverEnd:function(e){
    oldDis = 0;
  },
  showAudio: function (event){
    var src = event.currentTarget.dataset.src;//获取data-src
    var that = this;
    this.setData({
      isShowAudio: true
    });
    if (src.indexOf('silk')>0){
      this.setData({
        isSilk: true,
        autioPicSrc: 'https://www.mytime.net.cn/res/file_audio.png'
      });
      //先下载到本地后才能播放
      const downloadTask = wx.downloadFile({
        url: src,
        success: function (res) {
          silkTempPath = res.tempFilePath;
          that.setData({
            autioPicSrc: 'https://www.mytime.net.cn/res/file_audio.png'
          });
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      })

      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      })

    }else{
      that.setData({
        audio_largefilepath: src
      });
    }


    //downloadTask.abort() // 取消下载任务
  },
  playSilk:function(){
    wx.playVoice({
      filePath: silkTempPath
    })
  },
  pauseSilk:function(){
    wx.pauseVoice();
  },
  stopSilk:function(){
    wx.stopVoice();
  },
  hidePreviewAudio:function(){
    wx.stopVoice();
    this.setData({
      isShowAudio: false
    });
  },
  showVideo: function (event){
    var src = event.currentTarget.dataset.src;//获取data-src
    var w = event.currentTarget.dataset.w;//获取width
    var h = event.currentTarget.dataset.h;//获取height

    var videoWidth = w ? w:winWidth;
    var videoHeight = h ? h:(winHeight-10);
 

    this.setData({
      video_largefilepath: src,
      isShowVideo: true,
      videoWidth: videoWidth,
      videoHeight: videoHeight
    });
  }, 
  hidePreviewVideo:function(){
    this.setData({
      isShowVideo: false
    });
  },
  audioPlay: function () {
    
    //this.audioCtx.setSrc('')
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audioStart: function () {
    this.audioCtx.seek(0)
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
  },
  showMapLocation:function(event){
    var lng = event.currentTarget.dataset.lng;//获取data-lng
    var lat = event.currentTarget.dataset.lat;//获取data-lat
    if (lng&&lat){
      wx.openLocation({
        type: 'gcj02',
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
      })
    }else{
      wx.showToast({
        title: '没有经纬度数据',
        icon: 'fail',
        duration: 1000
      });
    }
   
  }
})