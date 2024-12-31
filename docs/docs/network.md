# 网络数据包

`MzLib` 同时支持您直接处理网络传输的封包 `Packet`

## 监听封包

对于一个 `Packet` 子类, 我们可以监听它的实例. 您需要创建一个 `mz.mzlib.minecraft.network.packet.PacketListener` 实例并注册到你的模块当中

> 此处的 `Packet` 类并不是 Minecraft 原生 Network系统的封包接口 \
> 该类位于 `mz.mzlib.minecraft.network.packet.Packet` 

例如我们需要监听 `PacketC2sChatMessage`

```java
@Override
public void onLoad()
{
    this.register(new PacketListener<>(PacketC2sChatMessage.class, (event, packet)->
    {
        // event表示当且封包事件的信息，它并不是Event的子类
        event.setCancelled(true); // 取消封包处理流程(类似于事件取消)
    }));
}
```

<br>

::: tip 同步监听

MzLib 默认数据包处理为异步, 如果您有同步监听的需求要调用 `sync` 方法

```java

@Override
public void onLoad()
{
    this.register(new PacketListener<>(PacketC2sChatMessage.class, (event, packet)->
    {
        event.sync().whenComplete((r,e)->
        {
            // 这里在主线程中处理数据包事件
            // 如果需要则取消事件
            event.setCancelled(true); // 取消事件
        });
    }));
}
```

:::

## 发包

发送一个数据包非常简单, 您需要调用 `mz.mzlib.minecraft.entity.player.EntityPlayer` 中的 `sendPacket` 方法即可

> 假设我们在命令或者事件的处理器上下文内, 您可以直接获取到 `EntityPlayer` 实例

```java
public void handle(EntityPlayer player)
{
    player.sendPacket(your_packet);
}
```

有关如何创建封包实例, 详见 [包装器](/docs/wrapper.md#包装器)

::: warning 注意

您的插件是作为服务端的角色向客户端通信的, 所以只能发送 `S2c` 字段的封包

:::

::: tip 给服务端发包

是的你没听错, 你可以伪造一个封包发给服务端, 使得服务器认为收到了一个玩家的封包并进行处理。

调用 `EntityPlayer` 中的 `receivePacket` 方法以实现

> 该方法传入的则是 `C2s` 字段的封包

:::