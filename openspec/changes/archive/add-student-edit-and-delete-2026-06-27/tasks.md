## 1. 修改与删除功能实现

- [x] 1.1 实现 `src/student.js` 的 `updateStudent(students, id, fields)` 函数
- [x] 1.2 实现 `src/student.js` 的 `deleteStudent(students, id)` 函数
- [x] 1.3 更新 `src/main.js`，查询后增加修改和删除操作入口

## 1.T 修改与删除功能测试

- [x] 1.T.1 在 `tests/student.test.js` 编写修改姓名成功的测试（Red）
- [x] 1.T.2 在 `tests/student.test.js` 编写部分更新成绩的测试（Red）
- [x] 1.T.3 在 `tests/student.test.js` 编写修改不存在学号的测试（Red）
- [x] 1.T.4 在 `tests/student.test.js` 编写修改后数据不合法的测试（Red）
- [x] 1.T.5 在 `tests/student.test.js` 编写删除成功的测试（Red）
- [x] 1.T.6 在 `tests/student.test.js` 编写删除不存在学号的测试（Red）
- [x] 1.T.7 在 `tests/student.test.js` 编写空数据删除的测试（Red）
- [x] 1.T.8 运行测试确认新增 7 个测试失败（Red 验证）
- [x] 1.T.9 实现 1.1-1.3 使测试全部通过（Green） — 47 passed
- [x] 1.T.10 在测试保护下整理代码（Refactor）

## 2. 回归验证

- [x] 2.1 运行 `npm test` 确认全部测试通过（47 passed）
- [x] 2.2 运行 `node scripts/check-test-coverage.js` 确认检查通过
- [x] 2.3 重读 proposal、design、specs 和 tasks，确认实现未越界

---

# 测试检查清单

## 检查项

### 阶段一：Propose（规划阶段）

- [x] **测试策略已定义**：在 design.md 中说明了本 change 需要单元测试
- [x] **测试任务已拆分**：tasks.md 中列出了修改和删除功能的测试任务
- [x] **测试基础设施已确认**：无新增依赖

### 阶段二：Apply（实施阶段）

- [x] **TDD 顺序已遵守**：Red（7 新增测试失败）→ Green（47 全部通过）
- [x] **单元测试已编写**：`tests/student.test.js` 新增 updateStudent 4 个 + deleteStudent 3 个
- [x] **测试描述清晰**：每个 `it()` 描述读起来像一句完整的中文断言

### 阶段三：验证阶段

- [x] **全部测试通过**：运行 `npm test` 输出全部通过，零失败（47 passed）
- [x] **覆盖率检查通过**：`node scripts/check-test-coverage.js` 所有检查通过
- [x] **无测试作弊**：没有 mock 掉核心业务逻辑

### 阶段四：归档阶段

- [ ] **测试文件已提交**：测试文件纳入 git 版本控制
