/**
 * JSON 文件存储引擎
 * 负责学生数据的读取、写入和初始化
 * 所有函数接受 dataDir 参数，无全局可变状态
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_DIR = path.resolve(__dirname, '..', 'data');
const FILE_NAME = 'students.json';

/**
 * 获取数据文件完整路径
 */
function getFilePath(dataDir) {
  return path.join(dataDir, FILE_NAME);
}

/**
 * 从 JSON 文件读取学生数据
 * 文件不存在时自动创建并初始化为空数组
 * @param {string} dataDir - 数据目录路径
 * @returns {Array} 学生数据数组
 */
export function loadStudents(dataDir = DEFAULT_DATA_DIR) {
  const filePath = getFilePath(dataDir);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const trimmed = raw.trim();
    if (!trimmed) return [];
    return JSON.parse(trimmed);
  } catch {
    return [];
  }
}

/**
 * 将学生数据写入 JSON 文件（覆盖式写入，带格式化缩进）
 * @param {Array} data - 学生数据数组
 * @param {string} dataDir - 数据目录路径
 */
export function saveStudents(data, dataDir = DEFAULT_DATA_DIR) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = getFilePath(dataDir);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 显式初始化存储目录和文件
 * @param {string} dataDir - 数据目录路径
 */
export function initStorage(dataDir = DEFAULT_DATA_DIR) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = getFilePath(dataDir);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
}
