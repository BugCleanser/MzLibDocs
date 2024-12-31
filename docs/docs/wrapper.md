# 包装类

包装类是 `MzLib` 中非常常用的对象。因为MC的类在不同版本可能有所变化，所以我们必须给它包装一层，包装后你还可以越权访问它的成员。

## 包装器

包装器是指 `WrapperObject` 的子类，是对Minecraft类的基本封装
<br>
相比被它包装的类，它是一个接口，因此它没有JVM概念的构造器，取而代之的是静态方法 `newInstance`

例如你要新建一个 `ItemStack` 实例

```java
ItemStack is = ItemStack.newInstance(Identifier.newInstance("minecraft:diamond"));
```

若你通过某种方法得到了Minecraft的对象，通过它创建一个包装器实例，使用包装器的 `create` 方法

```java
Entity entity = Entity.create(nmsEntity);
```

::: tip 获取被包装的对象

若要取得被包装的Minecraft的对象，使用 `getWrapped` 方法

```java
Object nms = is.getWrapped();
```

> 不过你一般用不到这样，只应使用包装器来操作这些Minecraft对象。

:::

::: warning 转换

值得注意的是，`wrapper` 不应该使用JVM概念的 `instanceof` 和强制转换，因为 `Wrapper.create` 返回的永远只是`Wrapper` 的实例。
<br>
取而代之的是 `wrapper.isInstanceOf` 和 `wrapper.castTo` ，参数是另一个包装器的 `create` 方法引用，例如

```java
if(entity.isInstanceOf(EntityPlayer::create))
{
    EntityPlayer player = entity.castTo(EntityPlayer::create);
    // do something
}
```

:::

## 包装已知类

如果你可以直接访问一个类，可以使用 `@WrapClass` 注解修饰
<br>
这里以`ClassLoader`为例

```java
// 包装ClassLoader
@WrapClass(ClassLoader.class)
// 包装类必须是interface，并且是WrapperObject的子类
public interface WrapperClassLoader extends WrapperObject 
{
    /**
     * 包装器的构造器，需要注解@WrapperCreator用于优化性能
     * 一般直接复制粘贴，然后替换1处和2处为自己的包装类，将3处替换为目标类或任意其已知父类（如Object)
     */
    @WrapperCreator
    static WrapperClassLoader/*1*/ create(ClassLoader/*3*/ wrapped)
    {
        return WrapperObject.create(WrapperClassLoader/*2*/.class, wrapped);
    }
    
    /**
     * findClass是非public方法，因此对齐包装
     * @WrapMethod("findClass")表示目标方法的名称是findClass
     * 包装方法的返回值类型必须和目标方法的一致，或者是其封装类
     * 没必要写throws
     */
    @WrapMethod("findClass")
    Class<?> findClass(String name) throws ClassNotFoundException;
}
```

若目标类的类名固定且已知，但代码中无法直接访问，可以使用 `@WrapClassForName` 代替 `@WrapClass`

```java
@WrapClassForName("java.lang.ClassLoader")
```

## 使用包装类

如果有一个目标类的实例，可以使用 `create` 将其包装为包装类实例，从而访问其成员

```java
// 目标类实例
ClassLoader cl = this.getClass().getClassLoader();
// 创建包装类实例
WrapperClassLoader wcl = WrapperClassLoader.create(cl);
// 调用包装方法或访问字段
wcl.findClass("java.lang.String");
```

## 拓展

包装类可以被继承，当你需要包装它目标类的子类，或者你单纯想要拓展包装类的功能

```java
// 要包装的类和WrapperClassLoader的相同
@WrapSameClass(WrapperClassLoader.class)
// 继承WrapperClassLoader，也可以先显式继承WrapperObject
public interface ExtendedWrapperClassLoader extends WrapperObject, WrapperClassLoader
{
    /**
     * 复制静态方法creator
     * 记得将1处和2处替换为ExtendedWrapperClassLoader
     */
    @WrapperCreator
    static ExtendedWrapperClassLoader/*1*/ create(ClassLoader/*3*/ wrapped)
    {
        return WrapperObject.create(ExtendedWrapperClassLoader/*2*/.class, wrapped);
    }
    
    /**
     * 这时候可以封装更多方法
     */
    @WrapMethod("resolveClass")
    void resolveClass(Class<?> c);
}
```

如果你已有父封装类的实例，你当然可以拿到目标类的实例然后使用拓展封装类重新封装，从而调用拓展封装类中的方法

```java
ClassLoader cl = this.getClass().getClassLoader();
WrapperClassLoader wcl = WrapperClassLoader.create(cl);
// getWrapped得到被包装的对象，然后使用拓展包装类的create重新封装
ExtendedWrapperClassLoader ewcl = ExtendedWrapperClassLoader.create(wcl.getWrapped());
// 调用拓展封装类中的方法
ewcl.resolveClass(String.class);
```

::: tip 简化

我们一般简化为 `castTo` 方法，参数是包装类的 `create` 方法引用，而不是包装类的 `Class` 实例

```java

ClassLoader cl = this.getClass().getClassLoader();
WrapperClassLoader wcl = WrapperClassLoader.create(cl);
// castTo将包装对象wcl转换为另一个包装类的对象，请勿使用强制转换
ExtendedWrapperClassLoader ewcl = wcl.castTo(ExtendedWrapperClassLoader::create);
ewcl.resolveClass(String.class);

```

:::

## 包装字段访问器

显然由于我们的包装类是接口无法创建字段，所以我们将字段封装为 `getter` 和 `setter`（也可以只封装其中一个）
使用 `@WrapFieldAccessor` ，若你的方法没有参数，代表这是一个 `getter` ，否则代表 `setter` 的返回值应该为 `void`

```java
@WrapSameClass(WrapperClassLoader.class)
public interface ExtendedWrapperClassLoader extends WrapperObject, WrapperClassLoader
{
    @WrapperCreator
    static ExtendedWrapperClassLoader create(ClassLoader wrapped)
    {
        return WrapperObject.create(ExtendedWrapperClassLoader.class, wrapped);
    }
    
    // 包装parent字段的getter和setter
    @WrapFieldAccessor("parent")
    void setParent(ClassLoader parent);
    // 返回值上的ClassLoader换成它的包装类则会自动进行包装，getter的参数也可以这样
    @WrapFieldAccessor("parent")
    ExtendedWrapperClassLoader getParent();
}
```

```java
// 设置一个ClassLoader的parent的parent
ExtendedWrapperClassLoader.create(this.getClass().getClassLoader()) // 包装ClassLoader
        .getParent() // 这样仍然得到一个包装过的ClassLoader
        .setParent(null);
```

## 包装构造器

包装构造器使用 `@WrapConstructor` 注解，返回值必须是当前包装类，构造的实例会自动包装

```java
// 简单包装个Object类
@WrapClass(Object.class)
public interface ExampleWrapper extends WrapperObject
{
    // 记得复制creator
    @WrapperCreator
    static ExampleWrapper create(Object wrapped)
    {
        return WrapperObject.create(ExampleWrapper.class, wrapped);
    }
    
    // 包装Object的无参构造器
    @WrapConstructor
    ExampleWrapper staticNewInstance();
}
```

* 包装的方法必须是非静态的，这样我们才能继承和实现它，一般包装的构造器叫做 `staticNewInstance`
* `static`开头的命名表示它的目标是静态的（构造器我们看成静态方法，这里指的不是方法，而是返回实例的构造器）
* 作为包装类非静态方法，想调用它显然需要一个包装类实例，这样我们可以用 `create(null)` 直接创建一个，表示目标实例是 `null` ，因为我们调用目标类的静态方法所以不需要目标类的实例

为方便使用，我们可以再把它封装成静态方法

> 构造器如此，静态方法和静态字段的访问器也是同理

```java
// 然后我们自己封装成静态方法
static ExampleWrapper newInstance()
{
    // 使用create(null)调用
    return create(null).staticNewInstance();
}
// 先用注解包装成非静态方法
@WrapConstructor
ExampleWrapper staticNewInstance();
```