<template>
	<view class="padding20">
		<u-index-list :scrollTop="scrollTop">
			<view v-for="(item, index) in indexList" :key="index">
				<u-index-anchor :index="item" />
				<!-- 好友列表 -->
				<block v-for="(itemU, indexU) in userList" :key="indexU" v-if="itemU.group==item">
					<view class="list-cell flex ai-ce" @click="clickUser(itemU.token)">
						<view class="avatar">
							<u-avatar :src="itemU.avatar" mode="circle"></u-avatar>
						</view>
						<view class="username">{{ itemU.username }}</view>
						<view class="username-label">{{ itemU.label }}</view>
					</view>
				</block>
			</view>
		</u-index-list>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scrollTop: 0,
			indexList: [], // A B C 索引列表
			userList: [], // 好友列表
		};
	},
	methods: {
		/**
		 * 滚动 
		 * */
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		/**
		 * 获取好友列表
		 * */
		getUserList() {
			let data = [
				{
					group: 'A',
					token: 'aaaa',
					username: '用户1',
					avatar: '/static/logo.png',
					label: '标签'
				},
				{
					group: 'A',
					token: 'aaaa',
					username: '用户1',
					avatar: '/static/logo.png',
					label: '标签'
				},
				{
					group: 'B',
					token: 'aaaa',
					username: '用户1',
					avatar: '/static/logo.png',
					label: '标签'
				},
				{
					group: 'E',
					token: 'aaaa',
					username: '用户1',
					avatar: '/static/logo.png',
					label: '标签'
				}
			]
			
			for(let i=0; i<data.length; i++) {
				this.indexList.push(data[i].group)
			}
			this.indexList = Array.from(new Set(this.indexList)) // 索引列表
			this.userList = data
		},
		/**
		 * 点击好友
		 * */
		clickUser(token) {
			console.log(666)
		}
	},
	onLoad() {
		this.getUserList(); // 获取用户
	}
};
</script>

<style lang="scss" scoped>
.list-cell {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 10px 24rpx;
	overflow: hidden;
	color: #323233;
	font-size: 14px;
	line-height: 24px;
	background-color: var(--whiteBack);
	border-bottom: 1px solid var(--bgGray);
}

.username{ color: var(--whiteBg); margin-right: 30rpx; margin-left: 10rpx; }
.username-label{ color: var(--grayColorNine); }
</style>
