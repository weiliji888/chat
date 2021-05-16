<template>
	<view class="padding20">
		<u-index-list :scrollTop="scrollTop">
			<view v-for="(item, index) in indexList" :key="index">
				<u-index-anchor :index="item" />
				<!-- 好友列表 -->
				<block v-for="(itemU, indexU) in userList" :key="indexU" v-if="itemU.group==item">
					<view class="list-cell flex ai-ce" @click="clickUser(indexU)">
						<view class="avatar">
							<u-avatar :src="itemU.user.avatar" mode="circle"></u-avatar>
						</view>
						<view class="username">{{ itemU.user.name }}</view>
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
		async getUserList() {
			let data = [];
			let _this = this;
			let res, err = await this.$http.requests({
				url: 'friendsLists',
				methods: 'POST',
				data: {},
			}).then((res)=>{
				if(res.code == 300000) {
					for(let i=0; i<res.data.length; i++) {
						_this.indexList.push(res.data[i].group)
					}
					_this.indexList = Array.from(new Set(_this.indexList)) // 索引列表
					_this.userList = res.data
				} else {
					uni.showToast({title: res.msg, icon:'none'})
				}
			}).catch((err)=>{
				console.log(err)
			})
		},
		/**
		 * 点击好友
		 * */
		clickUser(index) {
			let data = { 
				to_id: this.userList[index].user.id,
				to_name: this.userList[index].user.name,
				to_avatar: this.userList[index].user.avatar,
			}
			uni.navigateTo({
				url: '/pages/panel/panel?param='+encodeURIComponent(JSON.stringify(data))
			})
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
