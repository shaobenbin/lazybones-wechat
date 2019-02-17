app.factory('AccountDao', function() {
    var dao =  {};
    dao.query = function(callback) {
      if(Common.DEBUG_MODE){
        console.log("工厂类获取数据---dao.query");
      }
      Database.getLoginWxAccounts(callback)
    }
    //根据当前webviewId查询下一个，只有一条时返回空对象
    dao.findNextId = function(webviewId,callback){
      if(Common.DEBUG_MODE){
        console.log("工厂类查询下一个Id---dao.findNextId---根据Id:" + webviewId);
      }

      dao.query((dataset)=>{
        if (dataset.accounts.length < 1) {
            if(Common.DEBUG_MODE){
              console.log("数据长度为0");
            }
            callback(null);
        }
        for ( var i = 0 ; i < dataset.accounts.length ; i++ ){
          if ( dataset.accounts[i].webviewId == webviewId ){
            if(Common.DEBUG_MODE){
              console.log("根据对应数据查找到一下个webviewId:");
            }
            let nextWebview = (dataset.accounts[i+1]||dataset.accounts[i-1]||{});
            callback(nextWebview.webviewId);
          }
        }
      })
    }

    dao.remove = function( webviewId,callback ) {
      if(Common.DEBUG_MODE){
        console.log("工厂类删除目标Id---dao.remove");
      }
      dao.query((dataset)=>{
        if (dataset.accounts.length < 1) {
          if(Common.DEBUG_MODE){
            console.log("数据长度为0");
          }
          return;
        }

        if(Common.DEBUG_MODE){
          console.log("删除前的旧数据");
          console.log(dataset.accounts);
        }

        let newAccounts = [];
        for ( var i = 0 ; i < dataset.accounts.length ; i++ ){
          let tmpAccount = dataset.accounts[i];
          if (tmpAccount.webviewId != webviewId ){
            newAccounts.push(tmpAccount);
          }
        }
        dataset.accounts = newAccounts;

        if(Common.DEBUG_MODE){
          console.log("删除后的新数据");
          console.log(newAccounts);
        }

        storage.set('login_wechat_accounts_v1', dataset, function(error) {
          if (error) throw error;
          callback(dataset)
        });
      })
    }

    return dao;
})
