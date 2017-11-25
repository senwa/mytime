// pages/videoList/videoList.js
//获取应用实例
const app = getApp()
var pageSize = 20;
var currentPage = 1;
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
    if (app.globalData.token){
      wx.request({
        method:'GET',
        header: { Authorization: 'time' + app.globalData.token },
        url: 'https://www.mytime.net.cn/getFileNames', 
        data: { currentPage: currentPage, pageSize: pageSize},
        success: res =>  {
          console.log(res.data);
          if(res.data&&res.data.result==1){

            if(res.data && res.data.extData && res.data.extData.length>0){
              this.setData({
                records: res.data.extData
              });
            }
          }else{
            console.error(res);
            var msg ='';
            if (res.data.message =="Access Denied"){
              msg+='您没有权限';
            }

            wx.showModal({
              title: '获取失败',
              content: msg,
              showCancel:false,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          }
        },
        fail: function (res){
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
  
  }
})