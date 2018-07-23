// detail.js
var Bmob = require('../../utils/bmob.js');
var that;
Page({
	data: {
		isAdmin: wx.getStorageSync('isAdmin')//身份信息
	},
	onLoad: function (options) {//加载
		that = this;
		that.loadOrder(options.objectId);//按id加载订单
		// that.setData({
		// 	objectId: options.objectId
		// });
		getApp().loadSeller(function (seller) {//加载卖家信息
			that.setData({
				seller: seller
			});
		});
	},
  loadOrder: function (objectId) {// 加载订单详情
    var query = new Bmob.Query('Order');//查询订单的用户和地址信息
		query.include('user');
		query.include('address');
		query.get(objectId).then(function (order) {//如果按id查询成功显示订单信息
			that.setData({
				order: order
			});
		});
	},
	contact: function () {//联系卖家
		var telephone = that.data.seller.get('telephone');
		wx.makePhoneCall({
			phoneNumber: telephone //仅为示例，并非真实的电话号码
		})
	},
	/*payment: function () {//暂无实际支付
		// 支付
		getApp().payment(that.data.order);
	},*/

  payment: function () {//点击弹出确定支付吗
    // 支付
    wx.showModal({
      title: '确定支付吗？',
      success: function (res) {
        if (res.confirm) {
          // 完成支付将订单状态变为1待配送并保存，然后弹出订单已支付字样
          var order = that.data.order;
          order.set('status', 1);
          order.save().then(function (orderSaved) {
            wx.showToast({
              title: '订单已支付',
              success: function () {
                that.setData({
                  order: orderSaved
                });
              }
            });
          })
        }
      }
    });
  },
  cancel: function () {//点击弹出确定支付吗
    // 取消支付
    wx.showModal({
      title: '确定取消支付吗？',
      success: function (res) {
        if (res.confirm) {
          // 完成支付将订单状态变为-1已取消并保存，
          var order = that.data.order;
          order.set('status', -1);
          order.save().then(function (orderSaved) {
            wx.showToast({
              title: '订单已取消',
              success: function () {
                that.setData({
                  order: orderSaved
                });
              }
            });
          })
        }
      }
    });
  },
	callReceiver: function (e) {//呼叫收件人（买家）
		var telephone = e.currentTarget.dataset.telephone;
		wx.makePhoneCall({
			phoneNumber: telephone //仅为示例，并非真实的电话号码
		})
	},
	send: function () {//派送订单
		// 同取消订单
		wx.showModal({
			title: '确定要派送订单吗？',
			success: function (res) {
				if (res.confirm) {
					// 
					var order = that.data.order;
					order.set('status', 2);
					order.save().then(function (orderSaved) {
						wx.showToast({
							title: '订单已派送',
							success: function () {
								that.setData({
									order: orderSaved
								});
							}
						});
					})
				}
			}
		});
	},
  com: function () {//完成订单同上
    // 完成订单
    wx.showModal({
      title: '确定完成订单吗？',
      success: function (res) {
        if (res.confirm) {
          // 完成订单
          var order = that.data.order;
          order.set('status', 3);
          order.save().then(function (orderSaved) {
            wx.showToast({
              title: '订单已完成',
              success: function () {
                that.setData({
                  order: orderSaved
                });
              }
            });
          })
        }
      }
    });
  }
})