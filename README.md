# 《WebGL编程指南》书籍学习札记

***
* *作者：Kouichi Matsuda Rodger lea*
* *译者：谢光磊*
* *2014.6 第一版*
* [书籍网站及其官方源码](https://sites.google.com/site/webglbook/)
* **代码为自己手写，相比于书籍源代码，结合了自己的理解和写代码的习惯**
***

## 目录
### Chapter 1 - 简介
* WebGL基于OpenGL ES 2.0

### Chapter 2 - 初步
* [lesson1](./02/lesson1.js) - 绘制背景色
* [lesson2](./02/lesson2.js) - 添加着色器，绘制一个点
* [lesson3](./02/lesson3.js) - attribute传值
* [lesson4](./02/lesson4.js) - uniform变量
* [lesson5](./02/lesson5.js) - 结合dom事件

#### attribute uniform varying 的区别与联系
1. attribute : 只能在vertex shader中使用，用于逐定点操作，接受外部不停地传入的值。
2. uniform : 在vertex/fragment shader都可以使用，用于接受外部的限定值，在逐顶点绘制的过程，不能改变。
3. varying : 用于vertex和fragment之间的沟通。

### Chapter 3 - 三角形
* [lesson1](./03/lesson1.js) - 使用ARRAY_BUFFER缓冲区绘制三个点
* [lesson2](./03/lesson2.js) - 绘制三角形
* [lesson3](./03/lesson3.js) - 认识基本绘制单位
* [lesson4](./03/lesson4.js) - 施以平移变换矢量
* [lesson5](./03/lesson5.js) - 用数学公式施以旋转变换
* [lesson6](./03/lesson6.js) - 使用矩阵抽象所有变换方式

### Chapter 4 - 高级变换
* [lesson1](./04/lesson01.js) - 认识Matrix4类
* [lesson2](./04/lesson02.js) - 基于requestAnimationFrame创建动画

### Chapter 5 - 颜色和纹理
* [lesson1](./05/lesson01.js) - 一个缓冲区buf对象定义解析规则，为多个着色器变量传值
* [lesson2](./05/lesson02.js) - varying变量
* [lesson3](./05/lesson03.js) - 彩色三角形-验证光栅化
* [lesson4](./05/lesson04.js) - 使用纹理
* [lesson5](./05/lesson05.js) - 使用多个纹理

**varying变量的内插作用**
>在光栅化的过程中，一条线段(图案)的两端颜色不同时，线段上的所有颜色值都会被恰当的计算下来，再传给片元着色器的varying变量中。

**图片坐标与GL中的纹理坐标**
>图片坐标系中原点在左上角要进行 y->t 反转

### Chapter 6 - 着色器语言
* 强类型 大小写敏感 严格分号 类C程序语法结构
* 保留前缀 : `gl_ webgl_ _webgl_`
* 内置矢量和矩阵计算
* 内置纹理取样器
* 宏
* **函数不允许递归操作**
* 精度限定 : **片元着色器中float没有默认精度，所以需要手动提前指定**


### Chapter 7 - 三维世界初步
* [lesson1](./07/lesson01.js) - ViewMatrix视点-观察者
* [lesson2](./07/lesson02.js) - 观察者 + 模型变化
* [lesson3](./07/lesson03.js) - 通过键盘事件调整观察者-进一步认识ViewMatrix
* [lesson4](./07/lesson04.js) - 通过键盘事件调整盒装可视范围
* [lesson5](./07/lesson05.js) - 通过键盘事件调整盒装可视范围
* [lesson6](./07/lesson06.js) - 透视投影范围 - Model+View+Pers 共冶一炉
* [lesson7](./07/lesson07.js) - 隐藏面擦除解决重叠现象 + 多边形偏移解决深度冲突
* [lesson8](./07/lesson08.js) - 使用索引绘制图形 //=>绘制一个立方体
* [lesson9](./07/lesson09.js) - 顶点与颜色分开传入 //=>为每一面指定颜色

### Chapter 8 - 光照
* [lesson1](./08/lesson01.js) - 平行光漫反射
* [lesson2](./08/lesson02.js) - 平行光漫反射+环境光环境反射
* [lesson3](./08/lesson03.js) - 通过键盘事件调整观察者-进一步认识ViewMatrix
* [lesson4](./08/lesson04.js) - 运动物体的光照 //=>模型矩阵逆转置*法向量
* [lesson5](./08/lesson05.js) - 点光源漫反射+环境光环境反射 //=>逐顶点与逐片元

### Chapter 9 - 层次模型
* [lesson1](./09/lesson01.js) - 单关节
* [lesson2](./09/lesson02.js) - 多关节 //=>使用同一个基础矩形(同一个索引)
* [lesson3](./09/lesson03.js) - 多关节 //=>使用不同的索引
* initShaders() 实现原理

### Chapter 10 - 高级技术
* 使用鼠标拖拽
* 选取一个物体/面
* 结合canvas2d显示文字实现HDD
* fog雾化模拟大气效果
* **绘制圆点**
* α混合(透明度)
* 切换着色器
* 渲染结果作为纹理使用(帧缓冲区)
* 绘制阴影
* OBJViewer从外部加载模型数据

***
**Author** : *MrZebra*

***

