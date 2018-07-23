

var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/utils.js');
var that;
Page({
	onLoad: function () {
		that = this;
		// 管理员认证
		getApp().auth();
		// 加载店铺设置
		that.loadSetting();
	},
	loadSetting: function () {
		// 加载店铺设置
		var query = new Bmob.Query('Seller');
		query.find().then(function (sellerObjects) {
			that.setData({
				seller: sellerObjects[0]
			})
		});
	},
  
	updateSetting: function (e) {
		var seller = that.data.seller;
		var form = e.detail.value;

      //^匹配输入字符串开始的位置 $结束
      if (form.name.length == 0) {
        wx.showModal({
          title: '店名不能为空',
          showCancel: false
        });
      }
      else if (!(/^1[34578]\d{9}$/.test(form.telephone))) {
        wx.showModal({
          title: '请填写正确手机号码',
          showCancel: false
        });
      }
      else if (form.address.length==0){
        wx.showModal({
          title: '地址不能为空',
          showCancel: false
        });
      }
      else if (!(/^[0-9]+[.][0-9]{1,2}$/.test(form.express_fee)) && !(/^[0-9]+$/.test(form.express_fee))) {
        wx.showModal({
          title: '配送费输入格式有误',
          showCancel: false
        });
      }
      else if (!(/^[0-9]+[.][0-9]{1,2}$/.test(form.min_amount)) && !(/^[0-9]+$/.test(form.min_amount))) {
        wx.showModal({
          title: '起送金额输入格式有误',
          showCancel: false
        });
      }
      else
      {
			wx.showModal({
				title: '修改成功',
				showCancel: false,
				success: function () {

          // 格式化数据
          form.min_amount = parseFloat(form.min_amount);
          form.express_fee = parseFloat(form.express_fee);
          // 保存表单信息，除营业时间外
          seller.set('name',form.name);
          seller.set('telephone', form.telephone);
          seller.set('address', form.address);
          seller.set('express_fee',form.express_fee);
          seller.set('min_amount',form.min_amount);
          seller.save();
					wx.navigateBack();
				}
			});
      }

		}, 

	


	bindTimeChanged: function (e) {
		// 修改营业时间，起始时间共用
		var seller = that.data.seller;
		// 起或始
		var field = e.currentTarget.dataset.field;
		// 保存
		seller.set(field, e.detail.value);
		console.log(e.detail.value)
		seller.save().then(function () {
			console.log('save time success');
			// 渲染
			that.setData({
				seller: seller
			});
		}, function () {
			console.log('save time fail');
		});
	},
	chooseImage: function () {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				var name = utils.random_filename(tempFilePaths[0]);//上传的图片的别名，建议可以用日期命名
				console.log(name);
				var file = new Bmob.File(name, [tempFilePaths[0]]);
				file.save().then(function(logo){
					console.log(logo)
					var seller = that.data.seller;
					// 更新logo存值
					seller.set('logo', logo);
					// 页面存值，wxml渲染
					that.setData({
						new_logo: logo.url()
					});
					// 上传到网络
					seller.save().then(function (res) {
						console.log(res)
					}, function (res) {
						console.log(res)
					});
				},function(error){
					console.log(error);
				})
			}
		})
	}
})