## Why

学生成绩管理系统需要从零搭建，首先需要完成项目规范化初始化和数据持久化基础设施。没有持久化能力，后续的录入、查询、统计功能都无法独立运行和验证。

本 change 将完成项目初始化、JSON 文件存储引擎开发、学生数据读写能力建设，为后续三个迭代提供运行基础。

## What Changes

- 初始化 Node.js 项目，安装 Vitest 测试框架依赖
- 搭建完整目录结构（src/、data/、tests/、spec/、openspec/）
- 实现 JSON 文件存储引擎 `src/storage.js`，支持数据的读取、写入和初始化
- 创建 `data/students.json` 初始数据文件
- 完成 CLI 入口框架 `src/main.js`（一级菜单骨架）
- 编写存储引擎单元测试

## Capabilities

### New Capabilities

- `project-init`: 项目目录结构、package.json、依赖安装
- `file-storage-engine`: JSON 文件持久化存储引擎，支持读取、写入和数据初始化

## Dependencies

无（本 change 是第一个迭代，从零开始）

## Impact

- `package.json`: 新建，定义项目信息和脚本
- `src/storage.js`: 新建，JSON 文件存储引擎
- `src/main.js`: 新建，CLI 入口骨架
- `data/students.json`: 新建，初始数据文件（空数组）
- `tests/storage.test.js`: 新建，存储引擎单元测试
- `spec/`: 新建，规范文档目录
- `openspec/`: 新建，OpenSpec 框架目录

## 测试策略

依据 `openspec/testing-strategy.md`，本 change 为新建模块，必须覆盖单元测试。

- 单元测试：`tests/storage.test.js` 覆盖读取空数据、写入数据、读取已写入数据、文件不存在时初始化等场景。
- 回归验证：完成后运行 `npm test` 确认全部测试通过。

## Success Criteria

- `npm test` 运行全部测试通过（至少 3 个测试用例）
- `src/storage.js` 可独立完成 JSON 文件的读取、写入和初始化
- `data/students.json` 初始化为合法 JSON 空数组
- 项目目录结构符合 design.md 定义
