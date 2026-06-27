# 项目架构设计

## 一、整体架构

```
┌─────────────────────────────────────────────────┐
│                   CLI 入口层                      │
│                 src/main.js                      │
│   ┌──────────┬──────────┬──────────┬──────────┐  │
│   │ 录入成绩  │ 查询成绩  │ 成绩统计  │ 查看全部  │  │
│   └────┬─────┴────┬─────┴────┬─────┴────┬─────┘  │
├────────┼──────────┼──────────┼──────────┼────────┤
│        │          │          │          │        │
│   ┌────▼──────────▼──────────▼──────────▼────┐   │
│   │           业务逻辑层                        │   │
│   │          src/student.js                   │   │
│   │  - addStudent()    录入学生               │   │
│   │  - findStudent()   精准查询               │   │
│   │  - listStudents()  列表查询               │   │
│   │  - calcStats()     成绩统计               │   │
│   │  - updateStudent() 修改学生               │   │
│   │  - deleteStudent() 删除学生               │   │
│   │  - validate()      数据校验               │   │
│   └────────────────┬──────────────────────────┘   │
│                    │                               │
│   ┌────────────────▼──────────────────────────┐   │
│   │           数据持久化层                       │   │
│   │          src/storage.js                    │   │
│   │  - loadStudents()    读取数据              │   │
│   │  - saveStudents()    写入数据              │   │
│   │  - initStorage()     初始化存储             │   │
│   └────────────────┬──────────────────────────┘   │
│                    │                               │
│   ┌────────────────▼──────────────────────────┐   │
│   │           数据文件                           │   │
│   │     data/students.json (JSON)              │   │
│   └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 二、核心函数设计

### 2.1 存储引擎（src/storage.js）

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `loadStudents()` | 无 | `Array` | 读取 students.json，不存在则初始化 |
| `saveStudents(data)` | `Array` | `void` | 将数据写入 students.json |
| `initStorage()` | 无 | `void` | 确保 data/ 目录和文件存在 |

### 2.2 学生管理（src/student.js）

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `addStudent(students, info)` | `Array, Object` | `{success, message, data}` | 添加学生，含校验和去重 |
| `findStudent(students, id)` | `Array, String` | `{success, message, data}` | 按学号精准查询 |
| `listStudents(students)` | `Array` | `{success, message, data}` | 获取全部学生列表 |
| `calcStudentStats(student)` | `Object` | `{total, average}` | 计算单个学生总分和平均分 |
| `calcClassStats(students)` | `Array` | `{chinese, math, english}` | 计算班级各科平均分 |
| `updateStudent(students, id, fields)` | `Array, String, Object` | `{success, message, data}` | 按学号修改学生信息（部分更新） |
| `deleteStudent(students, id)` | `Array, String` | `{success, message, data}` | 按学号删除学生记录 |
| `validateStudent(student, students)` | `Object, Array` | `{valid, errors}` | 校验学生数据合法性 |

### 2.3 CLI 入口（src/main.js）

一级菜单结构：
```
=== 学生成绩管理系统 ===
1. 录入成绩
2. 查询成绩
3. 成绩统计
4. 查看全部
5. 退出系统
请选择操作（1-5）：
```

## 三、数据结构设计

### 3.1 学生对象（Student）

```json
{
  "id": "2024001",
  "name": "张三",
  "chinese": 85,
  "math": 92,
  "english": 78
}
```

### 3.2 操作结果（Result）

```json
{
  "success": true,
  "message": "学生信息录入成功",
  "data": {...}
}
```

## 四、迭代功能模块拆分

### Change 1: 项目初始化与数据持久化
- 项目目录结构搭建
- JSON 文件存储引擎
- CLI 入口骨架

### Change 2: 学生成绩录入与数据校验
- 学生信息录入（学号、姓名、三科成绩）
- 数据校验（学号非空唯一、成绩0-100）
- 重复学号拦截
- CLI 录入交互

### Change 3: 学生成绩查询能力
- 学号精准查询
- 全部学生列表展示
- 异常友好提示
- CLI 查询交互

### Change 4: 成绩统计与全局容错优化
- 单学生总分/平均分
- 班级单科平均分
- 全局容错（非法输入、空数据等）
- 自动持久化确认
- CLI 统计交互

### Change 5: 学生信息修改与删除
- 按学号修改学生姓名/成绩（部分更新）
- 按学号删除学生记录（确认后删除）
- 修改后数据校验
- CLI 编辑/删除交互

## 五、交互逻辑设计

### CLI 交互原则
- 使用 readline 模块实现命令行交互
- 每步操作给出明确中文提示
- 输入错误给出具体错误原因
- 操作完成后返回主菜单
- 所有数据操作立即持久化
