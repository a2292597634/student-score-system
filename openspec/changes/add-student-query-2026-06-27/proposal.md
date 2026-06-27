## Why

学生录入功能已就绪，但教务人员需要能够查询已录入的学生成绩。查询能力是日常使用中最高频的操作，需要支持按学号精准查询单个学生和批量查看全部学生两种模式。当数据为空或学号不存在时需要给出友好的中文提示，而非报错或空白。

本 change 将实现查询功能及其测试，核心逻辑（`findStudent`、`listStudents`）将在本 change 中以 TDD 方式从零实现。

## What Changes

- 新增 `src/student.js` 中 `findStudent()` 和 `listStudents()` 函数
- 更新 `src/main.js` 的查询交互流程
- 编写查询功能单元测试
- 编写查询异常场景测试

## Capabilities

### New Capabilities

- `student-query`: 学号精准查询、全部学生列表、异常友好提示

## Dependencies

- `add-student-entry-and-validation-2026-06-27`：依赖学生管理模块的基础函数

## Impact

- `src/student.js`: 修改完善（查询函数已在 Change 2 预埋，本 change 确保完整）
- `src/main.js`: 修改，接入查询交互流程
- `tests/student.test.js`: 修改，新增查询相关测试用例
- `tests/integration/cli-flow.test.js`: 已有查询相关测试（Change 2 已覆盖）

## 测试策略

依据 `openspec/testing-strategy.md`，本 change 涉及查询功能，需覆盖单元测试。

- 单元测试：`tests/student.test.js` 新增 `findStudent()` 和 `listStudents()` 正常和异常场景测试。
- 回归验证：完成后运行 `npm test` 确认全部测试通过。

## Success Criteria

- 按学号可精准查询到学生完整信息（学号、姓名、三科成绩）
- 学号不存在时返回提示"未找到学号为 xxx 的学生"
- 无任何录入数据时返回提示"暂无学生数据，请先录入"
- 查询结果在命令行友好展示
- 所有测试通过
