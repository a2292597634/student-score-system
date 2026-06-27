/**
 * CLI 交互入口
 * 学生成绩管理系统主菜单
 */
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { loadStudents, saveStudents } from './storage.js';
import {
  addStudent,
  findStudent,
  listStudents,
  calcStudentStats,
  calcClassStats,
  updateStudent,
  deleteStudent
} from './student.js';

// 全局学生数据
let students = loadStudents();

// 创建 readline 接口
const rl = readline.createInterface({ input, output });

/**
 * 显示主菜单
 */
function showMenu() {
  console.log('\n=== 学生成绩管理系统 ===');
  console.log('1. 录入成绩');
  console.log('2. 查询成绩');
  console.log('3. 成绩统计');
  console.log('4. 查看全部');
  console.log('5. 退出系统');
}

/**
 * 读取有效数字
 */
async function readNumber(prompt, allowEmpty = false) {
  while (true) {
    const raw = await rl.question(prompt);
    if (allowEmpty && raw.trim() === '') return '';
    const num = Number(raw);
    if (isNaN(num) || raw.trim() === '') {
      console.log('成绩必须为有效数字，请重新输入');
      continue;
    }
    if (num < 0 || num > 100) {
      console.log('成绩必须在0-100之间，请重新输入');
      continue;
    }
    return num;
  }
}

/**
 * 录入成绩
 */
async function doAdd() {
  console.log('\n--- 录入学生成绩 ---');

  const id = (await rl.question('请输入学号：')).trim();
  if (!id) {
    console.log('学号不能为空，录入取消');
    return;
  }

  const name = (await rl.question('请输入姓名：')).trim();
  if (!name) {
    console.log('姓名不能为空，录入取消');
    return;
  }

  const chinese = await readNumber('请输入语文成绩（0-100）：');
  const math = await readNumber('请输入数学成绩（0-100）：');
  const english = await readNumber('请输入英语成绩（0-100）：');

  const result = addStudent(students, { id, name, chinese, math, english });

  if (result.success) {
    saveStudents(students);
    console.log(`✓ ${result.message}`);
    console.log(`  学号: ${result.data.id}  姓名: ${result.data.name}`);
    console.log(`  语文: ${result.data.chinese}  数学: ${result.data.math}  英语: ${result.data.english}`);
  } else {
    console.log(`✗ ${result.message}`);
  }
}

/**
 * 查询成绩
 */
async function doQuery() {
  console.log('\n--- 查询学生成绩 ---');
  console.log('1. 按学号精准查询');
  console.log('2. 查看全部学生');
  console.log('3. 修改与删除');

  const choice = (await rl.question('请选择（1-3）：')).trim();

  if (choice === '1') {
    const id = (await rl.question('请输入要查询的学号：')).trim();
    const result = findStudent(students, id);
    if (result.success) {
      printStudent(result.data);
    } else {
      console.log(`✗ ${result.message}`);
    }
  } else if (choice === '2') {
    const result = listStudents(students);
    if (result.success) {
      console.log(`\n${result.message}`);
      console.log('学号\t姓名\t语文\t数学\t英语');
      console.log('─'.repeat(40));
      for (const s of result.data) {
        console.log(`${s.id}\t${s.name}\t${s.chinese}\t${s.math}\t${s.english}`);
      }
    } else {
      console.log(`✗ ${result.message}`);
    }
  } else if (choice === '3') {
    console.log('\n--- 修改与删除学生 ---');
    console.log('1. 修改学生信息');
    console.log('2. 删除学生记录');
    const sub = (await rl.question('请选择（1-2）：')).trim();
    if (sub === '1') {
      await doEdit();
    } else if (sub === '2') {
      await doDelete();
    } else {
      console.log('无效选择，请选择 1-2');
    }
  } else {
    console.log('无效选择，请选择 1-3');
  }
}

/**
 * 打印单个学生信息
 */
function printStudent(student) {
  const stats = calcStudentStats(student);
  console.log('\n--- 学生详情 ---');
  console.log(`学号: ${student.id}`);
  console.log(`姓名: ${student.name}`);
  console.log(`语文: ${student.chinese}`);
  console.log(`数学: ${student.math}`);
  console.log(`英语: ${student.english}`);
  console.log(`总分: ${stats.total}`);
  console.log(`平均分: ${stats.average}`);
}

/**
 * 成绩统计
 */
async function doStats() {
  console.log('\n--- 成绩统计 ---');
  console.log('1. 按学号查看单学生统计');
  console.log('2. 查看班级整体统计');

  const choice = (await rl.question('请选择（1-2）：')).trim();

  if (choice === '1') {
    const id = (await rl.question('请输入要统计的学号：')).trim();
    const result = findStudent(students, id);
    if (result.success) {
      printStudent(result.data);
    } else {
      console.log(`✗ ${result.message}`);
    }
  } else if (choice === '2') {
    if (!students || students.length === 0) {
      console.log('✗ 暂无学生数据，请先录入');
      return;
    }

    const stats = calcClassStats(students);
    console.log('\n--- 班级统计 ---');
    console.log(`总人数: ${students.length}`);
    console.log(`语文班平均: ${stats.chinese}`);
    console.log(`数学班平均: ${stats.math}`);
    console.log(`英语班平均: ${stats.english}`);

    // 各班最高分
    const best = {
      chinese: Math.max(...students.map((s) => Number(s.chinese) || 0)),
      math: Math.max(...students.map((s) => Number(s.math) || 0)),
      english: Math.max(...students.map((s) => Number(s.english) || 0))
    };
    console.log(`\n语文最高分: ${best.chinese}`);
    console.log(`数学最高分: ${best.math}`);
    console.log(`英语最高分: ${best.english}`);
  } else {
    console.log('无效选择，请选择 1-2');
  }
}

/**
 * 查看全部
 */
async function doListAll() {
  const result = listStudents(students);
  if (result.success) {
    console.log(`\n${result.message}`);
    console.log('学号\t姓名\t语文\t数学\t英语\t总分\t平均分');
    console.log('─'.repeat(55));
    for (const s of result.data) {
      const stats = calcStudentStats(s);
      console.log(`${s.id}\t${s.name}\t${s.chinese}\t${s.math}\t${s.english}\t${stats.total}\t${stats.average}`);
    }
  } else {
    console.log(`✗ ${result.message}`);
  }
}

/**
 * 修改学生信息
 */
async function doEdit() {
  const id = (await rl.question('请输入要修改的学号：')).trim();
  const findResult = findStudent(students, id);
  if (!findResult.success) {
    console.log(`✗ ${findResult.message}`);
    return;
  }

  console.log('\n当前信息：');
  printStudent(findResult.data);
  console.log('\n请输入新值（直接回车保留原值）：');

  const name = (await rl.question(`姓名 [${findResult.data.name}]：`)).trim();
  const chineseStr = (await rl.question(`语文 [${findResult.data.chinese}]：`)).trim();
  const mathStr = (await rl.question(`数学 [${findResult.data.math}]：`)).trim();
  const englishStr = (await rl.question(`英语 [${findResult.data.english}]：`)).trim();

  const fields = {};
  if (name) fields.name = name;
  if (chineseStr) {
    const v = Number(chineseStr);
    if (isNaN(v)) { console.log('✗ 成绩必须为有效数字'); return; }
    fields.chinese = v;
  }
  if (mathStr) {
    const v = Number(mathStr);
    if (isNaN(v)) { console.log('✗ 成绩必须为有效数字'); return; }
    fields.math = v;
  }
  if (englishStr) {
    const v = Number(englishStr);
    if (isNaN(v)) { console.log('✗ 成绩必须为有效数字'); return; }
    fields.english = v;
  }

  if (Object.keys(fields).length === 0) {
    console.log('未提供任何修改，操作取消');
    return;
  }

  const result = updateStudent(students, id, fields);
  if (result.success) {
    saveStudents(students);
    console.log(`✓ ${result.message}`);
  } else {
    console.log(`✗ ${result.message}`);
  }
}

/**
 * 删除学生记录
 */
async function doDelete() {
  const id = (await rl.question('请输入要删除的学号：')).trim();
  const findResult = findStudent(students, id);
  if (!findResult.success) {
    console.log(`✗ ${findResult.message}`);
    return;
  }

  console.log('\n将要删除以下学生：');
  printStudent(findResult.data);

  const confirm = (await rl.question('\n确认删除？(y/N)：')).trim().toLowerCase();
  if (confirm !== 'y') {
    console.log('操作已取消');
    return;
  }

  const result = deleteStudent(students, id);
  if (result.success) {
    saveStudents(students);
    console.log(`✓ ${result.message}`);
  } else {
    console.log(`✗ ${result.message}`);
  }
}

/**
 * 主循环
 */
async function main() {
  let running = true;

  while (running) {
    showMenu();
    const choice = (await rl.question('请选择操作（1-5）：')).trim();

    switch (choice) {
      case '1':
        await doAdd();
        break;
      case '2':
        await doQuery();
        break;
      case '3':
        await doStats();
        break;
      case '4':
        await doListAll();
        break;
      case '5':
        console.log('感谢使用，再见！');
        running = false;
        break;
      default:
        console.log('请输入有效数字（1-5）');
    }
  }

  rl.close();
}

main();
