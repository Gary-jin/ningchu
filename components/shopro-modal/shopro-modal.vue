<template>
	<view>
		<!-- 检测更新 -->
		<u-modal v-model="updateshow" @confirm="updateConfirm" show-cancel-button :content="content"></u-modal>
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
			updateshow: false,
			content:'检测到有更新版本，是否更新~',
			download_url:''
		};
	},
	computed: {
		...mapState({
			config: ({ shopro }) => shopro.shop,
		}),
	},
	mounted() {
		this.checkupdate()
	},
	methods: {
		checkupdate(){
			let that = this
			uni.getSystemInfo({
				success: function (res) {
					let pVersion = plus.runtime.version
					if(res.platform == 'android'){
						console.log(pVersion,that.config.android_version);
						if(pVersion<that.config.android_version){
							that.updateshow = true
							that.download_url = that.config.android_download_url
						}
					} else {
						if(pVersion<that.config.ios_version){
							that.updateshow = true
							that.download_url = that.config.ios_download_url
						}
					}
				}
			});
		},
		updateConfirm(){
			this.updateshow = false
			plus.runtime.openURL(this.download_url);
		},
	}
};
</script>

<style lang="scss">
	
</style>
