# 事件监听器

本页将教学您使用 `MzLib` 简化事件的处理

## 监听事件

使用 `mz.mzlib.event.EventListener` 来监听一个已注册的事件

假设我们监听Bukkit的玩家加入事件

```java
EventListener<> listener = new EventListener<>(PlayerJoinEvent.class, e-> {
    System.out.println("Event is called: "+e.getClass());
});
// 老样子, 还是用register方法注册一下
```

## 发送自定义事件

创建一个您自己的事件类, 并继承 `mz.mzlib.event.Event`

> `call` 方法不用编写任何逻辑, 但是您必须声明它的方法体

```java
public class MyEvent extends Event {
    // 实现call方法
    @Override
    public void call() {
        // 这里不用写任何代码
    }
    
    // 处理该事件的模块
    public static class Module extends MzModule {
        // 模块实例，在其父模块中注册
        public static Module instance = new Module();
        
        @Override
        public void onLoad()
        {
            // 注册事件类
            this.register(MyEvent.class);
        }
    }
}
```

在合适的位置触发您的事件

```java
MyEvent event = new MyEvent();
// 触发监听器
event.call();
if(!event.isCancelled()) { //判断事件是否被取消
    // 执行事件
}
// 完成事件
event.complete();
```

::: warning 注意
在事件完成后, 您必须调用 `complete` 方法来结束事件
:::