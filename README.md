# Skyler-Chat

## 本项目旨在为用户提供智能问答服务。

## 技术栈

1. 框架：Next.js
2. 包管理：pnpm
3. 状态管理：zustand
4. 接口创建：Next.js API能力
5. 接口请求：fetch API
6. 数据库存储：MySQL
7. 数据库连接：mysql2

## 开发

1. 初始化：pnpm i
2. 启动：pnpm run dev

### 功能点

1. 用户登陆注册

   - 采用bcrypt加密算法存储及验证密码（引入bcrypt库）
   - 采用uuid为用户唯一标识（引入uuid库）
   - 使用jwt生成及验证token，保持用户登陆状态（引入jsonwebtoken库）
2. 智能体创建

   - 使用Prompt作为智能体信息
3. 聊天会话

   - 使用uuid创建sessionId，作为唯一会话Id
   - 时间戳每次请求响应进行更新，保证会话展示的正序性
   - 使用富文本解析回答内容（md格式，引入react-markdown库）
   - 使用SSE解析回答内容，进行流式渲染（参考链接：https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html）
4. 会话标题

   - 根据上下文信息，使用小模型（Qwen3:0.6b），生成标题，保证较快生成速度
5. 会话追问

   - 根据上下文信息，使用小模型（Qwen3:0.6b），生成追问问题，保证较快生成速度

### 数据库信息

1. useInfo表
   1. userName：用户名
   2. passWord：用户密码
   3. uuid：用户标识
2. intelligentAgentInfo表
   1. intelligentAgentName：智能体名称
   2. agentData：智能体提示词
   3. userName：智能体归属用户
   4. isPublic：是否公开
   5. headPicture：智能体头像URL
3. sessionRecords表
   1. userName：用户名称
   2. sessionInfo：会话信息
   3. sessionId：会话Id
   4. timeStamp：时间戳
   5. intelligentAgentName：智能体名称
