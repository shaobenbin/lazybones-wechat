## 懒虫微信云客服

>> 支持微信多开的电脑版



### 前序

* 利用了electron作为核心技术架构
* 微信多开是基于微信web版功能上拓展出来的，并不会是修改微信pc端源码，理论上应该是安全的
* 核心原理就是使用electron模拟出了多个不同浏览器来打开https://qq.wx.com.一台电脑视本身的性能决定多开上限，之前我测试过一台电脑开到20个微信没啥问题。但是特别大的微信号测试的不多，比如3000人+的微信
* 这个产品是我差不多两年前开发的，由于老板需要，突然某一天告诉我一个月之内开发出这样一个产品，但是经过勤奋的各类技术调研+Github代码查询，我发现了一个前辈（也许年龄比我小）的项目[electronic-wechat](https://github.com/geeeeeeeeek/electronic-wechat),我的部分代码是借鉴了这位老兄的。
* 两年后重新再打开这个项目，由于electron的版本升级了好几版，部分electron的api也变动了。所以又经过一段时间的修改才让项目重新运行，当年开发完毕有专门的人测试，现在只能依靠自己测试，不免有些问题，如遇问题请联系我.
* <span style="color:red">[electron](https://electronjs.org/)是神器。对于一般的pc软件开发，用它绝对ok</span>



### 预览
![懒虫微信云客服](http://pmv4hdpiu.bkt.clouddn.com/lazy-screenshot-01.png) 


### 功能部分 
1. 微信多开
2. 微信名字复制，我们的客服同学经常需要这个功能，所以加了一个按钮快捷点击
3. 微信的faq设置，可以将常用回复设置在软件中
4. 淘宝链接可以打开
5. 未读消息统计以及未读消息的快速定位
6. 阻止消息撤回

### 未来功能计划

####  1. 未读消息的优化
>> 现在的未读消息在某个场景下会出现提示不准确的情况，比如登录了两个微信，分别是a和b，假设先切换到a微信打开跟a1的人的聊天框，此时切换到b微信，在这种情况下，如果好友a1给微信a发送了消息，是不会提示未读消息的，因为在原始的微信web中会认为用户已经阅读了a1的信息。这里有两种解决方案：1. 使用自己的方案计算未读数,目前看实现可能会较复杂  2. 没次切换微信的时候，都默认都直接打开文件传输助手的聊天框.此时实现应该会简单点，利用了微信本身的未读消息机制

### 最后测试环境
1. electron版本为: 4.04
2. node版本: v10.7.0


### 本地运行

>> 以mac为例，其它系统未测试.

1. 安装electron：npm install -g electron
2. 安装打包工具：npm install -g asar
3. 安装打包工具：npm install -g electron-packager
4. 克隆项目：git clone 本项目
5. 进入项目：cd lazybones-wechat
6. 安装项目依赖：npm install
7. 运行项目：election .


### 打包
1. osx打包： npm run build:osx64
2. linux的64位打包: npm run build:linux64

### mac下编译的包

1. mac版本: 链接: https://pan.baidu.com/s/1JLwAYUX00LywBN8Ok-MWiQ 提取码: i5jy 复制这段内容后打开百度网盘手机App，操作更方便哦



