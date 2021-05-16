// 请求类
const baseUrl = 'http://love-520.xyz/api/v1/'

export default {
	// 请求方法
	requests(options={}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: baseUrl + options.url,
				method: options.methods,
				data: options.data,
				header: { Authorization: uni.getStorageSync('token') },
				dataType: "json",
				success: (res) => {
					return resolve(res.data)
				},
				fail: (err) => {
					return reject(err)
				}
			})
		})
	},
	/***/
}