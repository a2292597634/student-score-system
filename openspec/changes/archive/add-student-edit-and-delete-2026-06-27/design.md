## Context

当前 `src/student.js` 已有 `addStudent`、`findStudent`、`listStudents`、`calcStudentStats`、`calcClassStats` 函数。本 change 新增 `updateStudent`（按学号修改）和 `deleteStudent`（按学号删除），补全 CRUD 能力。

修改操作允许部分更新：仅修改用户提供的字段，未提供的字段保持不变。删除操作需返回被删学生信息，CLI 层做确认后执行。

## Directory Layout

```text
src/
  main.js            — CLI 入口（修改，查询后增加修改/删除入口）
  student.js         — 新增 updateStudent / deleteStudent
tests/
  student.test.js    — 新增修改和删除测试用例
```

## Goals / Non-Goals

**Goals:**
- 支持按学号修改学生姓名和各科成绩（部分字段可选更新）
- 支持按学号删除学生
- 操作后自动持久化
- 异常场景友好提示

**Non-Goals:**
- 不支持批量删除
- 不支持修改学号（学号是唯一标识）

## Decisions

### 1. 修改采用部分更新策略

`updateStudent(students, id, fields)` 仅更新 `fields` 中提供的字段，其余保持不变。修改后仍需通过完整校验。

原因：用户可能只想改一科成绩而不影响其他字段，部分更新比全量替换更友好。

### 2. 删除返回被删学生，由 CLI 层确认

`deleteStudent(students, id)` 先查找被删学生，返回其信息。CLI 层展示信息并请用户确认后再执行实际删除。

原因：防止误删，保留被删信息用于可能的撤销提示。

### 3. 修改后的数据仍需通过校验

修改后的学生数据需要经过 `validateStudent` 校验（排除自身学号去重检查）。

原因：防止修改后的数据不合法（如成绩超范围）。

## Risks / Trade-offs

- [Risk] 部分更新可能导致姓名被设为空字符串绕过校验。Mitigation: 修改后统一走 `validateStudent` 验证。

## Open Questions

- 是否需要修改学号？本 change 默认学号不可修改（作为唯一标识），后续如需可扩展。
- 删除后是否需要"撤销"功能？首版不做，删除前确认对话框即可满足基本防误删需求。
