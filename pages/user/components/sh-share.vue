<template>
	<view class="content">
		<!-- 海报弹窗 -->
		<view class="cu-modal" :class="{ show: showPoster }" >
			<view class="cu-dialog" style="width: 640rpx;background: none;">
				<view class="poster-img-box"><image class="poster-img" :src="img" mode="widthFix"></image></view>
				<view class="poster-btn-box u-m-t-20 u-flex u-row-between u-col-center" v-show="img">
					<button class="cancel-btn u-reset-button" @click="cancel">取消</button>
					<button class="save-btn u-reset-button" @click="saveImg">保存图片</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import Auth from '@/shopro/permission/index.js';
export default {
	name: 'shShare',
	components: {},
	data() {
		return {
			
		};
	},
	props: {
		img: {
			type: String,
			default: ''
		},
		showPoster:{
			type: Boolean,
			default: false
		}
	},
	computed: {
		
	},
	created() {
		
	},
	methods:{
		cancel(){
			this.$emit('cancel');
		},
		saveImg(){
			let that = this
			uni.saveImageToPhotosAlbum({
			    filePath: that.img,
			    success: function () {
					that.$u.toast('下载成功!');
			        that.$emit('cancel')
			    }
			});
		}
	}
};
</script>

<style lang="scss">
// 指引
.guide-wrap {
	height: 100%;
	.guide-img {
		width: 580rpx;
		height: 430rpx;
	}
}
// 分享海报
.poster-btn-box {
	.cancel-btn {
		width: 300rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #ffffff;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #999999;
	}
	.save-btn {
		width: 300rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: linear-gradient(90deg, #e9b461, #eecc89);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
.poster-img-box {
	.poster-img {
		width: 660rpx;
		min-height: 800rpx;
		border-radius: 20rpx;
	}
}
// 分享tool
.share-box {
	background: #fff;
	width: 750rpx;
	border-radius: 30rpx 30rpx 0 0;
	padding-top: 30rpx;
	position: relative;

	.share-foot {
		font-size: 24rpx;
		color: #bfbfbf;
		height: 80rpx;
		border-top: 1rpx solid #eee;
	}

	.share-list-box {
		.share-btn {
			background: none;
			border: none;
			line-height: 1;
			padding: 0;
			&::after {
				border: none;
			}
		}
		.share-item {
			flex: 1;
			padding-bottom: 20rpx;

			.share-img {
				width: 70rpx;
				height: 70rpx;
				background: rgba(246, 246, 254, 1);
				border-radius: 50%;
				margin-bottom: 20rpx;
			}

			.share-title {
				font-size: 24rpx;
				color: #666;
			}
		}
	}
}
</style>
