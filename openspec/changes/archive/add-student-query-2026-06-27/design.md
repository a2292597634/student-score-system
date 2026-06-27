## Context

查询模块核心函数（`findStudent`、`listStudents`）将在本 change 中以 TDD 方式从零实现：先写测试（Red），再写最小实现（Green），最后重构（Refactor）。

## Directory Layout

```text
src/
  main.js              — CLI 入口（修改，接入查询交互菜单）
  student.js           — 学生管理模块（修改，新增查询函数）
tests/
  student.test.js      — 新增查询场景测试
  integration/
    cli-flow.test.js   — 已有查询集成测试
```

## Goals / Non-Goals

**Goals:**

- 完善学号精准查询功能
- 完善全部学生列表查询功能
- 异常场景友好中文提示
- 补齐查询测试覆盖

**Non-Goals:**

- 不支持模糊搜索、姓名搜索（保持简单）
- 不改变存储引擎和其他模块

## Risks / Trade-offs

- [Risk] 查询结果展示格式不统一。Mitigation: 统一使用表格形式展示。
- [Risk] CLI 交互代码与业务逻辑耦合。Mitigation: CLI 层仅负责输入输出，业务函数返回结构化结果。

## Open Questions

- 是否需要支持按姓名查询？本 change 仅支持学号精准查询，后续可按需扩展。
- 学生列表是否需要分页展示？首版不分页，数据量通常较小。
