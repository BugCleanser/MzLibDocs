# 命令系统

本页面教学您如何使用 `MzLib` 替代Bukkit繁琐的命令注册方式

## 创建一个 Comamnd

实例化一个 `mz.mzlib.minecraft.command.Command` 用于注册您的命令

```java
Command command = new Command("cmd","label"); // 构造方法的参数为命令别名
```

::: tip 命名空间

您可以使用 `setNamespace` 方法来设置命令的命名空间以防止重名

> 命令可以以两种方式执行 `/cmd` 以及 `/namespace:cmd`

```java
command.setNamespace("yourpluginname");
```
:::

## 处理您的命令

使用 `setHandler` 方法来设置您处理命令的逻辑, `MzLib` 将其简化成了可以用 lambda 表达式编写的方式，提高了代码美观度

```java
command.setHandler(context-> {
    if(!context.successful || !context.doExecute)
        return;
    // do sth. on execute
    context.sender.sendMessage(Text.literal("Hello World!"));
});
```

* `context` 为命令的执行上下文实例, 其中包含了一些常用信息
* `context.successful` 代表命令是否被成功解析
* `context.doExecute` 代表命令是否应该被执行 (否即为只需要命令补全)
* `context.sender` 代表命令发送方, 是 `mz.mzlib.minecraft.CommandSender` 的实例对象

::: warning 注意

`context.sender.sendMessage` 方法的参数为 `mz.mzlib.minecraft.text.Text` 实例对象, 并不是JAVA字符串
。您可以通过 `literal` 方法构建一个实例对象出来

:::

当然, 您可以简写成调用链的写法, 简化代码

```java
Command command = new Command("demo", "d").setHandler(context->{/* ... */})
```

## 注册

在模块中提供了一个 `register` 方法用于注册您的命令, 该方法注册的命令不需要您手动注销

```java
@Override
public void onLoad() {
    /* 之前编写的代码 */
    this.register(command);
}
```

## 子命令

`Command` 类中提供了一个 `addChild` 方法用于注册子命令, 只需要传入一个 `Command` 实例即可

> 类似 `/cmd subcommand`

```java
command.addChild(sub_command);
```

以及您可以通过 `removeChild` 删除子命令, 用法于 `addChild` 大致相同

## 命令参数

该功能与子命令大致相同, 但您有更多的操作空间

```java
setHandler(context-> {
    // process arg0
    String arg0=new ArgumentParserString("arg0", false, "enum1", "enum2").process(context);
    // 若arg0解析失败直接返回
    if(!context.successful)
        return;
    switch(arg0) {
        case "enum1":
           // 第一种用法
           if(!context.successful || !context.doExecute)
                return;
            context.sender.sendMessage(Text.literal("This is the first usage of this command"));
            break;
        case "enum2":
            // 第二种用法
            // 再读一个参数
            // 后面没有其它参数，可以允许包含空格
            String arg1=new ArgumentParserString("arg1", true).process(context);
            if(!context.successful || !context.doExecute)
                return;
            context.sender.sendMessage(Text.literal("Second: "+arg1));
            break;
        default: // 无效的arg0，命令解析失败
            context.successful=false;
            break;
    }
});
```

## 权限检查

创建一个 `mz.mzlib.minecraft.permission.Permission` 权限检查器对象
并在 `onLoad`方法中将其注册到模块中

```java
Permission permission = new Permission("mzlibdemo.command.mzlibdemo");

@Override
public void onLoad() {
    this.register(permission);
}
```

使用 `Command` 中的 `setPermissionChecker` 方法来设置您的命令权限检查器

```java
command.setPermissionChecker(sender->{
    Command.checkPermissionAnd(
        Command.checkPermissionSenderPlayer(sender), 
        Command.checkPermission(sender, this.permission))
});
```

本章节所有代码可以在 [mz/mzlib/demo/Demo.java](https://github.com/BugCleanser/MzLib/blob/main/MzLibDemo/src/main/java/mz/mzlib/demo/Demo.java#L18) 找到