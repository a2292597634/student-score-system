/**
 * 学生成绩管理模块
 * Change 2：负责学生信息的录入和数据校验
 * 后续 Change 将逐步添加查询和统计功能
 */

/**
 * 校验学生信息合法性
 * @param {Object} student - 待校验的学生对象 {id, name, chinese, math, english}
 * @param {Array} existingStudents - 已有学生列表（用于检查学号唯一性）
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateStudent(student, existingStudents) {
  const errors = [];

  // 学号非空校验
  if (!student.id || typeof student.id !== 'string' || student.id.trim() === '') {
    errors.push('学号不能为空');
  }

  // 学号唯一性校验（仅在学号非空时检查）
  if (student.id && typeof student.id === 'string' && student.id.trim() !== '') {
    const trimmedId = student.id.trim();
    const exists = existingStudents.some(
      (s) => s.id.trim() === trimmedId
    );
    if (exists) {
      errors.push('该学号已存在，不允许重复录入');
    }
  }

  // 姓名为空校验
  if (!student.name || typeof student.name !== 'string' || student.name.trim() === '') {
    errors.push('姓名不能为空');
  }

  // 成绩校验（语文、数学、英语）
  const scoreFields = ['chinese', 'math', 'english'];
  let hasRangeError = false;
  let hasTypeError = false;

  for (const field of scoreFields) {
    const score = student[field];

    if (score === null || score === undefined || typeof score === 'string' || Number.isNaN(Number(score))) {
      if (!hasTypeError) {
        errors.push('成绩必须为有效数字');
        hasTypeError = true;
      }
      continue;
    }

    const numScore = Number(score);

    if (!Number.isFinite(numScore)) {
      if (!hasTypeError) {
        errors.push('成绩必须为有效数字');
        hasTypeError = true;
      }
      continue;
    }

    if (numScore < 0 || numScore > 100) {
      if (!hasRangeError) {
        errors.push('成绩必须在0-100之间');
        hasRangeError = true;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 添加学生信息
 * @param {Array} students - 当前学生列表（会被原地修改）
 * @param {Object} info - 学生信息 {id, name, chinese, math, english}
 * @returns {{success: boolean, message: string, data: Object|null}}
 */
export function addStudent(students, info) {
  const sanitized = {
    id: typeof info.id === 'string' ? info.id.trim() : info.id,
    name: typeof info.name === 'string' ? info.name.trim() : info.name,
    chinese: info.chinese,
    math: info.math,
    english: info.english
  };

  const { valid, errors } = validateStudent(sanitized, students);

  if (!valid) {
    return { success: false, message: errors[0], data: null };
  }

  const student = {
    id: sanitized.id,
    name: sanitized.name,
    chinese: Number(sanitized.chinese),
    math: Number(sanitized.math),
    english: Number(sanitized.english)
  };

  students.push(student);

  return { success: true, message: '学生信息录入成功', data: student };
}
