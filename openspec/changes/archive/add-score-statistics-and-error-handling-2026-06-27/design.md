## Context

统计函数（`calcStudentStats`、`calcClassStats`）将在本 change 中以 TDD 方式从零实现：先写测试（Red），再写最小实现（Green），最后重构（Refactor）。

CLI 交互使用 Node.js 内置 `readline` 模块，采用异步循环结构：显示菜单 → 读取用户输入 → 路由到对应功能 → 操作完成后返回菜单。

## Directory Layout

```text
src/
  main.js            — CLI 入口（大幅修改，完整 readline 交互）
  student.js         — 统计函数（已实现，本 change 确认完整性）
  storage.js         — 存储引擎（不变）
tests/
  student.test.js    — 新增统计测试用例
  integration/
    cli-flow.test.js — 已有持久化测试
```

## Goals / Non-Goals

**Goals:**
- 单学生总分、平均分计算
- 班级单科平均分统计
- 完整 CLI 交互流程（录入、查询、统计、查看全部、退出）
- 全局容错（非法输入不崩溃，友好重试）
- 自动持久化确认

**Non-Goals:**
- 不做成绩排名
- 不做成绩分布直方图
- 不做导出功能

## Decisions

### 1. CLI 使用 readline 异步循环

使用 `readline.createInterface` + `question()` 方法实现菜单循环。

原因：Node.js 内置模块，零外部依赖，适合简单 CLI 工具。异步设计确保用户输入不被阻塞。

### 2. 每个操作后自动持久化

录入成功后立即调用 `saveStudents(students)`。

原因：用户不需要记住"保存"这个额外步骤。每次操作后数据就落盘了。

### 3. 全局容错策略：捕获不崩，提示重试

非法输入统一用 try-catch 或条件判断拦截，输出中文提示后回到菜单或重新请求输入。

原因：CLI 工具面向教务人员（非技术用户），程序崩溃会丢失未保存数据且体验极差。

### 4. 统计精度：保留 1 位小数

使用 `Math.round(value * 10) / 10` 保留一位小数。

原因：考试分数通常为整数，平均分保留一位小数足够精确且展示简洁。

## Risks / Trade-offs

- [Risk] readline 在 Windows 终端可能有编码问题（中文输入/输出）。Mitigation: 使用 UTF-8 编码，必要时设置 `chcp 65001`。
- [Risk] 同步 readline question 在循环中可能造成回调地狱。Mitigation: 使用 `node:readline/promises` 的 `question()` 配合 async/await。

## Open Questions

- 是否需要按学生排名展示？本 change 只做统计计算不做排名，后续可按需扩展。
- 统计结果是否需要持久化？统计数据从已有学生数据实时计算，不单独保存。
