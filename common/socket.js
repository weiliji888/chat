class websocketUtil {
	constructor(url, time) {
		this.is_open_socket = false //避免重复连接
		this.url = url //地址
		this.data = null
		//心跳检测
		this.timeout= time //多少秒执行检测
		this.heartbeatInterval= null //检测服务器端是否还活着
		this.reconnectTimeOut= null //重连之后多久再次重连
		
		try {
			return this.connectSocketInit()
		} catch (e) {
			// console.log('catch');
			this.is_open_socket = false
			this.reconnect();
		}
	}

	// 进入这个页面的时候创建websocket连接【整个页面随时使用】
	connectSocketInit() {
		this.socketTask = uni.connectSocket({
			url: this.url,
			success:()=>{
				// console.log("正准备建立websocket中...");
				// 返回实例
				return this.socketTask
			},
		});
		this.socketTask.onOpen((res) => {
			// console.log("WebSocket连接正常！");
			clearTimeout(this.reconnectTimeOut)
			clearTimeout(this.heartbeatInterval)
			this.is_open_socket = true;
			this.start();
			// 注：只有连接正常打开中 ，才能正常收到消息
			this.socketTask.onMessage((res) => {
				let message = JSON.parse(res.data)
				switch(message.type) {
					case 'ping':
						break
					case 'userClientBindSocket':
						// 绑定 uid
						break
					case 'userClientChat':
						// 聊天
						this.handleMessage(message);
						break
					default:
						break
				}
			});
		})
		// 这里仅是事件监听【如果socket关闭了会执行】
		this.socketTask.onClose(() => {
			// console.log("已经被关闭了")
			this.is_open_socket = false;
			this.reconnect();
		})
	}
	
	//发送消息
	send(value) {
		this.socketTask.send({
			data: value,
			async success() {
				// console.log("消息发送成功");
			},
		});
	}
	//开启心跳检测
	start() {
		this.heartbeatInterval = setTimeout(()=>{
			this.data={ type: 'ping', value:"心跳检测", method:"" }
			this.send(JSON.stringify(this.data));
			// console.log(this.data)
		}, this.timeout)
	}
	//重新连接
	reconnect() {
		//停止发送心跳
		clearInterval(this.heartbeatInterval)
		//如果不是人为关闭的话，进行重连
		if(!this.is_open_socket){
			this.reconnectTimeOut = setTimeout(()=>{
				this.connectSocketInit();
			},3000)
		}
	}
	
	// 格式化消息格式
	_formate(data) {
		var data = {
			type: data.type ? data.type : 'message',
			msgType: data.msgType ? data.msgType : 'text',
			data: data.data ? data.data : '',
			code: data.code ? data.code : 200,
			msg: data.msg ? data.msg : 'ok',
			from_id: data.from_id ? data.from_id : 0,
			from_name: data.from_name ? data.from_name : '',
			from_avatar: data.from_avatar ? data.from_avatar : '',
			to_id: data.to_id ? data.to_id : 0,
			to_name: data.to_name ? data.to_name : '',
			to_avatar: data.to_avatar ? data.to_avatar : '',
		}
		return JSON.stringify(data)
	}
	
	// 处理消息列表
	handleMessage(data, isSend=false) {
		var list = uni.getStorageSync('msgLists') ? uni.getStorageSync('msgLists') : [] 
		console.log(list);return;
		var info = {
			from_id: data.from_id,
			from_name: data.from_name,
			from_avatar: data.from_avatar,
			to_id: data.to_id,
			to_name: data.to_name,
			to_avatar: data.to_avatar,
			data: [data],
			noReadNum: 1,
		}
		if(!list) {
			list.push(info)
		} else {
			let ok = false
				// 接收
			for(let i=0; i<list.length; i++) {
				// 接收
				if(list[i].from_id == data.from_id) {
					list[i].data = list[i].data.concat(data)
					list[i].noReadNum += 1
					list.unshift(list.splice(i, 1)[0])
					ok = true
					break
				}
				if(!ok) {
					list.push(info)
					list.unshift(list.splice(list.length-1, 1)[0])
				}
			}
		}
		uni.setStorageSync('msgLists', list)
		uni.$emit('storage', 1);
	}
}

module.exports = websocketUtil