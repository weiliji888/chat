export default {
	// 获取 yyyy-mm-dd HH:ii:ss
	getDateTime() {
		const date  = new Date()
		const year  = date.getFullYear()
		const month = date.getMonth()<10 ? '0'+date.getMonth() : date.getMonth()
		const day   = date.getDay()<10 ? '0'+date.getDay() : date.getDay()
		const hour  = date.getHours()<10 ? '0'+date.getHours() : date.getHours()
		const minu  = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes()
		const sec   = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds()
		return year + '-' + month +'-'+ day +' '+ hour +':'+ minu +':'+ sec 
	}
}