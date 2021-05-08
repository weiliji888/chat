<template>
	<view class="main">
		<view class="user-info">
			<view class="user-info-detail flex ai-ce">
				<u-avatar src="/static/bg/x1.jpg" size="160"></u-avatar>
				<view class="user-name-sign">
					<view class="user-name">筱崎爱</view>
					<view class="user-name-sign">今天天气很好哦</view>
				</view>
			</view>
			
			<view class="user-detail-info flex ai-ce">
				<view class="user-balance-item history">
					<view class="one">12030</view>
					<view class="two">历史收益</view>
				</view>
				<view class="user-balance-item today">
					<view class="today-item">
						<view class="today-item-one">230</view>
						<view class="today-item-two">今日收益</view>
					</view>
				</view>
				<view class="user-balance-item total">
					<view class="one">1200</view>
					<view class="two">历史提现</view>
				</view>
			</view>
		</view>
		<view class="content padding20">
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="star" title="我的收藏"></u-cell-item>
					<u-cell-item icon="photo" title="我的相册"></u-cell-item>
					<u-cell-item icon="coupon" title="我的卡券"></u-cell-item>
					<u-cell-item icon="heart" title="我的关注"></u-cell-item>
					<u-cell-item icon="more-circle" title="系统消息"></u-cell-item>
					<u-cell-item icon="setting" title="系统设置"></u-cell-item>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	created() {
		console.log(this.$sotre)
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.main{ background-color: var(--bgGray); }
.user-info {
	height: 400rpx;
	position: relative;
	z-index: 888;
}
.user-info::after {
	background: url('/static/bg/xqa.jpg');
	background-repeat: no-repeat;
	height: 400rpx;
	background-size: 100%;
	opacity: 0.5;
	content: '';
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	position: absolute;
	z-index: -1;
}
.user-info-detail {
	padding: 30rpx;
}
.user-name {
	color: var(--whiteBg);
	font-weight: bold;
	font-size: 40rpx;
}
.user-name-sign, .user-name{
	margin-left: 20rpx;
}
.user-name-sign{ color: var(--grayColor2); }

.user-detail-info{
	position: absolute; bottom: -160rpx; left: 5%; right: 5%; z-index: 999;
	background-color: var(--whiteBack);
	height: 300rpx; width: 90%;
	border-radius: 10rpx; opacity: 0.7;
}

.content{
	margin-top: 150rpx;
}
.user-balance-item{
	width: 33.3%; text-align: center;font-size: 34rpx;
}
.today-item{ 
	border: 10rpx solid var(--redBg);
	border-radius: 100%;
	height: 240rpx; width: 240rpx; padding: 48rpx 0;
 }
.one{ color: var(--grayColor2); font-size: 40rpx; }
.two{ color: var(--grayColor); font-size: 30rpx; }
.today{ font-size: 48rpx; }

.today-item-one{ color: var(--whiteBg); }
.today-item-two{ font-size: 40rpx; }
</style>
