## Why

存储引擎已就绪，但系统还不能录入学生数据。教务人员需要将学生成绩录入系统，录入过程中必须保证数据合法性（学号非空唯一、成绩在0-100范围内），重复学号需要自动拦截。没有这些校验，脏数据会导致后续查询和统计功能出错。

本 change 将实现学生成绩录入模块 `src/student.js`，包含完整的数据校验和重复拦截逻辑，并通过 TDD 保证代码质量。

## What Changes

- 新建 `src/student.js` 模块，实现 `addStudent()`、`validateStudent()` 函数
- 实现学号非空唯一校验
- 实现姓名为空校验
- 实现三科成绩 0-100 范围和数字类型校验
- 实现重复学号拦截
- 更新 `src/main.js`，接入录入流程
- 编写学生管理单元测试

## Capabilities

### New Capabilities

- `student-entry-and-validation`: 学生成绩录入与数据合法性校验

## Dependencies

- `add-project-init-and-storage-2026-06-27`：依赖存储引擎的数据读写能力

## Impact

- `src/student.js`: 新建，学生成绩管理模块（录入、校验）
- `src/main.js`: 修改，接入录入交互流程
- `tests/student.test.js`: 新建，学生管理单元测试
- `tests/integration/cli-flow.test.js`: 新建，集成测试（录入到存储完整链路）

## 测试策略

依据 `openspec/testing-strategy.md`，本 change 涉及新建模块和 CLI 流程变更，必须覆盖单元测试和集成测试。

- 单元测试：`tests/student.test.js` 覆盖 `addStudent()` 正向录入、各种校验失败场景、重复学号拦截。
- 集成测试：`tests/integration/cli-flow.test.js` 覆盖录入到存储的完整链路。
- 回归验证：完成后运行 `npm test` 确认全部测试通过。

## Success Criteria

- 合法学生数据录入成功，返回 `{success: true}`
- 学号为空时返回错误提示"学号不能为空"
- 学号重复时返回错误提示"该学号已存在，不允许重复录入"
- 姓名为空时返回错误提示"姓名不能为空"
- 成绩不在0-100范围内返回错误提示"成绩必须在0-100之间"
- 成绩为非数字返回错误提示"成绩必须为有效数字"
- 所有功能通过 TDD 流程，测试通过率100%
