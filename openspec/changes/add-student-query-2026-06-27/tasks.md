## 1. 查询功能完善

- [ ] 1.1 确认 `src/student.js` 中 `findStudent()` 和 `listStudents()` 实现完整
- [ ] 1.2 更新 `src/main.js`，接入查询交互流程

## 1.T 查询功能测试

- [ ] 1.T.1 在 `tests/student.test.js` 编写学号精准查询成功的测试（Red）
- [ ] 1.T.2 在 `tests/student.test.js` 编写学号不存在提示的测试（Red）
- [ ] 1.T.3 在 `tests/student.test.js` 编写空数据查询提示的测试（Red）
- [ ] 1.T.4 在 `tests/student.test.js` 编写全部列表查询测试（Red）
- [ ] 1.T.5 在 `tests/student.test.js` 编写空列表提示测试（Red）
- [ ] 1.T.6 运行测试确认新增失败（Red），实现后通过（Green）

## 2. 回归验证

- [ ] 2.1 运行 `npm test` 确认全部测试通过
- [ ] 2.2 重读 proposal、design、specs 和 tasks，确认实现未越界

---

# 测试检查清单

## 检查项

### 阶段一：Propose（规划阶段）

- [ ] **测试策略已定义**：在 design.md 中说明了本 change 需要单元测试
- [ ] **测试任务已拆分**：tasks.md 中列出了查询功能的测试任务
- [ ] **测试基础设施已确认**：无新增依赖

### 阶段二：Apply（实施阶段）

- [ ] **TDD 顺序已遵守**：先写测试 → 确认 Red → 实现 → Green → Refactor
- [ ] **单元测试已编写**：`tests/student.test.js` 已新增查询测试用例
- [ ] **测试描述清晰**：每个 `it()` 描述读起来像一句完整的中文断言

### 阶段三：验证阶段

- [ ] **全部测试通过**：运行 `npm test` 输出全部通过，零失败
- [ ] **无测试作弊**：没有 mock 掉核心业务逻辑

### 阶段四：归档阶段

- [ ] **测试文件已提交**：测试文件纳入 git 版本控制
