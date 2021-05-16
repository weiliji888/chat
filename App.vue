<script>
export default {
	onLaunch: function() {
		// 如果已存在用户信息则自动登录
		// if(this.$sotre.store.state.loginStatus) {
		// 	uni.switchTab({url: '/pages/goods/goods'})
		// } else {
		// 	uni.navigateTo({ url: '/pages/index/index' })
		// }
	},
	onShow: function() {
		// console.log('App Show');
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/common.css';
	@import "./uview-ui/index.scss";
	
	/*#ifndef MP*/
	/*#endif*/
</style>
