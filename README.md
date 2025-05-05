# Skyler-Chat

## 本项目旨在为用户提供智能问答服务。

## 技术栈
1. 框架：Next.js
2. 包管理：npm
3. 状态管理：zustand
4. 接口：Next.js API能力

## 开发
1. 初始化：npm i
2. 启动：npm run dev

### 功能点
1. 用户登陆注册
   - 采用...加密算法
2. 智能体创建
3. 聊天
   - 错误重试机制
   - 存储统一使用sessionId,有userName存userName
   - 时间戳每次请求响应进行更新
   - 采用小模型进行上下文总结，生成标题
   - 采用小模型生成追问问题，使用JSON格式
4. 翻译
5. 导出md
6. 使用mysql2，无需手动释放连接池
7. uuid的创建，保证无重复
8. 富文本解析（md格式）
9. 使用pnpm进行包管理
10. token存储登录状态
11. 用户不登陆的状态下能否存储会话信息？
    1.  考虑使用浏览器指纹
12. 使用fetch API进行接口请求




### 数据库管理
1. useInfo表
   1. userName：用户名
   2. passWord：用户密码
   3. uuid：用户标识
2. intelligentAgentInfo表
   1. intelligentAgentName：智能体名称
3. sessionRecords表
   1. userName：用户名称
   2. sessionInfo：会话信息
   3. sessionId：会话Id
   4. timeStamp：时间戳


### TODO
- 修改密码
- 智能体创建
- 新建对话
