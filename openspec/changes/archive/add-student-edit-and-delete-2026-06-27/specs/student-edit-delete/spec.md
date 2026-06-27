# 学生修改与删除规范

## ADDED Requirements

### Requirement: 修改学生信息
系统 SHALL 支持通过学号修改已有学生的姓名和成绩，未提供的字段保持原值不变。

#### Scenario: 修改姓名成功
- **WHEN** 存在学号为 `"001"` 的学生
- **AND** 用户提供新姓名 `"张三丰"`
- **THEN** `updateStudent()` 返回 `{success: true, message: "学生信息修改成功", data: 更新后的学生对象}`
- **AND** 学生姓名更新为新值，成绩保持不变

#### Scenario: 修改部分成绩成功
- **WHEN** 用户只提供数学成绩 `95`
- **AND** 不提供其他字段
- **THEN** 数学成绩更新为 95，语文和英语保持原值不变

#### Scenario: 学号不存在时拒绝修改
- **WHEN** 修改的学号在系统中不存在
- **THEN** 返回 `{success: false, message: "未找到学号为 xxx 的学生"}`
- **AND** 数据不受影响

#### Scenario: 修改后数据不合法时拒绝
- **WHEN** 修改后的成绩超出 0-100 范围
- **THEN** 返回 `{success: false, message: "成绩必须在0-100之间"}`
- **AND** 原数据保持不变

### Requirement: 删除学生记录
系统 SHALL 支持通过学号删除学生记录，删除后数据自动持久化。

#### Scenario: 删除成功
- **WHEN** 存在学号为 `"001"` 的学生
- **AND** 用户确认删除
- **THEN** `deleteStudent()` 返回 `{success: true, message: "学生信息删除成功", data: 被删学生对象}`
- **AND** 该学号从数据列表中移除

#### Scenario: 学号不存在时拒绝删除
- **WHEN** 删除的学号在系统中不存在
- **THEN** 返回 `{success: false, message: "未找到学号为 xxx 的学生"}`
- **AND** 数据不受影响

#### Scenario: 数据为空时拒绝删除
- **WHEN** 当前没有任何学生数据
- **THEN** 返回 `{success: false, message: "暂无学生数据，请先录入"}`
- **AND** 数据不受影响

## Testing Notes

- 单元测试：`tests/student.test.js` 新增 `updateStudent()` 4 个场景、`deleteStudent()` 3 个场景。
- 回归验证：`npm test` 确认全部测试通过。
