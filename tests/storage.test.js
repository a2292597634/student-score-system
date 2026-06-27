/**
 * JSON 文件存储引擎单元测试
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TEST_DATA_DIR = path.join(PROJECT_ROOT, 'data', '.test-tmp');
const TEST_FILE = path.join(TEST_DATA_DIR, 'students.json');

let loadStudents, saveStudents, initStorage;

beforeEach(async () => {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });

  const mod = await import('../src/storage.js');
  loadStudents = mod.loadStudents;
  saveStudents = mod.saveStudents;
  initStorage = mod.initStorage;
});

afterEach(() => {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true });
  }
});

describe('存储引擎 Storage', () => {
  describe('loadStudents()', () => {
    it('应该在文件不存在时自动创建文件并返回空数组', () => {
      expect(fs.existsSync(TEST_FILE)).toBe(false);

      const result = loadStudents(TEST_DATA_DIR);

      expect(fs.existsSync(TEST_FILE)).toBe(true);
      expect(result).toEqual([]);
    });

    it('应该在文件存在时读取并返回解析后的数组', () => {
      const testData = [
        { id: '001', name: '测试', chinese: 90, math: 85, english: 88 }
      ];
      fs.writeFileSync(TEST_FILE, JSON.stringify(testData, null, 2), 'utf-8');

      const result = loadStudents(TEST_DATA_DIR);

      expect(result).toEqual(testData);
      expect(result.length).toBe(1);
    });

    it('应该在文件内容为空或只有空白字符时返回空数组', () => {
      fs.writeFileSync(TEST_FILE, '   ', 'utf-8');

      const result = loadStudents(TEST_DATA_DIR);

      expect(result).toEqual([]);
    });

    it('应该在 JSON 格式损坏时返回空数组', () => {
      fs.writeFileSync(TEST_FILE, '这不是合法的 JSON{', 'utf-8');

      const result = loadStudents(TEST_DATA_DIR);

      expect(result).toEqual([]);
    });
  });

  describe('saveStudents()', () => {
    it('应该将学生数据写入 JSON 文件并保持数据一致性', () => {
      const testData = [
        { id: '001', name: '张三', chinese: 85, math: 92, english: 78 },
        { id: '002', name: '李四', chinese: 90, math: 88, english: 95 }
      ];

      saveStudents(testData, TEST_DATA_DIR);

      const saved = loadStudents(TEST_DATA_DIR);
      expect(saved).toEqual(testData);
      expect(saved.length).toBe(2);
    });

    it('应该覆盖已有数据而不是追加', () => {
      const oldData = [{ id: '001', name: '旧数据', chinese: 0, math: 0, english: 0 }];
      saveStudents(oldData, TEST_DATA_DIR);

      const newData = [{ id: '002', name: '新数据', chinese: 100, math: 100, english: 100 }];
      saveStudents(newData, TEST_DATA_DIR);

      const saved = loadStudents(TEST_DATA_DIR);
      expect(saved).toEqual(newData);
      expect(saved.length).toBe(1);
    });

    it('应该将数据格式化为带缩进的 JSON', () => {
      const testData = [{ id: '001', name: '张三', chinese: 85, math: 92, english: 78 }];

      saveStudents(testData, TEST_DATA_DIR);

      const raw = fs.readFileSync(TEST_FILE, 'utf-8');
      expect(raw).toContain('\n  ');
    });
  });

  describe('initStorage()', () => {
    it('应该确保数据目录和文件存在且有合法 JSON 内容', () => {
      if (fs.existsSync(TEST_DATA_DIR)) {
        fs.rmSync(TEST_DATA_DIR, { recursive: true });
      }

      initStorage(TEST_DATA_DIR);

      expect(fs.existsSync(TEST_DATA_DIR)).toBe(true);
      expect(fs.existsSync(TEST_FILE)).toBe(true);
      const content = JSON.parse(fs.readFileSync(TEST_FILE, 'utf-8'));
      expect(Array.isArray(content)).toBe(true);
    });

    it('应该在已有文件时不做覆盖', () => {
      const testData = [{ id: '001', name: '已有', chinese: 80, math: 80, english: 80 }];
      saveStudents(testData, TEST_DATA_DIR);

      initStorage(TEST_DATA_DIR);

      const saved = loadStudents(TEST_DATA_DIR);
      expect(saved).toEqual(testData);
    });
  });
});
