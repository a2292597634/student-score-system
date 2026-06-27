/**
 * 学生成绩管理模块单元测试
 * Change 2：覆盖录入和数据校验
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TEST_DATA_DIR = path.join(PROJECT_ROOT, 'data', '.test-tmp-student');

beforeEach(async () => {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });

  const storage = await import('../src/storage.js');
  storage.initStorage(TEST_DATA_DIR);
});

afterEach(() => {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true });
  }
});

describe('学生管理 Student', () => {
  let addStudent, validateStudent, findStudent, listStudents, calcStudentStats, calcClassStats, updateStudent, deleteStudent;

  beforeEach(async () => {
    const mod = await import('../src/student.js');
    addStudent = mod.addStudent;
    validateStudent = mod.validateStudent;
    findStudent = mod.findStudent;
    listStudents = mod.listStudents;
    calcStudentStats = mod.calcStudentStats;
    calcClassStats = mod.calcClassStats;
    updateStudent = mod.updateStudent;
    deleteStudent = mod.deleteStudent;
  });

  describe('validateStudent()', () => {
    it('应该在所有字段合法时返回校验通过', () => {
      const student = { id: '2024001', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('应该检测学号为空并报告错误', () => {
      const student = { id: '', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('学号不能为空');
    });

    it('应该检测学号只有空白字符并报告错误', () => {
      const student = { id: '   ', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('学号不能为空');
    });

    it('应该检测学号重复并报告错误', () => {
      const existing = [{ id: '2024001', name: '已有', chinese: 80, math: 80, english: 80 }];
      const student = { id: '2024001', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = validateStudent(student, existing);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('该学号已存在，不允许重复录入');
    });

    it('应该检测姓名为空并报告错误', () => {
      const student = { id: '2024001', name: '', chinese: 85, math: 92, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('姓名不能为空');
    });

    it('应该检测成绩小��0并报告错误', () => {
      const student = { id: '2024001', name: '张三', chinese: -1, math: 92, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('成绩必须在0-100之间');
    });

    it('应该检测成绩大于100并报告错误', () => {
      const student = { id: '2024001', name: '张三', chinese: 85, math: 101, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('成绩必须在0-100之间');
    });

    it('应该检测成绩为非数字并报告错误', () => {
      const student = { id: '2024001', name: '张三', chinese: 'abc', math: 92, english: 78 };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('成绩必须为有效数字');
    });

    it('应该同时报告多项校验错误', () => {
      const student = { id: '', name: '', chinese: -5, math: 999, english: 'xyz' };
      const result = validateStudent(student, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('学号不能为空');
      expect(result.errors).toContain('姓名不能为空');
      expect(result.errors).toContain('成绩必须在0-100之间');
      expect(result.errors).toContain('成绩必须为有效数字');
    });
  });

  describe('addStudent()', () => {
    it('应该在合法数据时成功添加学生', () => {
      const students = [];
      const info = { id: '2024001', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = addStudent(students, info);

      expect(result.success).toBe(true);
      expect(result.message).toBe('学生信息录入成功');
      expect(result.data).toEqual({
        id: '2024001', name: '张三', chinese: 85, math: 92, english: 78
      });
      expect(students.length).toBe(1);
    });

    it('应该在数据不合法时拒绝添加', () => {
      const students = [];
      const info = { id: '', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = addStudent(students, info);

      expect(result.success).toBe(false);
      expect(students.length).toBe(0);
    });

    it('应该在学号重复时拒绝添加', () => {
      const students = [
        { id: '2024001', name: '已有', chinese: 80, math: 80, english: 80 }
      ];
      const info = { id: '2024001', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = addStudent(students, info);

      expect(result.success).toBe(false);
      expect(result.message).toBe('该学号已存在，不允许重复录入');
      expect(students.length).toBe(1);
    });

    it('应该在成绩越界时拒绝添加', () => {
      const students = [];
      const info = { id: '2024001', name: '张三', chinese: 150, math: 92, english: 78 };
      const result = addStudent(students, info);

      expect(result.success).toBe(false);
      expect(result.message).toBe('成绩必须在0-100之间');
      expect(students.length).toBe(0);
    });

    it('应该在成绩非数字时拒绝添加', () => {
      const students = [];
      const info = { id: '2024001', name: '张三', chinese: null, math: 92, english: 78 };
      const result = addStudent(students, info);

      expect(result.success).toBe(false);
      expect(result.message).toBe('成绩必须为有效数字');
      expect(students.length).toBe(0);
    });
  });

  describe('findStudent()', () => {
    it('应该在学号存在时返回学生完整信息', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 },
        { id: '002', name: '李四', chinese: 90, math: 88, english: 95 }
      ];

      const result = findStudent(students, '001');

      expect(result.success).toBe(true);
      expect(result.message).toBe('查询成功');
      expect(result.data).toEqual({ id: '001', name: '张三', chinese: 85, math: 92, english: 78 });
    });

    it('应该在学号不存在时给出友好提示', () => {
      const students = [{ id: '001', name: '张三', chinese: 85, math: 92, english: 78 }];

      const result = findStudent(students, '999');

      expect(result.success).toBe(false);
      expect(result.message).toBe('未找到学号为 999 的学生');
      expect(result.data).toBe(null);
    });

    it('应该在数据为空时提示先录入', () => {
      const result = findStudent([], '001');

      expect(result.success).toBe(false);
      expect(result.message).toBe('暂无学生数据，请先录入');
      expect(result.data).toBe(null);
    });

    it('应该在学号为空时提示输入学号', () => {
      const students = [{ id: '001', name: '张三', chinese: 85, math: 92, english: 78 }];
      const result = findStudent(students, '');

      expect(result.success).toBe(false);
      expect(result.message).toBe('请输入要查询的学号');
    });
  });

  describe('listStudents()', () => {
    it('应该在已有学生时返回完整列表', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 },
        { id: '002', name: '李四', chinese: 90, math: 88, english: 95 }
      ];

      const result = listStudents(students);

      expect(result.success).toBe(true);
      expect(result.message).toBe('共有 2 名学生');
      expect(result.data).toHaveLength(2);
      expect(result.data).toEqual(students);
    });

    it('应该在无学生时提示先录入', () => {
      const result = listStudents([]);

      expect(result.success).toBe(false);
      expect(result.message).toBe('暂无学生数据，请先录入');
      expect(result.data).toEqual([]);
    });
  });

  describe('calcStudentStats()', () => {
    it('应该正确计算学生总分和平均分', () => {
      const student = { id: '001', name: '张三', chinese: 85, math: 92, english: 78 };
      const result = calcStudentStats(student);

      expect(result.total).toBe(255);
      expect(result.average).toBe(85.0);
    });

    it('应该正确保留平均分一位小数（四舍五入）', () => {
      const student = { id: '001', name: '张三', chinese: 85, math: 90, english: 78 };
      const result = calcStudentStats(student);

      expect(result.total).toBe(253);
      expect(result.average).toBe(84.3);
    });

    it('应该在传入 null 时返回全 0', () => {
      const result = calcStudentStats(null);

      expect(result.total).toBe(0);
      expect(result.average).toBe(0);
    });

    it('应该在成绩缺失时将该科作 0 处理', () => {
      const student = { id: '001', name: '张三', chinese: 100, math: null, english: undefined };
      const result = calcStudentStats(student);

      expect(result.total).toBe(100);
      expect(result.average).toBe(33.3);
    });
  });

  describe('calcClassStats()', () => {
    it('应该正确计算班级各科平均分', () => {
      const students = [
        { id: '001', name: '张三', chinese: 80, math: 90, english: 100 },
        { id: '002', name: '李四', chinese: 90, math: 80, english: 60 }
      ];

      const result = calcClassStats(students);

      expect(result.chinese).toBe(85.0);
      expect(result.math).toBe(85.0);
      expect(result.english).toBe(80.0);
    });

    it('应该在传入空数组时返回全 0', () => {
      const result = calcClassStats([]);

      expect(result.chinese).toBe(0);
      expect(result.math).toBe(0);
      expect(result.english).toBe(0);
    });

    it('应该在传入 null 时返回全 0', () => {
      const result = calcClassStats(null);

      expect(result.chinese).toBe(0);
      expect(result.math).toBe(0);
      expect(result.english).toBe(0);
    });
  });

  describe('updateStudent()', () => {
    it('应该成功修改学生姓名', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 }
      ];
      const result = updateStudent(students, '001', { name: '张三丰' });

      expect(result.success).toBe(true);
      expect(result.message).toBe('学生信息修改成功');
      expect(result.data.name).toBe('张三丰');
      expect(result.data.chinese).toBe(85);
      expect(result.data.math).toBe(92);
      expect(result.data.english).toBe(78);
      expect(students[0].name).toBe('张三丰');
    });

    it('应该支持部分字段更新（只修改成绩）', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 }
      ];
      const result = updateStudent(students, '001', { math: 100 });

      expect(result.success).toBe(true);
      expect(result.data.math).toBe(100);
      expect(result.data.chinese).toBe(85);
      expect(result.data.english).toBe(78);
      expect(result.data.name).toBe('张三');
    });

    it('应该在校号不存在时拒绝修改', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 }
      ];
      const result = updateStudent(students, '999', { name: '不存在' });

      expect(result.success).toBe(false);
      expect(result.message).toBe('未找到学号为 999 的学生');
      expect(students.length).toBe(1);
    });

    it('应该在修改后数据不合法时拒绝', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 }
      ];
      const result = updateStudent(students, '001', { chinese: 999 });

      expect(result.success).toBe(false);
      expect(result.message).toBe('成绩必须在0-100之间');
      expect(students[0].chinese).toBe(85); // 原值不变
    });
  });

  describe('deleteStudent()', () => {
    it('应该成功删除学生', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 },
        { id: '002', name: '李四', chinese: 90, math: 88, english: 95 }
      ];
      const result = deleteStudent(students, '001');

      expect(result.success).toBe(true);
      expect(result.message).toBe('学生信息删除成功');
      expect(result.data.id).toBe('001');
      expect(students.length).toBe(1);
      expect(students[0].id).toBe('002');
    });

    it('应该在校号不存在时拒绝删除', () => {
      const students = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 }
      ];
      const result = deleteStudent(students, '999');

      expect(result.success).toBe(false);
      expect(result.message).toBe('未找到学号为 999 的学生');
      expect(students.length).toBe(1);
    });

    it('应该在数据为空时拒绝删除', () => {
      const result = deleteStudent([], '001');

      expect(result.success).toBe(false);
      expect(result.message).toBe('暂无学生数据，请先录入');
    });
  });
});
