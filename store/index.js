import Vue  from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		loginStatus: false,
		userinfo: {},
		socketStatus: false,
	},
	mutations: {},
	actions: {},
})
export default {
	store
}