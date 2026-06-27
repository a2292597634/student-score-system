# 成绩统计与全局容错规范

## ADDED Requirements

### Requirement: 单学生成绩统计
系统 SHALL 支持计算单个学生的总分（语文+数学+英语）和平均分（总分/3，保留1位小数）。

#### Scenario: 正常学生成绩统计
- **WHEN** 传入学生 `{chinese: 85, math: 92, english: 78}`
- **THEN** `calcStudentStats()` 返回 `{total: 255, average: 85.0}`

#### Scenario: 有小数平均分时正确保留一位
- **WHEN** 传入学生 `{chinese: 85, math: 90, english: 78}`
- **THEN** `calcStudentStats()` 返回 `{total: 253, average: 84.3}`

#### Scenario: 学生对象为 null 时返回 0
- **WHEN** 传入 `null` 或 `undefined`
- **THEN** `calcStudentStats()` 返回 `{total: 0, average: 0}`

### Requirement: 班级单科平均分统计
系统 SHALL 支持计算全班语文、数学、英语的单科平均分（保留1位小数）。

#### Scenario: 正常班级统计
- **WHEN** 班上有 3 名学生，语文分别为 80, 90, 100
- **THEN** `calcClassStats()` 返回 `{chinese: 90.0, math: ..., english: ...}`

#### Scenario: 无学生时返回全 0
- **WHEN** 传入空数组 `[]`
- **THEN** `calcClassStats()` 返回 `{chinese: 0, math: 0, english: 0}`

### Requirement: CLI 全局容错
系统 SHALL 对所有 CLI 交互入口进行输入校验，确保非法输入不导致程序崩溃。

#### Scenario: 菜单选择非数字
- **WHEN** 用户在主菜单输入非数字字符（如 `"abc"`）
- **THEN** 系统显示"请输入有效数字（1-5）"并重新显示菜单

#### Scenario: 菜单选择超出范围
- **WHEN** 用户输入 `0` 或 `6`
- **THEN** 系统显示"请输入有效数字（1-5）"并重新显示菜单

#### Scenario: 录入成绩时输入非数字
- **WHEN** 用户在录入成绩时输入 `"abc"`
- **THEN** 系统显示"成绩必须为有效数字，请重新输入"并重新请求输入

### Requirement: 自动持久化
系统 SHALL 在每次数据变更操作后自动将数据写入文件。

#### Scenario: 录入后立即保存
- **WHEN** `addStudent()` 返回 `success: true`
- **THEN** 系统立即调用 `saveStudents()` 将数据写入 `data/students.json`
- **AND** 程序重启后数据不丢失

## Testing Notes

- 单元测试：`tests/student.test.js` 新增 `calcStudentStats()` 和 `calcClassStats()` 的正向和边界测试。
- 集成测试：`tests/integration/cli-flow.test.js` 已有持久化链路覆盖。
- CLI 交互测试：CLI 输入验证逻辑通过单元测试覆盖，不依赖真实终端交互。
