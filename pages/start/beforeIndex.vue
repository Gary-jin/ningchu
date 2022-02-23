<template>
	<view class="bodyBox">
		<u-sticky offset-top="0" :enable="true">
			<view class="tabBox" v-if="isLogin && userInfo.id != '302'">
				<view v-for="(item,index) in tabsList" :key="index">
					<view @click="tabs(item.level)">
						<view :class="tabVal==item.level?'tab1':'tab11'" >{{item.name}}</view>
						<view :class="tabVal==item.level?'tab2':'tab22'"></view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="goodsBox">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="coreBox">
					<view class="goods-item  " v-for="(leftGoods,index) in list" :key="index">
						<shopro-goods-card
							:goodstype="'agency'"
							:detail="leftGoods"
							:type="leftGoods.activity_type"
							:image="leftGoods.image"
							:title="leftGoods.title"
							:subtitle="leftGoods.subtitle"
							:price="leftGoods.price"
							:originPrice="leftGoods.original_price"
							:sales="leftGoods.sales"
							:tagTextList="leftGoods.activity_discounts_tags"
							@click="godetail(leftGoods.id)"
						></shopro-goods-card>
					</view>					
				</view>
				<!-- 空白页 -->
				<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_groupon.png'" tipText="暂无商品~"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-show="list.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<!-- <view v-if="order.need_buy == 0 && tier!=2" class="homeBox" @click="goHome">
			<image src="../../static/images/home.png" mode="widthFix"></image>
		</view> -->
		<!-- 登录提示 -->
		<shopro-auth-modal v-if="authType"></shopro-auth-modal>
	</view>
</template>
<script>
	import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
	export default {
		computed: {
			...mapState({
				order: ({ shopro }) => shopro.order,
				isLogin: ({ user }) => user.isLogin,
				userInfo: ({ user }) => user.userInfo,
				authType: ({ user }) => user.authType,
			}),
		},
		components:{},
		data() {
			return {
				tabsList: [{
					name: '初级代理',
					level:1
				}, {
					name: '一级代理',
					level:2
				},{
					name: '总代理',
					level:3
				}],
				tabVal:1,
				list:[],
				isEmpty: false,
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				Timecount: null,
				tier:'' , //页面层级
				timeout: null
			};
		},
		onLoad(option) {
			// console.log(option);
			
			this.tier = option?.tier
		},
		mounted() {
			this.init()
			this.Timecount =  setInterval(()=>{
				if(this.isLogin){
					this.init()
					clearInterval(this.Timecount)
				}
			},1000);
			
			console.log(this.userInfo);
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			...mapActions(['getUserInfo']),
			init(){
				let that = this;
				that.currentPage = 1
				that.list = []
				// //*
				// uni.getSystemInfo({
				//     success: function (res) {
				// 		if(res.platform == 'ios'){
				// 			if(that.userInfo.id == '302' || !that.isLogin){
				// 				uni.setNavigationBarTitle({
				// 					title: '欢迎来到宁初'
				// 				});							
				// 			} else{
				// 				uni.setNavigationBarTitle({
				// 					title: '购买代理套餐'
				// 				});	
				// 			}
				// 		}
				//     }
				// });
				// //*
				
				
				if (!that.isLogin) {
					that.$store.dispatch('showAuthModal');
				} else{
					that.getList()
				}
				console.log('that.userInfo.level',that.userInfo.level);
				if(that.userInfo.level !== 0) {
					if(that.isLogin){
						if(that.tier != 2){
							that.$Router.pushTab('/pages/index/index')
							that.goH()		
						}
					} else{
						that.$store.dispatch('showAuthModal');
					}
				}				
			},
			goH(){
				uni.switchTab({
				    url: '/pages/index/index'
				});
			},
			getList() {
				let that = this;
				that.loadStatus = 'loading';
				that.$http('api.agentGoods', {
					page: that.currentPage,
					level: this.tabVal
				}).then(res => {
					if (res.code === 1) {
						let list = res.data.data;
						that.list = [...that.list, ...list];
						that.isEmpty = !that.list.length;
						that.lastPage = res.data.last_page;
						that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
					}
				});
			},
			// 加载更多
			loadMore() {
				console.log('more');
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getList();
				}
			},
			checktabNext(val){
				this.tabVal = val
				this.currentPage = 1
				this.list = []
				this.getList()
			},
			tabs(x, wait = 300, immediate = false) {
				let that = this
				// 清除定时器
				if (that.timeout !== null) clearTimeout(that.timeout);
				// 立即执行，此类情况一般用不到
				if (immediate) {
					var callNow = !that.timeout;
					that.timeout = setTimeout(function() {
						that.timeout = null;
					}, wait);
					if (callNow) {that.checktabNext(x);};
				} else {
					// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
					that.timeout = setTimeout(function() {
						that.checktabNext(x);
					}, wait);
				}
			},
			goHome(){
				let that = this;
				if (!that.isLogin) {
					that.$store.dispatch('showAuthModal');
				}else{
					that.$Router.pushTab('/pages/index/index')
				}
			},
			godetail(id){
				if (!this.isLogin) {
					this.$store.dispatch('showAuthModal');
				}else{
					// level，0不是代理，1初级，2一级，3总代
					if( (this.tabVal < this.userInfo.level) || (this.tabVal == this.userInfo.level) ){
						uni.showModal({
						    title: '提示',
						    content: '您已是当前等级或大于当前等级，请不要重复购买',
							showCancel: false,
						    success: function (res) {}
						});
					}else{
						this.$Router.push({ path: '/pages/goods/detail', query: { id: id,goodstype:'agency' } })
					}
				}
			}
		}
	};
</script>
<style lang="scss">
.tabBox{
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	background: #FFFFFF;
	.tab1{
		width: 120rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #5848c4;
		text-align: center;
	}
	.tab11{
		width: 120rpx;
		font-size: 30rpx;
		color: #9DA0A5;
		text-align: center;
	}
	.tab2{
		width: 120rpx;
		height: 10rpx;
		background: #d2ccfa;
		border-radius: 5rpx;
	}
	.tab22{
		width: 120rpx;
		height: 10rpx;
	}
}
.homeBox{
	width: 100rpx;
	height: 100rpx;
	position: fixed;
	bottom: 65rpx;
	right: 65rpx;
	image{
		width: 100%;
	}
}
.goodsBox{
	margin-top: 20rpx;
	padding: 0 25rpx;
	.scroll-box{
		height: 100vh;
	}
	.coreBox{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.goods-item{
			margin-bottom: 20rpx;
		}
	}
}
</style>
