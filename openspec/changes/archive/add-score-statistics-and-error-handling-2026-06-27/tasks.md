## 1. 统计功能实现

- [x] 1.1 实现 `src/student.js` 的 `calcStudentStats()` 函数
- [x] 1.2 实现 `src/student.js` 的 `calcClassStats()` 函数

## 1.T 统计功能测试

- [x] 1.T.1 在 `tests/student.test.js` 编写单学生总分和平均分计算测试（Red）
- [x] 1.T.2 在 `tests/student.test.js` 编写平均分保留1位小数测试（Red）
- [x] 1.T.3 在 `tests/student.test.js` 编写 null 学生返回 0 测试（Red）
- [x] 1.T.4 在 `tests/student.test.js` 编写成绩缺失作 0 处理测试（Red）
- [x] 1.T.5 在 `tests/student.test.js` 编写班级单科平均分测试（Red）
- [x] 1.T.6 在 `tests/student.test.js` 编写空数组班级统计返回 0 测试（Red）
- [x] 1.T.7 在 `tests/student.test.js` 编写 null 班级统计返回 0 测试（Red）
- [x] 1.T.8 运行测试确认新增 7 个测试失败（Red 验证）
- [x] 1.T.9 实现 1.1-1.2 使测试通过（Green） — 40 passed（+7 统计）

## 2. CLI 完整交互流程

- [ ] 2.1 实现 `src/main.js` 完整的 readline 菜单循环
- [ ] 2.2 实现录入交互子流程（逐项输入学号、姓名、三科成绩）
- [ ] 2.3 实现查询交互子流程（按学号查询 / 查看全部）
- [ ] 2.4 实现统计交互子流程（按学号查看统计 / 班级统计）
- [ ] 2.5 实现全局容错（非法菜单、非法成绩输入等场景）
- [ ] 2.6 确保录入后自动持久化

## 3. 回归验证

- [ ] 3.1 运行 `npm test` 确认全部测试通过
- [ ] 3.2 手动运行 `node src/main.js` 验证完整 CLI 交互流程
- [ ] 3.3 验证程序重启后数据不丢失
- [ ] 3.4 验证各种非法输入不会导致程序崩溃
- [ ] 3.5 重读 Change 4 的 proposal、design、specs 和 tasks，确认实现未越界

---

# 测试检查清单

## 检查项

### 阶段一：Propose（规划阶段）

- [x] **测试策略已定义**：在 design.md 中说明了本 change 需要单元测试
- [x] **测试任务已拆分**：tasks.md 中列出了统计功能的测试任务
- [x] **测试基础设施已确认**：无新增依赖

### 阶段二：Apply（实施阶段）

- [x] **TDD 顺序已遵守**：Red（7 个新增测试失败）→ Green（40 全部通过）
- [x] **单元测试已编写**：`tests/student.test.js` 新增 calcStudentStats 4 个 + calcClassStats 3 个
- [x] **测试描述清晰**：每个 `it()` 描述读起来像一句完整的中文断言

### 阶段三：验证阶段

- [ ] **全部测试通过**：运行 `npm test` 输出全部通过，零失败
- [ ] **手动验证完成**：手动运行 CLI 验证完整交互流程
- [x] **无测试作弊**：没有 mock 掉核心业务逻辑

### 阶段四：归档阶段

- [ ] **测试文件已提交**：测试文件纳入 git 版本控制
