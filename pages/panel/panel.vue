<template>
	<view class="msg-content">
		<!-- 消息 -->
		<view class="main-content padding20">
			<scroll-view scroll-y class="scollview" :scroll-top="scrollTop" :scroll-with-animation="true" :style="{ height: style.contentHeight + 'px' }">
				<view v-for="(item, index) in msgList" :key="index">
					<view class="msg-per list-left flex" v-if="item.from_id != user.user_id">
						<view class="user-avatar"><u-avatar :src="item.avatar" mode="circle" size="60"></u-avatar></view>
						<view class="user-msg">{{ item.data }}</view>
					</view>

					<view class="msg-per list-right flex" v-else>
						<view class="user-msg1">{{ item.data }}</view>
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
import utils from '../../utils/index.js'
export default {
	data() {
		return {
			to_id: null, // 对方用户token
			to_name: null, // 对方用户昵称
			to_avatar: null, // 对方头像
			input: null, // 输入框消息

			// 高度
			scrollTop: 0,
			style: {
				contentHeight: 0,
				itemH: 0
			},
			msgList: [], // 消息列表
			user: {}, // 当前用户的信息
			index: null, // 消息列表下标
		};
	},
	methods: {
		/**
		 * 获取用户聊天信息
		 * @param {string} token
		 * */
		getUserMsg() {
			uni.setNavigationBarTitle({
				title: '和' + this.to_name + '聊天中...'
			});
			let data = [];
			this.msgList = data;
		},
		/**
		 * 发送消息
		 * */
		sendMsg() {
			if (!this.input) {
				return uni.showToast({ title: '啥也没有写呢~', icon: 'none' });
			}
			let data = {
				from_id: this.user.user_id,
				from_name: this.user.username,
				from_avatar: this.user.headimgurl,
				to_id: this.to_id,
				to_name: this.to_name,
				to_avatar: this.to_avatar,
				data: this.input,
				time: utils.getDateTime(),
				type: 'userClientChat',
				msgType: 'text',
				code: 200,
				msg: 'ok',
				noReadNum: 0,
			};
			
			this.input = null;
			this.msgList.push(data)
			this.scrollTotopFunc(); // 滚动
			let message = this.$socket._formate(data)
			// this.pushMsgLists(data)
			this.$socket.send(message)
			this.$socket.handleMessage(data)
		},
		/**
		 * 新消息加入本地列表
		 * */
		pushMsgLists(data) {
			let list = uni.getStorageSync('msgLists') ? uni.getStorageSync('msgLists') : [];
			let info = {
				from_id: data.from_id,
				from_name: data.from_name,
				from_avatar: data.from_avatar,
				to_id: data.to_id,
				to_name: data.to_name,
				to_avatar: data.to_avatar,
				data: [data],
				noReadNum: 1,
			}
			if(list.length == 0) {
				list.push(info)
			} else {
				list[this.index].data.push(data)
				list.unshift(list.splice(list.length-1, 1)[0])
			}
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
					result[1].forEach(ret => {
						this.style.itemH += ret.height;
					});
					if (this.style.itemH >= this.style.contentHeight) {
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
			} catch (e) {}
		}
	},
	onLoad(option) {
		const item = JSON.parse(decodeURIComponent(option.param)); //用户 token
		this.index = item.index
		this.to_id = item.to_id;
		this.to_name = item.to_name;
		this.to_avatar = item.to_avatar
		this.getUserMsg(); // 获取用户聊天信息
		this.initData(); // 初始化高度
		// console.log(item)
		var _this = this;
		// 消息
		this.$nextTick(() => {
			let list = uni.getStorageSync('msgLists')
			if(this.index != null) {
				_this.msgList = list[this.index].data // 点击消息列表进来的
				list[this.index].noReadNum = 0
				uni.setStorageSync('msgLists', list)
				uni.$emit('storage', 1);
			} else {
				// 点击好友列表进来的，用from_id和to_id来判断聊天对象并获取聊天内容
				for(let i=0; i<list.length; i++) {
					console.log(list[i])
					if(list[i].from_id == _this.user.user_id && list[i].to_id == this.to_id) {
						_this.msgList = list[i].data
						list[i].noReadNum = 0
						uni.setStorageSync('msgLists', list)
						uni.$emit('storage', 1);
					}
				}
			}
			this.scrollTotopFunc() // 滚动到最底部
		})
		uni.$on('storage', (data) => {
			// console.log('进入这里2')
			let list = uni.getStorageSync('msgLists')
			for(let i=0; i<list.length; i++) {
				if(list[i].to_id == _this.user.user_id) {
					_this.msgList = list[i].data
				}
			}
		})
	},
	mounted() {
		this.scrollTotopFunc(); // 滚动到底部
	},
	created() {
		// 回车发送
		let _this = this;
		document.onkeypress = event => {
			let keycode = document.all ? event.keyCode : event.which;
			if (keycode == 13) {
				_this.sendMsg();
				return false;
			}
		};
		// this.user = this.$sotre.store.state.userinfo
		this.user = uni.getStorageSync('user_info')
	}
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
.list-right {
	justify-content: flex-end;
}
.user-avatar1 {
	margin-left: 28rpx;
}
.user-msg1 {
	border-radius: $uni-border-radius-lg;
	background-color: var(--bgGray);
	padding: 20upx;
	line-height: 40rpx;
	position: relative;
	width: 80%;
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
