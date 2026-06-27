## Context

当前项目已具备 JSON 文件存储能力（`src/storage.js`），但缺少业务逻辑层。本 change 引入 `src/student.js` 作为业务逻辑模块，负责学生数据的录入和校验。

技术栈：Node.js ESM + Vitest。无外部依赖，纯逻辑模块。

## Directory Layout

```text
src/
  main.js                  — CLI 入口（修改，接入录入流程）
  storage.js               — 存储引擎（不变）
  student.js               — 学生管理模块（新建）
tests/
  storage.test.js          — 存储引擎测试（不变）
  student.test.js          — 学生管理单元测试（新建）
  integration/
    cli-flow.test.js       — 集成测试（新建）
data/
  students.json            — 数据文件
```

## Goals / Non-Goals

**Goals:**

- 实现 `addStudent(students, info)` 函数，添加学生并进行校验
- 实现 `validateStudent(student, students)` 函数，独立校验逻辑
- 学号非空唯一校验
- 姓名为空校验
- 三科成绩 0-100 范围和数字类型校验
- 重复学号拦截
- 返回统一结构的操作结果 `{success, message, data}`

**Non-Goals:**

- 不实现成绩查询（Change 3）
- 不实现成绩统计（Change 4）
- 不修改存储引擎

## Decisions

### 1. 校验与添加逻辑分离

`validateStudent()` 独立于 `addStudent()`，返回 `{valid, errors}` 结构。

原因：分离后校验函数可被 CLI 层单独调用做预检，也可被复用（如后续编辑功能）。`addStudent()` 内部调用 `validateStudent()` 再执行添加。

### 2. 统一操作结果结构

所有操作返回 `{success: boolean, message: string, data: any}`。

原因：CLI 层可以统一处理结果展示（成功绿色输出、失败红色提示），降低交互层的复杂度。

### 3. 成绩存储为整数

校验阶段确保成绩为 0-100 的整数，拒绝浮点数和小数。

原因：考试场景中成绩通常为整数，简化校验规则。需求要求"0-100有效数字"。

替代方案：接受小数。会增加校验复杂度，考试需求未明确要求。

### 4. 学号格式不做约束，仅校验非空和唯一

学号接受任意字符串，只校验非空和唯一性。

原因：不同学校学号格式差异大（数字、带字母的都有），不做格式约束保持灵活性。需求未明确学号格式要求。

## Data Model

```json
// 输入
{
  "id": "2024001",
  "name": "张三",
  "chinese": 85,
  "math": 92,
  "english": 78
}

// 操作结果
{
  "success": true,
  "message": "学生信息录入成功",
  "data": { "id": "2024001", "name": "张三", "chinese": 85, "math": 92, "english": 78 }
}
```

## Risks / Trade-offs

- [Risk] 校验函数与 CLI 耦合方式不明确。Mitigation: 业务函数返回结构化结果，CLI 层只负责展示，不耦合业务逻辑。
- [Risk] 用户输入可能包含首尾空格。Mitigation: 校验时对字符串字段执行 `.trim()`。

## 测试架构设计

- `tests/student.test.js`: 覆盖 `addStudent()` 正向、学号为空、学号重复、姓名为空、成绩越界、成绩非数字等场景；覆盖 `validateStudent()` 的所有校验项。
- `tests/integration/cli-flow.test.js`: 覆盖录入后数据写入存储、再读回保持一致的完整链路。
- 需要 mock：无（使用临时测试目录隔离数据文件）
- 不需要 mock：存储引擎、校验函数

## Open Questions

- 录入时是否需要学号格式正则校验（如"必须是数字"）？本 change 仅校验非空和唯一，不做格式约束，后续如需添加学号格式可在新 change 中实现。
- 是否需要支持批量录入？首版每轮录入一个学生，后续可按需扩展。
