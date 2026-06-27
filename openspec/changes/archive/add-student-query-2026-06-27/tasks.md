## 1. 查询功能实现

- [x] 1.1 实现 `src/student.js` 的 `findStudent()` 函数
- [x] 1.2 实现 `src/student.js` 的 `listStudents()` 函数

## 1.T 查询功能测试

- [x] 1.T.1 在 `tests/student.test.js` 编写学号精准查询成功的测试（Red）
- [x] 1.T.2 在 `tests/student.test.js` 编写学号不存在提示的测试（Red）
- [x] 1.T.3 在 `tests/student.test.js` 编写空数据查询提示的测试（Red）
- [x] 1.T.4 在 `tests/student.test.js` 编写学号为空提示的测试（Red）
- [x] 1.T.5 在 `tests/student.test.js` 编写全部列表查询测试（Red）
- [x] 1.T.6 在 `tests/student.test.js` 编写空列表提示测试（Red）
- [x] 1.T.7 运行测试确认新增 6 个测试失败（Red 验证）
- [x] 1.T.8 实现 1.1-1.2 使测试通过（Green） — 33 passed（+6 查询）

## 2. 回归验证

- [x] 2.1 运行 `npm test` 确认全部测试通过（33 passed）
- [x] 2.2 重读 proposal、design、specs 和 tasks，确认实现未越界

---

# 测试检查清单

## 检查项

### 阶段一：Propose（规划阶段）

- [x] **测试策略已定义**：在 design.md 中说明了本 change 需要单元测试
- [x] **测试任务已拆分**：tasks.md 中列出了查询功能的测试任务
- [x] **测试基础设施已确认**：无新增依赖

### 阶段二：Apply（实施阶段）

- [x] **TDD 顺序已遵守**：Red（6 个新增测试失败）→ Green（全部 33 通过）→ Refactor
- [x] **单元测试已编写**：`tests/student.test.js` 新增 findStudent 4 个 + listStudents 2 个
- [x] **测试描述清晰**：每个 `it()` 描述读起来像一句完整的中文断言

### 阶段三：验证阶段

- [x] **全部测试通过**：运行 `npm test` 输出全部通过，零失败（33 passed）
- [x] **无测试作弊**：没有 mock 掉核心业务逻辑

### 阶段四：归档阶段

- [x] **测试文件已提交**
