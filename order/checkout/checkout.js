
// checkout.js
var Bmob = require('../../utils/bmob.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');

var that;

Page({
	data: {
		personCountIndex: 0, //用餐人数组
	},
	onLoad: function (options) {//装载
		that = this;
		that.loadAddress();
		// 注册通知
        WxNotificationCenter.addNotification("addressSelectedNotification", that.getSelectedAddress, that);
        WxNotificationCenter.addNotification("remarkNotification", that.getRemark, that);
        // 购物车获取参数
        that.setData({
        	carts: JSON.parse(options.carts)
        });
        // 读取商家信息
        getApp().loadSeller(function (seller) {
        	that.setData({
        		seller: seller
        	});
        });//读取餐费，用餐数量，运费，总费用
        that.setData({
        	amount: parseFloat(options.amount),
          quantity: parseFloat(options.quantity),
          express_fee: parseFloat(options.express_fee),
          total: parseFloat(options.amount) + parseFloat(options.express_fee)
        });//初始化用餐人数
        that.initpersonCountArray();
	},
	selectAddress: function () {//跳转到地址清单选择地址
		wx.navigateTo({
			url: '../../address/list/list?isSwitchAddress=true'
		});
	},
  getSelectedAddress: function (addressId) {//根据地址id回调查询地址对象
		console.log(addressId);
		// 回调查询地址对象
		var query = new Bmob.Query("Address");
		query.get(addressId).then(function (address) {//如果查询到了将address赋值为查询的地址信息
			that.setData({
				address: address
			});
		});
	},
	loadAddress: function () {//加载地址信息
		var that = this;
		var query = new Bmob.Query('Address');//查询当前用户的地址
		query.equalTo('user', Bmob.User.current());
		query.descending('updatedAt');//按更新顺序排列
		query.limit(1);
    query.find().then(function (addressObjects) {	// 查到用户已有收货地址		
			if (addressObjects.length > 0) {//如果地址信息不为空则将地址信息赋值给address
				that.setData({
					address: addressObjects[0]
				});
			}
		});
	},
  initpersonCountArray: function () {// 初始化用餐人数		
		var personCountArray = [];
		var length = 10;
		for (var i = 1; i <= length; i++) {
			personCountArray.push(i + '人');
		}
	//	personCountArray.push(length + '人以上');
		that.setData({
			personCountArray: personCountArray
		});
	},
	getRemark: function (remark) {//获取备注
		console.log(remark)
		that.setData({
			remark: remark
		});
	},
	naviToRemark: function () {//跳转到remark对备注进行操作
		wx.navigateTo({
			url: '../remark/remark?remark=' + (that.data.remark || '')
		});	
	},
  bindPickerChange: function (e) {	// 监听用餐人数改变	
		this.setData({
			personCountIndex: e.detail.value
		})
	},
  nopayment: function () {
  wx.showModal({
    title: '请选择一个收货地址',
    showCancel: false
  })},
  payment: function () {	// 创建订单	用户，地址，运费，z还要，数量,餐费，总f诶用，订单状态，详细内容
		var order = new Bmob.Object('Order');
		order.set('user', Bmob.User.current());
		order.set('address', that.data.address);
		order.set('express_fee', that.data.express_fee);
		order.set('title', that.data.carts[0].title);
		order.set('quantity', that.data.quantity);
		order.set('amount', that.data.amount);
		order.set('total', that.data.total);
		order.set('status', 0);
		order.set('detail', that.data.carts);
   
    order.set('personCount', that.data.personCountArray[that.data.personCountIndex]);//用餐人数
    order.set('remark', that.data.remark);//用餐人数
		order.save().then(function (orderCreated) {
			// 保存成功，暂无调用支付，不成功弹出订单创建失败
      wx.navigateTo({
        url: '/order/detail/detail?objectId=' + order.id
      });
      var openId = Bmob.User.current().get('authData').weapp.openid;
		//	getApp().payment(orderCreated);
		}, function (res) {
			console.log(res)
			wx.showModal({
				title: '订单创建失败',
				showCancel: false
			})
		});

	}
})