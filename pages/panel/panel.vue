<template>
	<view class="msg-content">
		<!-- 消息 -->
		<view class="main-content padding20">
			<scroll-view scroll-y class="scollview" :scroll-top="scrollTop" :scroll-with-animation="true" :style="{ height: style.contentHeight + 'px' }">
				<view v-for="(item, index) in msgList" :key="index">
					<view class="msg-per list-left flex" v-if="item.from_token != userinfo.token">
						<view class="user-avatar"><u-avatar :src="item.avatar" mode="circle" size="60"></u-avatar></view>
						<view class="user-msg">{{ item.message }}</view>
					</view>

					<view class="msg-per list-right flex" v-else>
						<view class="user-msg1">{{ item.message }}</view>
						<view class="user-avatar1"><u-avatar :src="item.avatar" mode="circle" size="60"></u-avatar></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 消息 -->

		<!-- 底部 -->
		<view class="send-area">
			<view class="flex jc-sb ai-ce">
				<input type="text" v-model="input" class="input-msg" />
				<u-button type="success" size="mini" shape="circle" class="send" :ripple="true" @click="sendMsg">发送</u-button>
			</view>
			<view class="send-img flex ai-ce">
				<view class="send-img-box"><image class="send-img-icon" src="/static/icons/tp.png" mode="widthFix" @click="chooseImg"></image></view>
				<view class="send-img-box"><image class="send-img-icon" src="/static/icons/yy.png" mode="widthFix"></image></view>
				<view class="send-img-box"><image class="send-img-icon" src="/static/icons/pz.png" mode="widthFix"></image></view>
				<view class="send-img-box"><image class="send-img-icon" src="/static/icons/add.png" mode="widthFix"></image></view>
			</view>
		</view>
		<!-- 底部 -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			token: null, // 用户token
			username: null, // 用户昵称
			input: null ,// 输入框消息
			
			// 高度
			scrollTop: 0,
			style:{
				contentHeight: 0,
				itemH: 0
			},
			msgList: [], // 消息列表
			userinfo: uni.getStorageSync('userinfo'), // 当前用户的信息
		};
	},
	methods: {
		/**
		 * 获取用户聊天信息
		 * @param {string} token
		 * */
		getUserMsg() {
			uni.setNavigationBarTitle({
				title: '和' + this.username + '聊天中...'
			});
			let data = [
				{
					from_token: this.userinfo.token,
					from_name: 'a',
					to_token: 'bbbb',
					to_name: 'b',
					avatar: '/static/logo.png',
					message: 'hi~，发的辅导辅导费的辅导辅导费的辅导辅导发的，辅导辅导费的发的发，大幅度发的，辅导辅导发，的辅导费，地方发的， 地方，地方，大幅度，发的，发',
					time: '2021-04-03',
				},
				{
					from_token: 'bbbb',
					from_name: 'b',
					to_token: 'aaaa',
					to_name: 'a',
					avatar: '/static/logo.png',
					message: 'hello, what can I help you?',
					time: '2021-04-03',
				},
				{
					from_token: this.userinfo.token,
					from_name: 'a',
					to_token: 'bbbb',
					to_name: 'b',
					avatar: '/static/logo.png',
					message: 'I want a pie. fdlfdlfdlfdlfdlfdlf发的理发店理发店理发反对浪费代码理发店反对浪费代码了发电量方面的浪费 辅导费没了发的辅导辅导费的辅导辅导',
					time: '2021-04-03',
				},
				{
					from_token: 'bbbb',
					from_name: 'b',
					to_token: 'aaaa',
					to_name: 'a',
					avatar: '/static/logo.png',
					message: 'okay, please wait a second.',
					time: '2021-04-03',
				},
			]
			this.msgList = data;
		},
		/**
		 * 发送消息
		 * */
		sendMsg() {
			if(!this.input) {
				return uni.showToast({ title: "啥也没有写呢~", icon: 'none' });
			}
			let data = {
				from_token: this.userinfo.token,
				from_name: 'a',
				to_token: 'bbbb',
				to_name: 'b',
				avatar: '/static/logo.png',
				message: this.input,
				time: '2021-04-03',
			}
			this.input = null;
			this.msgList.push(data)
			this.scrollTotopFunc() // 滚动
		},
		/**
		 * 选择图片
		 * */
		chooseImg() {
			uni.chooseImage({
				count: 9, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function(res) {
					console.log(JSON.stringify(res.tempFilePaths));
				}
			});
		},
		/**
		 * 滚动到底部
		 * */
		scrollTotopFunc() {
			let allHeight = 0;
			this.$nextTick(() => {
				let q = uni.createSelectorQuery();
				q.select('.scollview').boundingClientRect();
				q.selectAll('.msg-per').boundingClientRect();
				q.exec(result => {
					result[1].forEach((ret)=>{
						this.style.itemH += ret.height;
					});
					if(this.style.itemH >= this.style.contentHeight) {
						this.scrollTop = this.style.itemH;
					}
				});
			});
		},
		/**
		 * 初始化高度
		 * */
		initData() {
			// 初始化参数
			try {
				const res = uni.getSystemInfoSync();
				this.style.contentHeight = res.windowHeight - uni.upx2px(210);
			}catch(e){ }
		},
	},
	onLoad(option) {
		const item = JSON.parse(decodeURIComponent(option.param)); //用户 token
		this.token = item.uid;
		this.username = item.username;
		this.getUserMsg(); // 获取用户聊天信息
		this.initData(); // 初始化高度
	},
	mounted() {
		this.scrollTotopFunc(); // 滚动到底部
	},
	created() {
	    // 回车发送
	    let _this = this
	    document.onkeypress = (event)=> {
	      let keycode = document.all ? event.keyCode : event.which
	      if(keycode == 13) {
	        _this.sendMsg()
	        return false
	      }
	    }
	},
};
</script>

<style scoped lang="scss">
.send-area {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 20upx 0 10upx 20upx;
	background-color: var(--bgGray);
}
.input-msg {
	background-color: var(--whiteBack);
	border: 1upx solid var(--bgGray);
	border-radius: 20upx;
	width: 80%;
	padding: 10upx 10upx 10upx 20upx;
}
.send-img {
	text-align: center;
	margin-top: 20upx;
}
.send-img-icon {
	width: 50upx;
	height: 50upx;
}
.send-img-box {
	width: 25%;
}

.main-content {
	height: calc(100vh - env(safe-area-inset-top) - 82px);
	padding-bottom: 90upx;
}
.user-avatar {
	margin-right: 28rpx;
}
.user-msg {
	border-radius: $uni-border-radius-lg;
	background-color: var(--bgGray);
	padding: 20upx;
	line-height: 40rpx;
	position: relative;
	width: 80%;
}
.user-msg::before {
	position: absolute;
	content: '';
	width: 0;
	height: 0;
	right: 100%;
	top: 16upx;
	border-top: 20upx solid transparent;
	border-right: 20upx solid var(--bgGray);
	border-bottom: 20upx solid transparent;
}
.list-left,
.list-right {
	margin-bottom: 30upx;
}
.list-right{ justify-content: flex-end; }
.user-avatar1 {
	margin-left: 28rpx;
}
.user-msg1 {
	border-radius: $uni-border-radius-lg;
	background-color: var(--bgGray);
	padding: 20upx;
	line-height: 40rpx;
	position: relative; width: 80%;
}
.user-msg1:before {
	position: absolute;
	content: '';
	width: 0;
	height: 0;
	left: 100%;
	top: 16upx;
	border-top: 20upx solid transparent;
	border-left: 20upx solid var(--bgGray);
	border-bottom: 20upx solid transparent;
}
.msg-content {
	height: auto;
}
</style>
