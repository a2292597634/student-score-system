## Why

系统已支持录入、查询、统计功能，但教务人员在实际使用中可能录错学生信息或需要移除已毕业/转学的学生。当前没有修改和删除能力，一旦录入错误只能通过手动编辑 `data/students.json` 文件来修正，不符合"全流程管理"的目标。

本 change 将新增按学号修改学生信息和删除学生记录的功能。

## What Changes

- `src/student.js` 新增 `updateStudent()` 和 `deleteStudent()` 函数
- `src/main.js` 在查询结果中增加修改和删除入口
- `tests/student.test.js` 新增修改和删除测试用例

## Capabilities

### New Capabilities

- `student-edit`: 按学号修改学生姓名和成绩
- `student-delete`: 按学号删除学生记录（需确认）

## Dependencies

- `add-score-statistics-and-error-handling-2026-06-27`：依赖已有的查询和存储能力

## Impact

- `src/student.js`: 修改，新增 `updateStudent()` 和 `deleteStudent()` 函数
- `src/main.js`: 修改，查询结果中增加修改/删除操作入口
- `tests/student.test.js`: 修改，新增修改和删除测试用例

## 测试策略

依据 `openspec/testing-strategy.md`，本 change 涉及增删改查中的改和删，需覆盖单元测试。

- 单元测试：`tests/student.test.js` 新增 `updateStudent()` 和 `deleteStudent()` 的正向和异常场景。
- 回归验证：完成后运行 `npm test` 确认全部测试通过。

## Success Criteria

- 可通过学号修改学生的姓名和任意科目成绩
- 修改不存在的学号时给出友好提示
- 可通过学号删除学生记录，删除前需用户确认
- 删除不存在学号时给出友好提示
- 修改和删除操作自动持久化
- 所有测试通过
