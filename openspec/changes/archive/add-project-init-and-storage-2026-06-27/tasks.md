## 1. 项目初始化与环境配置

- [x] 1.1 创建完整目录结构（src/、data/、tests/、spec/、openspec/）
- [x] 1.2 创建 `package.json`，配置项目信息、脚本和依赖
- [x] 1.3 创建 `openspec/config.yaml`，配置 OpenSpec 框架
- [x] 1.4 创建 `openspec/testing-strategy.md`，定义测试策略
- [x] 1.5 创建 `data/students.json`，初始化为空数组 `[]`
- [x] 1.6 安装依赖：`npm install`

## 1.T 项目初始化验证

- [x] 1.T.1 确认 `npm test` 脚本可正确执行（9 个测试全部通过）

## 2. 存储引擎实现

- [x] 2.1 实现 `src/storage.js` 的 `loadStudents()` 函数
- [x] 2.2 实现 `src/storage.js` 的 `saveStudents(data)` 函数
- [x] 2.3 实现 `src/storage.js` 的 `initStorage()` 函数

## 2.T 存储引擎测试

- [x] 2.T.1 在 `tests/storage.test.js` 编写 `loadStudents()` 读取已有数据的测试
- [x] 2.T.2 在 `tests/storage.test.js` 编写 `loadStudents()` 文件不存在时初始化的测试
- [x] 2.T.3 在 `tests/storage.test.js` 编写 `saveStudents()` 写入后读取一致测试
- [x] 2.T.4 在 `tests/storage.test.js` 编写覆盖已有数据测试
- [x] 2.T.5 运行 `npm test` 确认新增测试失败（Red 验证） — 初次运行时模块未实现，测试无法 import 为 Red
- [x] 2.T.6 实现 2.1-2.3 使存储引擎测试通过（Green） — 9 passed
- [x] 2.T.7 在测试保护下整理存储引擎代码（Refactor）

## 3. CLI 入口骨架

- [x] 3.1 实现 `src/main.js` 的一级菜单框架（显示菜单、读取用户选择、退出系统）

## 4. 回归验证

- [x] 4.1 运行 `npm test` 确认全部测试通过（9 passed）
- [x] 4.2 手动运行 `node src/main.js` 验证 CLI 可启动
- [x] 4.3 重读 proposal、design、specs 和 tasks，确认实现未越界且 artifacts 一致

---

# 测试检查清单

## 检查项

### 阶段一：Propose（规划阶段）

- [x] **测试策略已定义**：在 design.md 中说明了本 change 需要单元测试
- [x] **测试任务已拆分**：tasks.md 中每个功能模块任务组都有对应的测试任务
- [x] **测试基础设施已确认**：Vitest 已在 package.json 中声明

### 阶段二：Apply（实施阶段）

- [x] **TDD 顺序已遵守**：每个功能点执行了 Red → Green → Refactor
- [x] **单元测试已编写**：`tests/storage.test.js` 已创建
- [x] **测试描述清晰**：每个 `it()` 描述读起来像一句完整的中文断言

### 阶段三：验证阶段

- [x] **全部测试通过**：运行 `npm test` 输出全部通过，零失败（9 passed）
- [x] **无测试作弊**：没有为了通过而修改测试期望值、没有 mock 掉核心业务逻辑

### 阶段四：归档阶段

- [ ] **测试文件已提交**：所有测试文件已纳入 git 版本控制（最终统一提交）
- [ ] **CI 脚本已更新**（如有）：package.json 的 test 脚本能正确运行测试
