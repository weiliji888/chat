<template>
	<view class="padding20">
		<view class="search">
			<u-search placeholder="请输入搜索内容" v-model="keyword"></u-search>
		</view>
		
		<!-- 消息列表 -->
		<msgLists :lists="lists" v-on:pchat="chat" v-on:touched="touched" v-on:deleList="deleList"></msgLists>
	</view>
</template>

<script>
import msgLists from '../../components/msg-list.vue'
export default {
	components: {
		msgLists
	},
	data() {
		return {
			keyword: '', // 搜索内容
			// 消息列表
			lists: [
				{
					token: 'dfdf3e34242',
					avatar: '/static/logo.png', 
					username: '老王', 
					newestMsg: '发的辅导辅导费大幅度风动旛动放大幅度风动旛动', 
					time: '2021-01-01',
					count: 1,
					showDelete: false,
				},
				{
					token: 'dfdf23234242',
					avatar: '/static/logo.png', 
					username: 'A酱', 
					newestMsg: 'sdsd都奉顺颠三倒四多颠三倒四多所', 
					time: '2021-01-02',
					count: 12,
					showDelete: false,
				},
			],
		};
	},
	methods: {
		/**
		 * 点击消息列表
		 * @param {number} uid  
		 */
		chat(data) {
			this.lists[data.index].count = 0 // 清零未读消息提示
			this.lists.unshift(this.lists.splice(data.index, 1)[0]) // 点击后置顶
			uni.navigateTo({
				url: '/pages/panel/panel?param='+encodeURIComponent(JSON.stringify(data))
			})
		},
		/**
		 * 手指滑动事件
		 * */
		touched(data) {
			if(data.position == 'left') {
				// 左滑
				this.lists[data.index].showDelete = true;
			} else if(data.position == 'right') {
				// 右滑
				this.lists[data.index].showDelete = false;
			}
		},
		/**
		 * 删除会话
		 * */
		deleList(data) {
			this.lists.splice(data.index, 1)
		}
	},
	onLoad() {
		this.$http.loginCheck(); // 登录验证
	}
};
</script>

<style scoped lang="scss">
</style>
