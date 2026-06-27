# 学生成绩录入与校验规范

## ADDED Requirements

### Requirement: 学生信息录入
系统 SHALL 支持录入学号、姓名、语文/数学/英语三科成绩，校验通过后将学生信息添加到数据列表并返回操作结果。

#### Scenario: 合法学生信息录入成功
- **WHEN** 用户输入学号 `"2024001"`、姓名 `"张三"`、语文 `85`、数学 `92`、英语 `78`
- **AND** 学号在当前数据中不存在
- **THEN** `addStudent()` 返回 `{success: true, message: "学生信息录入成功", data: 学生对象}`
- **AND** 学生被添加到数据列表中

#### Scenario: 学号为空时拒绝录入
- **WHEN** 用户输入学号为 `""` 或只含空白字符
- **THEN** `addStudent()` 返回 `{success: false, message: "学号不能为空"}`
- **AND** 不会增加数据

#### Scenario: 学号重复时拦截
- **WHEN** 用户输入学号已存在于数据列表
- **THEN** `addStudent()` 返回 `{success: false, message: "该学号已存在，不允许重复录入"}`
- **AND** 不会新增重复数据

#### Scenario: 姓名为空时拒绝录入
- **WHEN** 用户输入姓名为 `""` 或只含空白字符
- **THEN** `addStudent()` 返回 `{success: false, message: "姓名不能为空"}`
- **AND** 不会增加数据

#### Scenario: 成绩超出范围时拒绝录入
- **WHEN** 用户输入语文/数学/英语任意一科成绩小于 0 或大于 100
- **THEN** `addStudent()` 返回 `{success: false, message: "成绩必须在0-100之间"}`
- **AND** 不会增加数据

#### Scenario: 成绩为非数字时拒绝录入
- **WHEN** 用户输入语文/数学/英语任意一科为 `"abc"`、`null`、`undefined` 或 `NaN`
- **THEN** `addStudent()` 返回 `{success: false, message: "成绩必须为有效数字"}`
- **AND** 不会增加数据

### Requirement: 学生数据校验
系统 SHALL 提供独立的 `validateStudent()` 函数，返回校验结果对象，包含是否通过和错误列表。

#### Scenario: 校验通过
- **WHEN** 学生信息所有字段合法
- **THEN** `validateStudent()` 返回 `{valid: true, errors: []}`

#### Scenario: 校验失败时列出所有错误
- **WHEN** 学生信息有多项不合法（如学号为空且成绩越界）
- **THEN** `validateStudent()` 返回 `{valid: false, errors: ["学号不能为空", "成绩必须在0-100之间"]}`

## Testing Notes

- 单元测试：`tests/student.test.js` 覆盖 `addStudent()` 的 6 个场景和 `validateStudent()` 的 2 个场景。
- 集成测试：`tests/integration/cli-flow.test.js` 覆盖录入到存储的完整链路。
- 测试使用临时数据目录，隔离实际数据文件。
- 不 mock 存储引擎，使用真实文件读写。
