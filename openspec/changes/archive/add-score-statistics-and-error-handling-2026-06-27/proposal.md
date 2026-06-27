## Why

前三个 Change 已完成存储、录入校验、查询功能，但系统还缺少成绩统计分析能力。教务人员需要查看单个学生的总分和平均分，以及班级各科的整体表现。同时，所有 CLI 交互入口需要全局容错保护，防止非法输入导致程序崩溃。最后，需要确保每次数据变更后自动持久化到文件，程序重启后数据不丢失。

本 change 作为收尾迭代，以 TDD 方式从零实现统计能力、全局容错和自动持久化，使系统达到可交付的完整状态。

## What Changes

- 完善 `src/student.js` 中 `calcStudentStats()` 和 `calcClassStats()` 的实现
- 实现完整的 CLI 交互流程（readline 一级菜单 + 各功能子菜单）
- 全局容错处理：非法菜单选择、非法文字输入、空数据操作的友好提示
- 确保所有数据变更操作自动调用 `saveStudents()` 持久化
- 更新 `src/main.js`，串接完整的 CLI 交互流程
- 编写统计与容错单元测试

## Capabilities

### New Capabilities

- `score-statistics`: 单学生总分/平均分计算、班级单科平均分统计
- `error-handling`: 全局容错处理，非法输入友好提示
- `auto-persistence`: 所有数据变更自动持久化
- `cli-full-flow`: 完整 CLI 交互流程

## Dependencies

- `add-student-query-2026-06-27`：依赖查询功能
- `add-student-entry-and-validation-2026-06-27`：依赖录入功能
- `add-project-init-and-storage-2026-06-27`：依赖存储引擎

## Impact

- `src/student.js`: 修改完善（统计函数已在 Change 2 预埋，确认正确性）
- `src/main.js`: 大幅修改，实现完整的 readline 交互流程
- `tests/student.test.js`: 新增统计和容错测试用例
- `tests/integration/cli-flow.test.js`: 已有持久化测试（Change 2 已覆盖）

## 测试策略

依据 `openspec/testing-strategy.md`，本 change 涉及统计计算和 CLI 流程，需覆盖单元测试和集成测试。

- 单元测试：`tests/student.test.js` 新增 `calcStudentStats()` 和 `calcClassStats()` 正向和边界场景测试。
- 集成测试：`tests/integration/cli-flow.test.js` 已有持久化链路测试覆盖。
- 回归验证：完成后运行 `npm test` 确认全部测试通过。

## Success Criteria

- 单学生总分 = 语文 + 数学 + 英语，计算结果正确
- 单学生平均分 = 总分 / 3，保留 1 位小数
- 班级单科平均分 = 该科总分 / 学生人数，保留 1 位小数
- 无学生数据时统计返回 0
- CLI 菜单输入非 1-5 时给出提示并重新选择
- 成绩录入输入非数字时给出提示并重新输入
- 所有录入操作后数据自动持久化，程序重启后数据不丢失
- 任何异常不导致程序崩溃
- 所有测试通过
