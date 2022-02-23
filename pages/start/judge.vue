<template>
	<view class="content">
		<view class="" @click="showLogo">
			<image class="judeImg" :src="appcfgdata.startup_diagram" mode="scaleToFill"></image>
		</view>                                                                                  
		<button class="cu-btn round time" @click="checkGuide">跳过&nbsp;{{countTime}}</button>
		<!-- 登录提示 -->
		<shopro-auth-modal v-if="authType"></shopro-auth-modal>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex';
	export default {
		data(){
			return{
				countTime: 5,
				wdclockTime: null,
				Timecount: null,
				tabPathList:['/pages/index/index','/pages/index/category','/pages/index/cart','/pages/index/user']
			}
		},
		computed:{
			...mapState({
				appcfgdata: ({ shopro }) => shopro?.appcfgdata.shopro,
				authType: ({ user }) => user.authType,
				isLogin: ({ user }) => user.isLogin,
				userInfo: ({ user }) => user.userInfo
			}),
		},
		mounted(){
			if (!this.isLogin) {
				this.$store.dispatch('showAuthModal');
			}
			
			this.Timecount =  setInterval(()=>{
				if(this.isLogin){
					this.count()
					clearInterval(this.Timecount)
				}
			},1000);
			this.getUserInfo()
		},
		methods: {
			...mapActions(['getUserInfo']),
			count(){
				this.wdclockTime =  setInterval(()=>{
					this.countTime -= 1  ;
					if (this.countTime<=0) {
						this.checkGuide();
					}
				},1000);
			},
			showLogo(){
				if (!this.isLogin) {
					this.$store.dispatch('showAuthModal');
					return
				}
			},
			checkGuide() {
				if (!this.isLogin) {
					this.$store.dispatch('showAuthModal');
					return
				}
				if(this.countTime==5){
					return
				}
				clearInterval(this.wdclockTime)
				try {
					// uni.removeStorageSync('launchFlag')
					var launchFlag = uni.getStorageSync('launchFlag');
					if (launchFlag) { //判断本地缓存跳转首页
						// if(this.userInfo.register_level == 0){
						// 	uni.redirectTo({
						// 		url: this.userInfo.register_goods
						// 	});
						// } else{
						// }
						this.$Router.pushTab('/pages/index/index')
						
						
					} else { //没有缓存进入启动页引导页
						uni.redirectTo({
							url: '/pages/start/start'
						});
					}
				} catch (e) {
					console.log(e.message);
				}
			},
			goPath(path){
				if(!path){return;}
				clearInterval(this.wdclockTime)
				if(path.indexOf('http') == 0){
					//startOpportunity 为了标记返回   是否是启动页跳转
					this.jump(encodeURI(path+'?startOpportunity=true'))
				} else {
					if(path.indexOf("?") != -1){
						let str = path.split('?')
						let xx = str[0]

						let isno =  this.tabPathList.includes(xx)
						if(isno){ //主页面
							uni.redirectTo({
								url: path
							});
						} else {
							uni.redirectTo({
								url: '/pages/index/index'
							});
							setTimeout(()=>{
								this.$tools.routerTo(path);
							},200)
						}
					} else {
						let isno =  this.tabPathList.includes(path)
						if(isno){ //主页面
							uni.redirectTo({
								url: path
							});
						} else {
							uni.redirectTo({
								url: '/pages/index/index'
							});
							setTimeout(()=>{
								this.$tools.routerTo(path);
							},200)
						}
					}
					
				}
			},
			jump(path) {
				if(path){
					this.$tools.routerTo(path);
				} 
			}
		}
	};
</script>
<style scoped lang="scss">
	page {
		min-height: 100%;
		height: 100vh;
	}
	.content{
		width: 100%;
		height: 100vh;
		overflow: hidden;
		.judeImg{
			width: 100%;
			height: 100vh;
		}
		.time{
			position: fixed;
			bottom: 60rpx;
			right: 60rpx;
			color: #999;
			border: 1px #999 solid;
			background: none;
			font-size: 28rpx;
			font-weight: bold;
		}
	}
	
</style>

