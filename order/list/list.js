
// list.js
var Bmob = require('../../utils/bmob.js');
var that;
var seq = 0;
var state = 10;

Page({
  data: {
    page_index: 0,//当前页
    orderList: [],//存放订单信息
    loadingTip: ' ',//上拉加载提示
    isAdmin: wx.getStorageSync('isAdmin'),//当前用户身份
    visual: 'hidden'//隐藏页是否可见

  },
  onLoad: function () {
    that = this;
  },
  showDetail: function (e) {// 传递订单objectId跳转到detail显示详细信息
    var index = e.currentTarget.dataset.index;//存放objectId		
    wx.navigateTo({
      url: '../detail/detail?objectId=' + that.data.orderList[index].id
    })
  },

  onShow: function () {//调用订单加载函数
    that.loadOrder();
  },
  loadOrder: function () {//加载订单
    var page_size = 20;//设置页大小
    var query = new Bmob.Query('Order');//查询订单的用户和地址信息
    query.include('user');
    query.include('address');
    if (!wx.getStorageSync('isAdmin')) {//提取isAdmin如果不是管理员身份则在user表中查找到当前用户信息
      query.equalTo('user', Bmob.User.current());//  query.equalTo(列名, 值);		//等于
    }
    if (state == 1) {
      query.equalTo('status', 1);
    }
    else if (state == 2) {
      query.equalTo('status', 2);
    }
    if (seq == 0) {
      // 按照创建时间逆序排列
      query.descending('createdAt');
    }
    else {
      query.ascending('createdAt');
    }
    // 分页
    query.limit(page_size);
    query.skip(that.data.page_index * page_size);
    // 查询所有数据
    query.find().then(function (results) {
      // 请求成功将数据存入orderList
      that.setData({
        orderList: that.data.page_index == 0 ? results : that.data.orderList.concat(results)
      });
      // 判断上拉加载状态如果需要显示的结果数等于小于页大小且不是开头则显示没有更多内容
      if (results.length < page_size && that.data.page_index != 0) {
        that.setData({
          loadingTip: '没有更多内容'
        });
      }
      // holder如果需要显示的结果数等于0且页码等于0则显示没有订单加载holder否则隐藏
      that.setData({
        visual: results.length == 0 && that.data.page_index == 0 ? 'show' : 'hidden'
      });
    }, function (error) {//如果出错显示查询失败及错误代码信息
      alert("查询失败: " + error.code + " " + error.message);
    });
  },
  onReachBottom: function () {//如果到底了就加一页
    that.setData({
      page_index: ++that.data.page_index
    });
    that.loadOrder();
  },
  sendonly: function () {//如果到底了就加一页
    /*wx.navigateTo({
    url: '../lists/lists',
  })*/
    state = 1;
    that.loadOrder();
  },
  sendingonly: function () {//如果到底了就加一页
    state = 2;
    that.loadOrder();
  },
  allorder: function () {//如果到底了就加一页
    state = 10;
    that.loadOrder();
  },
  asc: function () {//如果到底了就加一页
    seq = 1;
    that.loadOrder();
  },
  desc: function () {//如果到底了就加一页
    seq = 0;
    that.loadOrder();
  },
  payment: function (e) {//暂无
    var index = e.currentTarget.dataset.index;
    var order = that.data.orderList[index];
    getApp().payment(order);
  }
})