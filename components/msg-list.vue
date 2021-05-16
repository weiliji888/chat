<template>
	<view>
		<view class="msg-lists" v-for="(item, index) in lists" :key="index">
			<view class="flex ai-ce" 
				@click="chatWith(index, item.from_id, item.from_name, item.from_avatar)" 
				@touchmove="tapFunc(index)" 
				@touchstart="touchStart"
				@touchend="touchEnd"
			>
				<view class="msg-lists-avatar">
					<u-avatar :src="item.to_id==from_id ? item.from_avatar : item.to_avatar" mode="circle"></u-avatar>
				</view>
				<view class="msg-lists-right flex jc-sb ai-ce">
					<view class="msg-lists-right-left">
						<view class="username">{{ item.to_id==from_id ? item.from_name : item.to_name }}</view>
						<view class="user-text">{{ item.data[item.data.length-1].data }}</view>
						<view class="msg-lists-right-time">{{ item.data[item.data.length-1].time }}</view>
					</view>
				</view>
				<u-badge type="error" class="badge count-msg" :count="item.noReadNum" :offset="[10, 14]"></u-badge>
			</view>

			<!-- <view class="operation-mask flex ai-ce jc-ce" :class="[item.showDelete == true ? 'operation-mask-leftin' : 'operation-mask-rightout']">
				<view class="delete"><image src="/static/icons/delete.png" mode="widthFix" @click="deleteList(index)"></image></view>
			</view> -->
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 消息列表
		lists: {
			type: Array,
			default: function() {
				return [];
			}
		},
		// 当前用户id
		from_id: {
			type: Number,
			default: function() {
				return 0;
			}
		}
	},
	mounted() {
		// console.log(this.lists)
	},
	data() {
		return {
			// 刚触碰的时间
			startTime: 0,
			// 刚触碰的位置
			startPosition: 0,
			// 结束的位置
			endPosition: 0,
			position: null, // 左/右
			index: null // 下标
		};
	},
	methods: {
		/**
		 * 点击聊天列表
		 * @param uid
		 */
		chatWith(index, to_id, to_name, to_avatar) {
			this.index = index;
			this.$emit('pchat', { index: index, to_id: to_id, to_name: to_name, to_avatar: to_avatar });
		},

		/**
		 * 手指滑动动作
		 * */
		touchStart(event) {
			// 获取初始时间
			this.startTime = Date.now();
			// 获取初始的位置
			this.startPosition = event.changedTouches[0].clientX;
		},
		/**
		 * 手指滑动动作
		 * */
		touchEnd(event) {
			const endTime = Date.now();
			if (endTime - this.startTime > 2000) {
				// 如果手指滑动的距离超过2s 就默认不合法
				return;
			}
			// 判断其滑动的距离是否值得触发，给定一个10 的距离
			if (Math.abs(this.endPosition - this.startPosition) > 10) {
				this.endPosition = event.changedTouches[0].clientX;
				var elePosition = this.endPosition - this.startPosition > 0 ? 'right' : 'left';
			} else {
				return;
			}
			this.position = elePosition;
		},
		/**
		 * 手指滑动动作
		 * */
		tapFunc(index) {
			this.index = index;
		},
		/**
		 * 删除会话
		 * */
		deleteList(index) {
			this.$emit('deleList', { index: index });
		}
	},
	watch: {
		// 左右滑动监听
		position(o, n) {
			if(this.index != null) {
				this.$emit('touched', { index: this.index, position: this.position });
				this.position = null
				this.index = null
			}
		}
	}
};
</script>

<style scoped lang="scss">
.msg-lists-avatar {
	padding-left: 10rpx;
	position: relative;
}
.msg-lists {
	margin-top: 20rpx;
	background-color: var(--bgGray);
	padding: 10rpx;
	border-radius: 16rpx;
	position: relative;
}
.msg-lists-right {
	margin-left: 30rpx;
}
.username {
	font-weight: bold;
	font-size: 30rpx;
	color: var(--whiteBg);
}
.msg-lists-right-left {
	width: 100%;
}
.user-text {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: var(--grayColor);
}
.msg-lists-right-time {
	color: var(--grayColor2);
}
.badge {
	color: white;
}

.delete image {
	width: 80upx;
	width: 80upx;
}
.operation-mask {
	height: 100%;
	width: 160upx;
	position: absolute;
	top: 0;
	right: 0;
	background-color: var(--grayColorNine);
	z-index: 999;
}
.operation-mask-leftin {
	animation-duration: 2s;
	animation-delay: 0.2s;
	animation-timing-function: ease;
	animation-fill-mode: both;
	animation-name: fadeInRight;
}
@keyframes fadeInRight {
	0% {
		opacity: 0;
		transform: translateX(20px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}
.operation-mask-rightout {
	animation-duration: 2s;
	animation-delay: 0.2s;
	animation-timing-function: ease;
	animation-fill-mode: both;
	animation-name: fadeOutRight;
}
@keyframes fadeOutRight {
	0% {
		opacity: 1;
		transform: translateX(0);
	}
	100% {
		opacity: 0;
		transform: translateX(20px);
	}
}
</style>
