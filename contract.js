"use strict";

var Mining = function () {};

Mining.prototype = {
    init: function () {},
    // 注册 给予初始值
    register: function (address, password) {
        var times = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        var createTime = times.split(' ')[0];
        var id = times.split(' ').join('-').split(':').join('-').split('-').join('');
        var userInfo = {
            address: address,
            password: password,
            counts:1,
            dataList:[{
                title: '新增模板',
                content: '请编辑内容',
                createTime:createTime,
                id:id
            }]
        };
        LocalContractStorage.set(address, JSON.stringify(userInfo));
        this._setAll(address)
    },
    _setAll: function (address) {
        var defaultData = JSON.parse(LocalContractStorage.get('all'));
        var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
        // isAddress用来判断这个地址 之前在所有资料里面是否储存过。循环完还是false则未存过
        var isAddress = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].address == address) {
                isAddress = true
            }
        }
        if (!isAddress) {
            data.push({
                address: address,
            });
        }
    
        if (data.length > 1) {
            LocalContractStorage.del('all');
        };
        LocalContractStorage.set('all', JSON.stringify(data));
    },
    // 获取所有的注册 用户
    getAll: function () {
        return LocalContractStorage.get('all');
    },
    // 根据用的id获取用户的信息
    getUserInfo: function (address) {
        return LocalContractStorage.get(address);
    },
    // 保存用户存储的信息到链上
    saveData:function(address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var times = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        var createTime = times.split(' ')[0];
        var id = times.split(' ').join('-').split(':').join('-').split('-').join('');
        userInfo.dataList.push({
            title: '新增模板',
            content: '请编辑内容',
            createTime:createTime,
            id:id
        });
        userInfo.counts = userInfo.dataList.length;
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 获取用户的信息
    getData:function(address) {
        address = address.trim();
        if ( address === "" ) {
            throw new Error("empty key")
        }
        return LocalContractStorage.get(address);
    },
    // 新增列表
    addData:function(address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var times = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        var createTime = times.split(' ')[0];
        var id = times.split(' ').join('-').split(':').join('-').split('-').join('');
        var obj = {
            title: '新增模板',
            content: '请编辑内容',
            createTime:createTime,
            id:id
        }
        userInfo.dataList.unshift(obj);
        userInfo.counts = userInfo.dataList.length;
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 删除某一个用户的信息
    delDate:function(id,address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var dataList = userInfo.dataList;
        var newArr = [];
        dataList.forEach(function(item) {
            if(item.id!=id){
                newArr.push(item);
            }
        });
        userInfo.dataList = newArr;
        userInfo.counts = userInfo.dataList.length;
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    },
    // 更新--修改
    updata:function(id,title,content,address) {
        var userInfo = JSON.parse(LocalContractStorage.get(address));
        var dataList = userInfo.dataList;
        for (var i = 0; i < dataList.length; i++) {
            if(dataList[i].id == id){
                dataList[i].title = title;
                dataList[i].content = content
            }
        }
        LocalContractStorage.set(address, JSON.stringify(userInfo));
    }
};

module.exports = Mining;