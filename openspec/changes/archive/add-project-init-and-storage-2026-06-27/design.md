## Context

本项目为简易学生成绩管理系统 CLI 应用，使用 Node.js + 本地 JSON 文件存储。用户通过命令行交互完成学生成绩的录入、查询、统计等操作。本 change 是第一个迭代，负责搭建项目基础设施和文件持久化能力。

当前从零开始，技术选型：Node.js ESM 模块（`"type": "module"`）、Vitest 测试框架、JSON 文件存储。

## Directory Layout

```text
student-score-system/
  package.json               — 项目配置与依赖
  src/
    main.js                  — CLI 交互入口（一级菜单骨架）
    storage.js               — JSON 文件存储引擎
  data/
    students.json            — 学生成绩持久化文件（初始空数组）
  tests/
    storage.test.js          — 存储引擎单元测试
  spec/
    task.md                  — 项目任务清单
    design.md                — 项目架构设计
    spec.md                  — 核心规范文档
    config.md                — 配置文档
  openspec/
    config.yaml              — OpenSpec 框架配置
    testing-strategy.md      — 测试策略规范
    changes/
      add-project-init-and-storage-2026-06-27/
        proposal.md
        design.md
        specs/storage-engine/spec.md
        tasks.md
    templates/
      testing-checklist.md   — 测试检查清单模板
```

## Goals / Non-Goals

**Goals:**

- 完成项目规范化初始化（目录结构、package.json、依赖安装）
- 实现 JSON 文件存储引擎，支持读取、写入、初始化
- 创建初始数据文件 `data/students.json`
- 编写存储引擎单元测试（TDD 流程）
- 搭建 CLI 入口骨架（一级菜单框架，功能暂为占位）

**Non-Goals:**

- 不实现学生成绩录入、查询、统计等业务功能（后续 change）
- 不实现 CLI 完整交互流程
- 不涉及数据校验逻辑

## Decisions

### 1. 使用 JSON 文件作为数据持久化方案

学生数据存储在 `data/students.json`，每次操作后自动写入文件。

原因：考题要求"轻量文件数据库"，JSON 文件方案无需额外数据库安装，适合考试场景的快速搭建和验证。Node.js 原生 `fs` 模块即可完成读写，零外部依赖。

替代方案：SQLite。需要额外安装 `better-sqlite3` 原生模块，增加环境复杂度。

### 2. 使用 ESM 模块（`"type": "module"`）

项目使用 ES Module 导入导出语法。

原因：现代 Node.js 标准，与当前主流生态一致；Vitest 原生支持 ESM。

替代方案：CommonJS。更传统但不如 ESM 现代化。

### 3. 存储引擎设计为独立模块

`src/storage.js` 导出 `loadStudents()`、`saveStudents(data)`、`initStorage()` 三个函数，不依赖其他业务模块。

原因：存储层与业务逻辑解耦，可独立测试、独立替换。后续 change 可放心扩展业务逻辑而不影响存储引擎。

### 4. 数据文件自动初始化

`loadStudents()` 在文件不存在时自动创建 `data/students.json` 并初始化为空数组 `[]`，不抛出异常。

原因：首次运行时不存在数据文件，自动初始化降低用户操作门槛。设计为返回空数组而非报错，符合"默认无数据"的直觉。

### 5. 同步读写 vs 异步读写

首版使用同步 `fs.readFileSync` / `fs.writeFileSync`。

原因：CLI 应用每次操作后需要立即确认持久化结果，同步读写代码更简洁，且 CLI 工具无需处理高并发场景。

替代方案：异步 `fs.promises`。更符合 Node.js 最佳实践，但对 CLI 工具而言增加代码复杂度（async/await 传染），且无实际性能收益。

## Data Model

```json
[
  {
    "id": "2024001",
    "name": "张三",
    "chinese": 85,
    "math": 92,
    "english": 78
  }
]
```

- `id`: 学号，字符串，非空唯一
- `name`: 姓名，字符串，非空
- `chinese`: 语文成绩，0-100 整数
- `math`: 数学成绩，0-100 整数
- `english`: 英语成绩，0-100 整数

## Risks / Trade-offs

- [Risk] JSON 文件可能因手动编辑或磁盘故障损坏。Mitigation: 写入前做 JSON 序列化校验，读取时做格式校验并给出清晰错误提示。
- [Risk] 并发写入可能导致数据丢失。Mitigation: CLI 单用户场景，不存在并发问题；后续如需多用户可升级为 SQLite。
- [Risk] 文件权限问题导致读写失败。Mitigation: 读写操作捕获异常并输出中文错误提示，告知用户检查文件权限。

## Migration Plan

无（本 change 为初始搭建，无迁移需求）

Rollback：删除 `student-score-system/` 目录即可完全回退。

## 测试架构设计

- `tests/storage.test.js`: 覆盖 `loadStudents()` 返回空数组、`saveStudents()` 写入后 `loadStudents()` 读取一致、文件不存在时自动初始化、覆盖写入已存在数据等场景。
- 需要 mock：无（直接操作临时测试文件）
- 不需要 mock：`fs` 模块操作实际文件

## Open Questions

- 数据文件损坏时的恢复策略是什么？本 change 默认检测到 JSON 解析失败时返回空数组并提示用户。
- 是否需要数据备份功能？首版不做自动备份，用户可手动复制 `data/students.json` 进行备份。
