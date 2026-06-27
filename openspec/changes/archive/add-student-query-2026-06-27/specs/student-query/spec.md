# 学生成绩查询规范

## ADDED Requirements

### Requirement: 学号精准查询
系统 SHALL 支持通过学号精确查询单个学生的完整信息（学号、姓名、语文/数学/英语成绩）。

#### Scenario: 学号存在时返回完整信息
- **WHEN** 用户输入已存在的学号
- **THEN** `findStudent()` 返回 `{success: true, message: "查询成功", data: 学生对象}`
- **AND** 学生对象包含 id、name、chinese、math、english 全部字段

#### Scenario: 学号不存在时友好提示
- **WHEN** 用户输入不存在的学号
- **THEN** `findStudent()` 返回 `{success: false, message: "未找到学号为 xxx 的学生"}`
- **AND** data 为 null

#### Scenario: 数据为空时提示先录入
- **WHEN** 当前没有任何学生数据
- **THEN** `findStudent()` 返回 `{success: false, message: "暂无学生数据，请先录入"}`
- **AND** data 为 null

### Requirement: 全部学生列表查询
系统 SHALL 支持查询全部已录入学生的成绩列表。

#### Scenario: 已有学生时返回完整列表
- **WHEN** 当前有已录入的学生
- **THEN** `listStudents()` 返回 `{success: true, message: "共有 N 名学生", data: 学生数组}`

#### Scenario: 无学生时友好提示
- **WHEN** 当前没有任何学生数据
- **THEN** `listStudents()` 返回 `{success: false, message: "暂无学生数据，请先录入"}`
- **AND** data 为空数组

## Testing Notes

- 单元测试：`tests/student.test.js` 新增 `findStudent()` 和 `listStudents()` 的正向和异常场景。
- 集成测试：`tests/integration/cli-flow.test.js` 已有查询异常场景覆盖（Change 2 已预埋）。
