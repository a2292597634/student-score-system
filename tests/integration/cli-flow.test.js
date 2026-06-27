/**
 * CLI 流程集成测试
 * Change 2：覆盖录入→存储→读取的完整链路
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const TEST_DATA_DIR = path.join(PROJECT_ROOT, 'data', '.test-tmp-integration');

beforeEach(async () => {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });

  const storage = await import('../../src/storage.js');
  storage.initStorage(TEST_DATA_DIR);
});

afterEach(() => {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true });
  }
});

describe('CLI 完整流程集成测试', () => {
  it('应该在录入后保存并读取数据一致', async () => {
    const storage = await import('../../src/storage.js');
    const { addStudent } = await import('../../src/student.js');

    let students = storage.loadStudents(TEST_DATA_DIR);
    const info = { id: '2024001', name: '张三', chinese: 85, math: 92, english: 78 };
    const result = addStudent(students, info);

    expect(result.success).toBe(true);

    storage.saveStudents(students, TEST_DATA_DIR);

    const loaded = storage.loadStudents(TEST_DATA_DIR);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('2024001');
    expect(loaded[0].name).toBe('张三');
  });

  it('应该在录入多名学生后所有数据持久化正确', async () => {
    const storage = await import('../../src/storage.js');
    const { addStudent } = await import('../../src/student.js');

    let students = storage.loadStudents(TEST_DATA_DIR);

    addStudent(students, { id: '001', name: '学生A', chinese: 90, math: 85, english: 88 });
    addStudent(students, { id: '002', name: '学生B', chinese: 70, math: 75, english: 80 });
    addStudent(students, { id: '003', name: '学生C', chinese: 60, math: 65, english: 70 });

    storage.saveStudents(students, TEST_DATA_DIR);

    const loaded = storage.loadStudents(TEST_DATA_DIR);
    expect(loaded.length).toBe(3);
    expect(loaded.map((s) => s.id)).toEqual(['001', '002', '003']);
  });

  it('应该在重复学号被拦截后数据不受影响', async () => {
    const storage = await import('../../src/storage.js');
    const { addStudent } = await import('../../src/student.js');

    let students = storage.loadStudents(TEST_DATA_DIR);

    const r1 = addStudent(students, { id: '001', name: '学生A', chinese: 90, math: 85, english: 88 });
    expect(r1.success).toBe(true);

    const r2 = addStudent(students, { id: '001', name: '学生B', chinese: 70, math: 75, english: 80 });
    expect(r2.success).toBe(false);
    expect(r2.message).toBe('该学号已存在，不允许重复录入');

    expect(students.length).toBe(1);
  });

  it('应该在程序重启后数据依然存在', async () => {
    const storage = await import('../../src/storage.js');
    const { addStudent } = await import('../../src/student.js');

    let students = storage.loadStudents(TEST_DATA_DIR);
    addStudent(students, { id: '001', name: '测试', chinese: 100, math: 100, english: 100 });
    storage.saveStudents(students, TEST_DATA_DIR);

    const filePath = path.join(TEST_DATA_DIR, 'students.json');
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.statSync(filePath).size).toBeGreaterThan(0);

    const reloaded = storage.loadStudents(TEST_DATA_DIR);
    expect(reloaded.length).toBe(1);
    expect(reloaded[0].id).toBe('001');
    expect(reloaded[0].chinese).toBe(100);
  });
});
