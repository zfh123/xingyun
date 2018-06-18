var dappAddress = "n1hUNc2vxFUZtyhhAj7LzqvZKiNAbA8Sws8";
var NebPay = require("nebpay");
var nebPay = new NebPay();
var Vue = new Vue({
    el: '#bodyID',
    data: {
        message: '欢迎使用速记记事',
        isLogin:false,
        isEdult:true,
        goLogin:false,
        address:'',
        passworld:'',
        dataList:[
            {
                title:'今日新增',
                isEdult:true,
                id:0,
                createTime:'2018-6-13',
                content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nisl lorem, dictum id pellentesque at, vestibulum ut arcu. Curabitur erat libero, egestas eu tincidunt ac, rutrum ac justo. Vivamus condimentum laoreet lectus, blandit posuere tortor aliquam vitae. Curabitur molestie eros.',
            },
            {
                title:'昨天比较',
                id:1,
                isEdult:true,
                createTime:'2018-6-11',
                content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nisl lorem, dictum id pellentesque at, vestibulum ut arcu. Curabitur erat libero, egestas eu tincidunt ac, rutrum ac justo. Vivamus condimentum laoreet lectus, blandit posuere tortor aliquam vitae. Curabitur molestie eros.',
            },
            {   
                title:'嵌套比较',
                isEdult:true,
                id:2,
                createTime:'2018-6-10',
                content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nisl lorem, dictum id pellentesque at, vestibulum ut arcu. Curabitur erat libero, egestas eu tincidunt ac, rutrum ac justo. Vivamus condimentum laoreet lectus, blandit posuere tortor aliquam vitae. Curabitur molestie eros.',
            },
        ],
    },
    created(){
    },
    mounted(){
    },
    methods:{
        // 唤起登录
        login(){
            var userInfo =JSON.parse(localStorage.getItem('userInfo'));
            if(userInfo){
                this.address = userInfo.address;
                this.passworld = userInfo.passworld;
                this.realyLogin();
            }else{
                this.address = '';
                this.passworld = '';
                this.goLogin = true;
            }
            
        },
        realyLogin(){
            var that = this;
            debugger
            nebPay.simulateCall(dappAddress, "0", "getUserInfo", JSON.stringify([this.address]), {
                listener: function(res) {
                    if(res.result=='null'){
                        that.resigner();
                    }else{
                        var newArr = [];
                        var data = JSON.parse(JSON.parse(res.result));
                        data.dataList.forEach(function(item) {
                            item.isEdult = true;
                        })
                        console.log(data);
                        that.dataList = data.dataList;
                        that.isLogin = true;
                        localStorage.setItem('userInfo',JSON.stringify({
                            address:that.address,
                            passworld:that.passworld
                        }));
                    }
                    
                }
            })
        },
        // 注册
        resigner(){
            var that = this;
            nebPay.call(dappAddress, "0", "register", JSON.stringify([this.address,this.passworld]), {
                listener: function(res) {
                    if(res.txhash){
                        localStorage.setItem('userInfo',JSON.stringify({
                            address:that.address,
                            passworld:that.passworld
                        }));
                        // 存储需要时间请耐心等待
                        setTimeout(function() {
                            that.getData();
                        }, 17000);
                    }
                }
            })
        },
        // 获取用户信息
        getData(){
            var that = this;
            nebPay.simulateCall(dappAddress, "0", "getData", JSON.stringify([this.address]), {
                listener: function(res) {
                   var newArr = [];
                    var data = JSON.parse(JSON.parse(res.result));
                    data.dataList.forEach(function(item) {
                        item.isEdult = true;
                    })
                    console.log(data);
                    that.dataList = data.dataList;
                    that.isLogin = true;
                }
            })
        },
        // 本地新增好模板
        addData(){
            var that = this;
            nebPay.call(dappAddress, "0", "addData", JSON.stringify([this.address]), {
                listener: function(res) {
                    if(res.txhash){
                        // 存储需要时间请耐心等待
                        setTimeout(function() {
                            that.getData();
                        }, 17000);
                    }
                }
            })
        },
        // 编辑
        edults(item){
            var that = this;
            item.isEdult = !item.isEdult;
            if(item.isEdult){
                nebPay.call(dappAddress, "0", "updata", JSON.stringify([item.id,item.title,item.content,this.address]), {
                    listener: function(res) {
                        if(res.txhash){
                            // 存储需要时间请耐心等待
                            setTimeout(function() {
                                that.getData();
                            }, 17000);
                        }
                    }
                })
            }
        },
        delData(item){
           var that = this;
            nebPay.call(dappAddress, "0", "delDate", JSON.stringify([item.id,this.address]), {
                listener: function(res) {
                    if(res.txhash){
                        // 存储需要时间请耐心等待
                        setTimeout(function() {
                            that.getData();
                        }, 17000);
                    }
                }
            })
        }
    }
})