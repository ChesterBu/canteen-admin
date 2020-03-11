module.exports = (app) => {
	app.get('/api/user/logout', (req, res) => {
		res.json({
			errorCode: 1,
			errorMsg: '',
			data: null,
			ret: true,
		});
	});
	app.post('/api/user/login', (req, res) => {
		res.json({
			errorCode: 1,
			errorMsg: '',
			data: { 
				role: 1,   // 1-4 食堂，供应商，财务部，管理员
			},
			ret: true,
		})
	});
	app.get('/dining/info', (req, res) => {
		res.json({
			errorCode: 1,
			errorMsg: '',
			ret: true,
			data: {
				"accommodate":21,
				"address":"餐饮中心二楼201",
				"area":20.1,
				"createTime":1583762215423,
				"diningName":"沙县小吃",
				"goodDtos":[{
					"goodName":"土豆",
					"goodNo":"tx20001",
					"stock":1,
					"unit":"克",
				},{
					"goodName":"白菜",
					"goodNo":"tx20002",
					"stock":1,
					"unit":"箱",
				},{
					"goodName":"苏格兰猪肉",
					"goodNo":"tx20003",
					"stock":1,"unit":"千克",
				},{
					"goodName":"奥尔良鸭肉",
					"goodNo":"tx20004",
					"stock":1,
					"unit":"吨",
				}],
				"orderRoughDto":{
					"finishOrder":5,
					"refuseOrder":2,
					"waitApproveOrder":1,
					"waitReceiveOrder":4,
					"waitSendOrder":3,
				},
				"workerNum":200,
			},
		});
	});
}