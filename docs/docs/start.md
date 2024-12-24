# 快速开始

本页面从0教学您如何使用 `MzLib` 简化您的 Bukkit 插件开发

> 请确保您有一定的JAVA基础和Bukkt开发经验

## 创建一个基于MzLib的项目

按照常规的方式创建您的 Bukkit 插件项目. ( 建议使用IDEA的Minecraft Devlopment插件 )

> 如果您是在IDEA或者Eclipse开发, 请在依赖中添加 `MzLibMinecraft` 和 `MzLibCore`

请在 `src/main/resources/plugin.yml` 中添加这么一条已确保 Bukkit 可以检查到您依赖了 MzLib

```yaml
depend: [MzLibMinecraft, MzLibCore]
```

## 模块系统

基于以上的工作, 您应该创建一个新的类并继承 `mz.mzlib.module.MzModule` 作为您的主模块

以下是一个模块的实例代码

``` java
public class Demo extends MzModule {
    public static Demo instance = new Demo();
    
    @Override
    public void onLoad() {
        // do sth. on load
    }
}
```

> 您应该确保您的插件至少有一个主模块

* 可以有若干个子模块
* 子模块下还可以有子模块

在您的插件主类中您可以注意到 `onEnable` 和 `onDisbale`, 这两个方法分别用于您加载和卸载模块。
使用 `mz.mzlib.MzLib` 来注册和卸载主模块

```java
@Override
public void onEnable() {
    MzLib.instance.register(Demo.instance);
}

@Override
public void onDisable() {
    MzLib.instance.unregister(Demo.instance);
}
```

### 子模块注册

在其父模块中注册您的子模块, 如下

```java
public class Demo extends MzModule {
    public static Demo instance = new Demo();
    
    @Override
    public void onLoad() {
        this.register(DemoSubmodule.instance);
    }
}
```

::: tip

您无需担心子模块是否需要手动注销, 父模块注销的同时会自动注销其子模块

:::

<br>
<br>

现在, 您可以开始正式编写您的插件了