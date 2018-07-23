

var Bmob = require('../../utils/bmob.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');

var that;

Page({
	data: {
	},
	onLoad: function (options) {
		that = this;
		if (options.remark) {
			that.setData({
				remark: options.remark
			});
		}
	},
  setRemark: function (e) {		// 保存备注（可为空）
		var remark = e.detail.value.remark || '';
		WxNotificationCenter.postNotificationName("remarkNotification", remark);
		wx.navigateBack();//返回
	}
})