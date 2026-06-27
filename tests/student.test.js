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
  let addStudent, validateStudent;

  beforeEach(async () => {
    const mod = await import('../src/student.js');
    addStudent = mod.addStudent;
    validateStudent = mod.validateStudent;
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
});
