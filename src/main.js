/**
 * CLI 交互入口
 * 学生成绩管理系统主菜单
 * Change 2：接入数据加载，后续 Change 逐步实现完整交互
 */
import { loadStudents } from './storage.js';

// 初始化数据文件
const students = loadStudents();

console.log('=== 学生成绩管理系统 ===');
console.log('1. 录入成绩');
console.log('2. 查询成绩');
console.log('3. 成绩统计');
console.log('4. 查看全部');
console.log('5. 退出系统');
console.log(`当前已录入 ${students.length} 名学生`);
console.log('请选择操作（1-5）：');
console.log('（后续迭代实现完整交互流程）');
