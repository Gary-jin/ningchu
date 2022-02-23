<template>
	<view>
		<!-- 检测更新 -->
		<u-modal v-model="bountyshow" @confirm="bountyConfirm" :showCancelButton="false" show-cancel-button :title="title" :content="content"></u-modal>
	</view>
</template>

<script>
/**
 * 自定义底部导航
 * @property {Array} tabbarList - vuex初始化的底部导航数据
 * @property {String} currentPath -computed解析当前页面路径。
 */
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	name: 'shoproModal',
	components: {},
	data() {
		return {
			bountyshow: false,
			title:'福利奖',
			content:'',
		};
	},
	computed: {
		...mapGetters(['userInfo']),
	},
	mounted() {
		if(this.userInfo.welfare_notice == 0){
			this.bountyshow = true
			this.content = this.userInfo.welfare_notice_content
		}
	},
	methods: {
		...mapActions(['getUserInfo']),
		bountyConfirm(){
			let that = this;
			that.$http('api.welfareNotice', {}).then(res => {
				if (res.code === 1) {
					that.getUserInfo()
				}
			});
		},
	}
};
</script>

<style lang="scss">
	
</style>
