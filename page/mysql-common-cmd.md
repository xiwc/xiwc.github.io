# mysql常用命令总结
  
> 说明: `${name}` 指代要被替换的变量.
> ---
> 登录
> 
> `mysql -u ${username} -p;`  
> Enter password: `${password}`
> 
> 删除DB
> 
> `drop database ${db-name}`
> 
> 创建DB(utf8编码)
> 
> `CREATE DATABASE ${db_name} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;`
> 
> 修改DB编码
> 
> `ALTER DATABASE ${db_name} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`
> 使用DB
> 
> `use ${db-name}`
> 
> 
> `source ${sql-file-path}`
> 
> 创建用户
> 
> 用户授权
> 