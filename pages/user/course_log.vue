<template>
	<view class="bodyBox">
		<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
			<view class="listBox" v-for="(item,index) in list" :key="index" >
				<view class="itemBox itembtb">
					<view class="itemTit">活动名称</view>
					<view class="itmeCore">{{item.course.name}}</view>
				</view>
				<view class="itemBox itembtb">
					<view class="itemTit">活动地点</view>
					<view class="itmeCore">{{item.course.address}}</view>
				</view>
				<view class="itemBox ">
					<view class="itemTit">签到时间</view>
					<view class="itmeCore">{{ $u.timeFormat(item.createtime, 'yyyy.mm.dd hh:MM:ss') }}</view>
				</view>
			</view>
			<!-- 空白页 -->
			<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_groupon.png'" tipText="暂无记录~"></shopro-empty>
			<!-- 更多 -->
			<u-loadmore v-show="list.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</scroll-view>
	</view>
</template>
<script>
	export default {
		computed: {

		},
		components:{
		},
		data() {
			return {
				isEmpty: false,
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				list:[]
			};
		},
		onLoad(option) {
			this.getList()
		},
		methods: {
			// 加载更多
			loadMore() {
				console.log('more');
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getList();
				}
			},
			getList() {
				let that = this;
				that.loadStatus = 'loading';
				that.$http('api.cloglogs', {
					page: that.currentPage
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
		}
	};
</script>
<style lang="scss">
.scroll-box{
	height: 100vh;
	padding: 0 30rpx;
}
.listBox{
	background: #FFFFFF;
	border-radius: 17rpx;
	box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(231, 231, 231, 0.5);
	margin-top: 20rpx;
	padding: 0  15rpx;
	.itemBox{
		padding: 15rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.itemTit{
			width: 170rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}
		.itmeCore{
			width: 490rpx;
		}
	}
	.itembtb{
		border-bottom: 1px #EEEEEE solid;
	}
}
</style>
