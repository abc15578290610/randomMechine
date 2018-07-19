module game {
	export class nineRandom extends eui.Component{
		private start_btn:eui.Image;
		private img1:eui.Image;
		private img2:eui.Image;
		private img3:eui.Image;
		private img4:eui.Image;
		private img5:eui.Image;
		private img6:eui.Image;
		private img7:eui.Image;
		private img8:eui.Image;
		private random:eui.Group;
		public constructor() {
			super();
			this.skinName = "nineRandomSkin";
		}
		protected childrenCreated(){ 
			super.childrenCreated();
			this.start_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startFunction,this);
		}
		private startFunction(){
			//roll(); //转圈过程不响应click事件，会将click置为false
			let index = play(this.random);
		}
	}
	export  function play(taget:egret.DisplayObjectContainer){
		
		var lottery = {
			index: -1,    //当前转动到哪个位置，起点位置
			count: 8,     //总共有多少个位置
			timer: 0,     //setTimeout的ID，用clearTimeout清除
			speed: 200,    //初始转动速度
			times: 0,     //转动次数
			cycle: 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
			prize: -1,    //中奖位置
			rollSwitch: function() {//切换目标状态
				var index = this.index;
				var count = this.count;				
				if(lottery.index!=-1)(taget.getChildAt(index) as eui.Image).source = "randombg1_png";
				index += 1;
				if (index >count - 1) {
					index = 0;
				};
				(taget.getChildAt(index) as eui.Image).source = "randombg2_png";
				// egret.Tween.get(taget.getChildAt(index)).to({alpha:0},500);
				this.index = index;
				return false;
				},
			stop: function(index) {
				this.prize = index;
				return false;
				}
		};
		roll();
		function roll() {
			lottery.times += 1;
			lottery.rollSwitch(); //转动过程调用的是lottery的rollSwitch方法，这里是第一次调用初始化
			if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {//结束时
				clearTimeout(lottery.timer);
				lottery.prize = -1;
				lottery.times = 0;
			} else {
				if (lottery.times < lottery.cycle) {//加速
					lottery.speed -= 5;
				} else if (lottery.times == lottery.cycle) {
					var index = Math.random() * (lottery.count) | 0; //静态演示，随机产生一个奖品序号，实际需请求接口产生
					lottery.prize = 3;
				} else {//减速
					if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
						lottery.speed += 110;
					} else {
						lottery.speed += 20;
					}
				}
				lottery.speed<40?lottery.speed = 40:null;
				if(lottery.timer!=0)clearTimeout(lottery.timer);
				lottery.timer = setTimeout(roll, lottery.speed); //循环调用
			}
			return false;
		}
		return lottery.index;
	}
}
