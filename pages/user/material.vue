<template>
	<view class="bodyBox">
		<view class="navBox" :style="[style]">
			<view class="nav">
				<view class="u-iconfont uicon-arrow-left" @click="goBack" :style="{ color: '#606266', fontSize:  '44rpx' }"></view>
				<view class="search">
					<u-search placeholder="请输入关键词" :showAction="false" v-model="keyword"></u-search>
				</view>
				<view class="dayBox" @click="xuan">{{day}}</view>
				<button class="u-reset-button withdraw-btn" @click="search(keyword,day)">搜索</button>
			</view>
		</view>
		<view class="stickyBox">
			<u-sticky offset-top="0" :enable="true">
				<view class="tabs" :style="{ paddingTop: Hstast+'rpx'}">
					<view class="tabBox">
						<view v-for="(item,index) in tabsList" :key="index">
							<view @click="tabs(index)">
								<view :class="tabVal==index?'tab1':'tab11'" >{{item.name}}</view>
								<view :class="tabVal==index?'tab2':'tab22'"></view>
							</view>
						</view>
					</view>
				</view>
			</u-sticky>
		</view>
		<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
			<view class="coreBox">
				<view class="core" v-for="(item,index) in imgList" :key="index">
					<view class="titBox">
						<view class="titL" v-if="tabVal == 0 && item.images_num!=0">
							<view class="tit">{{ $u.timeFormat(item.createtime, ' yyyy.mm.dd') }}</view>
							<view class="tit1">{{item.title}}</view>
						</view>
						<view class="titL" v-if="tabVal == 1 && item.bg_images_num!=0">
							<view class="tit">{{ $u.timeFormat(item.createtime, ' yyyy.mm.dd') }}</view>
							<view class="tit1">{{item.title}}</view>
						</view>
						<view class="titR" v-if="tabVal == 0 && item.images_num!=0" @click="dayAll(item)">
							<image :src="item.all?'../../static/images/x.png':'../../static/images/nx.png'" mode="widthFix"></image>
						</view>
					</view>
					<view class="imgBox" v-if="tabVal == 0">
						<view class="imgC"  v-if="img.type == 1" v-for="(img,idx) in item.group" :key="idx">
							<!-- <image class="img" @click="preImg(item.group,idx,1)" :src="img.img" mode="aspectFill"></image> -->
							<u-lazy-load class="img" @click="preImg(item.group,idx,1)" :image="img.img" img-mode="widthFix"></u-lazy-load>
							<image @click="itemImg(item,index,idx)" class="img1" :src="img.disabled?'../../static/images/x.png':'../../static/images/nnx.png'" mode="widthFix"></image>
						</view>
					</view>
					<view class="imgBox" v-if="tabVal == 1">
						<view class="imgC"  v-if="img.type == 2" v-for="(img,idx) in item.group" :key="idx">
							<!-- <image class="img" @click="preImg(item.group,idx,2)" :src="img.img" mode="aspectFill"></image> -->
							<u-lazy-load class="img"  @click="itemImg2(img)" :image="img.img" img-mode="widthFix"></u-lazy-load>
							<image class="img1" :src="img.disabled?'../../static/images/x.png':'../../static/images/nnx.png'" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 空白页 -->
			<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_groupon.png'" tipText="暂无图片~"></shopro-empty>
			<!-- 更多 -->
			<u-loadmore v-show="imgList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</scroll-view>
		<!-- footer -->
		<view class="footer">
			<view class="footer1" v-if="tabVal == 0">
				<view class="all" @click="allImg">
					<image :src="all?'../../static/images/all.png':'../../static/images/nall.png'" mode="widthFix"></image>
					全选
				</view>
				<button class="u-reset-button withdraw-btn" @click="downloadIMG()">下载</button>
			</view>
			<view class="footer1" v-if="tabVal == 1">
				<view class="yl">请选择图片预览下载海报</view>
				<button class="u-reset-button withdraw-btn" @click="seeposter()">预览</button>
			</view>
		</view>
		<!-- 时间 -->
		<template>
			<u-calendar v-model="timeShow" mode="date" @change="change"></u-calendar>
		</template>
		<!-- 各海报模块 -->
		<shopro-canvas v-if="showPoster" ref="shoproCanvas" :canvasParams="canvasParams" @success="onSuccess"></shopro-canvas>
		<sh-share @cancel="cancel" :img="posterImage" :showPoster="showPoster"></sh-share>
	</view>
</template>
<script>
	import shShare from './components/sh-share.vue';
	import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
	export default {
		computed: {
			style() {
				let x = uni.getSystemInfoSync();
				let statusBarHeight = x.statusBarHeight;
				let style = {};
				style.paddingTop = `${statusBarHeight}px`;
				return style;
			},
			Hstast() {
				let x = uni.getSystemInfoSync();
				let statusBarHeight = x.statusBarHeight;
				return statusBarHeight;
			},
			...mapGetters(['initShare', 'userInfo', 'isLogin', 'shareInfo']),
		},
		components:{
			shShare
		},
		data() {
			return {
				pt:"",
				keyword:'',
				timeShow: false,
				day:'',
				all: false,
				showPoster: false, //海报弹窗
				canvasParams:{},
				posterImage: '',
				tabsList: [{
					name: '普通',
				}, {
					name: '二维码',
				}],
				tabVal:0,
				imgList:[],
				isEmpty: false,
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				dowList: [],
				seeImg:'',
				
				default: true
			};
		},
		onLoad(option) {
			this.dayinit()
			this.getList()
		},
		methods: {
			search(keyword,day){
				let that = this;
				that.default = false
				that.imgList = []
				that.getList()
			},
			tabs(val){
				this.tabVal = val
			},
			// 全选
			allImg(){
				let that = this
				if(that.all){
					that.imgList.forEach((itm,idx)=>{
						that.$set(itm, 'all', false);
						itm.group.forEach((item,index)=>{
							if(item.type ==1){
								that.$set(item, 'disabled', false);
							}
						})
					})
				} else {
					that.imgList.forEach((itm,idx)=>{
						that.$set(itm, 'all', true);
						itm.group.forEach((item,index)=>{
							if(item.type ==1){
								that.$set(item, 'disabled', true);
							}
						})
					})
				}
				
				that.all = !that.all
			},
			dayAll(item){
				let that = this;
				that.$set(item, 'all', !item.all);
				item.group.forEach((itm,index)=>{
					if(itm.type == 1){ //普通图片
						that.$set(itm, 'disabled', item.all);
					}
				})
				that.setAll()
			},
			itemImg(item,index,idx){
				let that = this;
				if(item.group[idx].type == 1){ //普通图片
					that.$set(item.group[idx], 'disabled', !item.group[idx].disabled);
				}
				let num = 0;
				let num2 = 0;
				item.group.forEach((item,index)=>{
					if(item.type ==1){
						num++;
					}
					if(item.disabled && item.type ==1){
						num2++;
					}
				})
				 // console.log(num,num2);
				if(num == num2){
					that.$set(item, 'all', true);
				} else{
					that.$set(item, 'all', false);
				}
				that.setAll()
			},
			itemImg2(item){
				let that = this;
				that.imgList.forEach((itm,idx)=>{
					itm.group.forEach((item,index)=>{
						if(item.type ==2){
							that.$set(item, 'disabled', false);
						}
					})
				})
				that.$set(item, 'disabled', true);
				that.seeImg = item.img
			},
			setAll(){
				let that = this;
				let num = 0;
				let num2 = 0;
				that.imgList.forEach((itm,idx)=>{
					itm.group.forEach((item,index)=>{
						if(item.type ==1){
							num++;
						}
						if(item.disabled && item.type ==1){
							num2++;
						}
					})
				})
				console.log(num,num2, num == num2);
				if(num == num2){
					that.all = true;
				} else{
					that.all = false;
				}
			},
			//下载图片
			downloadIMG(){
				let that = this;
				that.imgList.forEach((itm,idx)=>{
					itm.group.forEach((item,index)=>{
						if(item.disabled && item.type ==1){
							console.log(item);
							that.saveImg(item.img)
						}
					})
				})
			},
			preImg(list,index,type){
				let imgList = []
				list.forEach((item,index)=>{
					if(item.type == type){
						imgList.push(item.img)
					}
				})
				this.$tools.previewImage(imgList,index);
			},
			// 预览
			seeposter(){
				if(this.seeImg){
					this.canvasParams = this.getPosterFormatter();
					this.showPoster = true;
				} else {
					this.$u.toast('请选择图片');
				}
			},
			saveImg(url) {
				let that = this;
				uni.downloadFile({
				    url: url, 
				    success: (res) => {
				        if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
							    filePath: res.tempFilePath,
							    success: function () {
							        console.log('save success');
									that.$u.toast('下载成功!');
							    }
							});
				        }
				    }
				});
			},
			cancel(){
				this.showPoster = false;
			},
			
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
				let deflt = {}
				if(that.default){
					deflt = {date: ''}
				} else {
					deflt = {date: that.day}
				}
				that.$http('api.list', {
					page: that.currentPage,
					key: that.keyword,
					...deflt
				}).then(res => {
					if (res.code === 1) {
						let list = res.data.data;
						that.imgList = [...that.imgList, ...list];
						that.isEmpty = !that.imgList.length;
						that.lastPage = res.data.last_page;
						that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
					}
				});
			},
			dayinit(){
				 var day2 = new Date();
				 day2.setTime(day2.getTime());
				 this.day = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
			},
			goBack(){
				uni.navigateBack();
			},
			xuan(){
				this.timeShow = true 
			},
			change(e){
				this.day = e.result
			},
			// 绘制成功
			onSuccess(e) {
				this.posterImage = e;
			},
			// 获取海报格式,规则说明在@/shopro/poster/tools.js中的initDrawArray
			getPosterFormatter() {
				const that = this;
				let data = {};
				data = {
					backgroundImage: that.seeImg,
					drawArray: [
						// {
						// 	name: '用户昵称',
						// 	type: 'text',
						// 	text: that.userInfo.nickname,
						// 	isBgCenter: true,
						// 	size: 28,
						// 	dy: 250,
						// 	color: '#333',
						// 	textAlign: 'middle',
						// 	textBaseLine: 'middle'
						// },
						// {
						// 	name: 'avatar',
						// 	type: 'image',
						// 	url: that.userInfo.avatar,
						// 	alpha: 1,
						// 	isBgCenter: true,
						// 	dy: 95,
						// 	dWidth: 120,
						// 	dHeight: 120,
						// 	circleSet: {}
						// },
						// #ifdef MP-WEIXIN
						{
							name: 'wxCode',
							type: 'image',
							url: `${that.$API_URL}wechat/wxacode?scene=${that.shareInfo.query}`,
							alpha: 1,
							dy: 560,
							isBgCenter: true,
							dWidth: 180,
							dHeight: 180
						},
						// #endif
						// #ifndef  MP-WEIXIN
						{
							name: '普通二维码',
							type: 'qrcode',
							text: that.shareInfo.path,
							size: 180,
							dy: 560,
							isBgCenter: true
						}
						// #endif
					]
				};
				return data;
			}
		}
	};
</script>
<style lang="scss">
	page{
		background: #F6F6F6;
	}
	.bodyBox{
		.navBox{
			background: #FFFFFF;
			.nav{
				height: 88rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				.search{
					width: 350rpx;
				}
				.dayBox{
					text-align: center;
					width: 200rpx;
				}
				
			}
		}
		.stickyBox{
			.tabs{
				background: #FFFFFF;
				.tabBox{
					height: 100rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.tab1{
						width: 100rpx;
						font-size: 30rpx;
						font-weight: bold;
						color: #5848c4;
						text-align: center;
					}
					.tab11{
						width: 100rpx;
						font-size: 30rpx;
						color: #9DA0A5;
						text-align: center;
					}
					.tab2{
						width: 100rpx;
						height: 10rpx;
						background: #d2ccfa;
						border-radius: 5rpx;
					}
					.tab22{
						width: 100rpx;
						height: 10rpx;
					}
				}
			}
		}
		.scroll-box{
			height: 100vh;
			margin-bottom: 110rpx;
		}
		.coreBox{
			padding: 0 30rpx;
			.core{
				.titBox{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.titL{
						margin-top: 20rpx;
						width: 650rpx;
						.tit{
							font-size: 36rpx;
							font-weight: bold;
						}
						.tit1{
							width: 100%;
							color: #676767;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							transition: all linear 0.2s;
						}
					}
					.titR{
						width: 35rpx;
						height: 35rpx;
						image{
							width: 35rpx;
							height: 35rpx;
						}
					}
				}
				
				.imgBox{
					margin-top: 20rpx;
					display: flex;
					flex-wrap: wrap;
					.imgC{
						width: 220rpx;
						height: 220rpx;
						margin-bottom: 15rpx;
						margin-right: 15rpx;
						overflow: hidden;
						position: relative;
						&:nth-child(3n) {
							margin-right: 0;
						}
						.img{
							width: 100%;
							height: 100%;
							border-radius: 7rpx;
							position: absolute;
							top: 0;
							left: 0;
						}
						.img1{
							width: 35rpx;
							height: 35rpx;
							position: absolute;
							bottom: 20rpx;
							right: 20rpx;
						}
					}
				}
			}
		}
		.footer{
			position: fixed;
			bottom: 0;
			height: 100rpx;
			width: 100%;
			background: #FFFFFF;
			.footer1{
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;	
				padding: 0 40rpx;
				.all{
					width: 150rpx;
					display: flex;
					align-items: center;
					image{
						width: 35rpx;
						height: 35rpx;
						margin-right: 10rpx;
					}
				}
				.yl{
					color: #5848c4;
				}
			}
		}
	}
	
	.withdraw-btn{
		margin-left: 20rpx;
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #5848c4;
		border-radius: 30px;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFFFFF;
	}
</style>
