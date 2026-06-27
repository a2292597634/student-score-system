## 1. 学生管理模块实现

- [x] 1.1 实现 `src/student.js` 的 `validateStudent(student, students)` 校验函数
- [x] 1.2 实现 `src/student.js` 的 `addStudent(students, info)` 录入函数
- [x] 1.3 更新 `src/main.js`，接入数据加载

## 1.T 学生管理模块测试

- [x] 1.T.1 在 `tests/student.test.js` 编写合法录入成功的测试
- [x] 1.T.2 在 `tests/student.test.js` 编写学号为空拒绝的测试
- [x] 1.T.3 在 `tests/student.test.js` 编写学号重复拦截的测试
- [x] 1.T.4 在 `tests/student.test.js` 编写姓名为空拒绝的测试
- [x] 1.T.5 在 `tests/student.test.js` 编写成绩超出范围拒绝的测试
- [x] 1.T.6 在 `tests/student.test.js` 编写成绩非数字拒绝的测试
- [x] 1.T.7 在 `tests/student.test.js` 编写多错误同时报告的测试
- [x] 1.T.8 运行 `npm test` 确认新增测试失败（Red 验证）
- [x] 1.T.9 实现 1.1-1.3 使测试通过（Green） — 19 passed（storage 9 + student 10）
- [x] 1.T.10 在测试保护下整理代码（Refactor）

## 2. 集成测试

- [x] 2.1 在 `tests/integration/cli-flow.test.js` 编写录入→存储→读取完整链路测试
- [x] 2.2 实现后运行确认通过（Green） — 5 passed

## 3. 回归验证

- [x] 3.1 运行 `npm test` 确认全部测试通过（28 passed）
- [x] 3.2 重读 proposal、design、specs 和 tasks，确认实现未越界且 artifacts 一致

---

# 测试检查清单

## 检查项

### 阶段一：Propose（规划阶段）

- [x] **测试策略已定义**：在 design.md 中说明了本 change 需要单元测试和集成测试
- [x] **测试任务已拆分**：tasks.md 中每个功能模块任务组都有对应的测试任务
- [x] **测试基础设施已确认**：无新增测试依赖

### 阶段二：Apply（实施阶段）

- [x] **TDD 顺序已遵守**：每个功能点执行了 Red → Green → Refactor
- [x] **单元测试已编写**：`tests/student.test.js` 已创建
- [x] **集成测试已编写**：`tests/integration/cli-flow.test.js` 已创建
- [x] **测试描述清晰**：每个 `it()` 描述读起来像一句完整的中文断言

### 阶段三：验证阶段

- [x] **全部测试通过**：运行 `npm test` 输出全部通过，零失败（28 passed）
- [x] **无测试作弊**：没有为了通过而修改测试期望值、没有 mock 掉核心业务逻辑

### 阶段四：归档阶段

- [ ] **测试文件已提交**：所有测试文件已纳入 git 版本控制（最终统一提交）
- [ ] **CI 脚本已更新**（如有）：package.json 的 test 脚本能正确运行新增测试
