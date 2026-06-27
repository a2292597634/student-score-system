# 存储引擎规范

## ADDED Requirements

### Requirement: JSON 文件数据读取
系统 SHALL 从 `data/students.json` 读取学生数据，解析为 JavaScript 数组返回；文件不存在时自动创建并初始化为空数组。

#### Scenario: 读取已有数据文件
- **WHEN** `data/students.json` 文件存在且包含合法 JSON 数组
- **THEN** `loadStudents()` 返回解析后的数组
- **AND** 数组内容与文件内容一致

#### Scenario: 文件不存在时自动初始化
- **WHEN** `data/students.json` 文件不存在
- **THEN** `loadStudents()` 自动创建 `data/` 目录和 `students.json` 文件
- **AND** 写入内容为 `[]`
- **AND** 返回空数组

#### Scenario: 文件内容为空时返回空数组
- **WHEN** `data/students.json` 文件存在但内容为空或只含空白字符
- **THEN** `loadStudents()` 返回空数组 `[]`

### Requirement: JSON 文件数据写入
系统 SHALL 将学生数据数组写入 `data/students.json` 文件，使用格式化 JSON（2 空格缩进）确保可读性。

#### Scenario: 写入学生数据
- **WHEN** `saveStudents(data)` 被调用且 `data` 为合法数组
- **THEN** `data/students.json` 被写入格式化 JSON 内容
- **AND** 后续 `loadStudents()` 返回相同的数据

#### Scenario: 覆盖已有数据
- **WHEN** `data/students.json` 已有数据且 `saveStudents(newData)` 被调用
- **THEN** 旧数据完全被新数据替换
- **AND** 文件仅包含新数据的 JSON 内容

### Requirement: 数据初始化
系统 SHALL 提供 `initStorage()` 函数，用于显式初始化数据存储目录和文件。

#### Scenario: 显式初始化
- **WHEN** `initStorage()` 被调用
- **THEN** 确保 `data/` 目录存在
- **AND** 确保 `data/students.json` 文件存在且为合法 JSON

## Testing Notes

- 单元测试：`tests/storage.test.js` 覆盖 `loadStudents()` 的三个场景和 `saveStudents()` 的两个场景。
- 测试使用临时目录隔离，避免污染项目实际数据文件。
- 每个测试用例前后清理临时目录，确保测试独立性。
