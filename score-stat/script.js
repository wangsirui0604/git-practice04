// 课堂案例：班级成绩统计工具
const scores = [
  { name: '李四', score: 92 },
  { name: '王五', score: 45 },
  { name: '赵六', score: 77 },
  { name: '孙七', score: 59 },
  { name: '周八', score: 88 },
  { name: '吴九', score: 105 }, // 非法：超过满分
  { name: '郑十', score: -3 }   // 非法：低于零分
];

// 只保留 0 至 100 之间的合法成绩。
const cleanScores = list => list.filter(student => (
  Number.isFinite(student.score) && student.score >= 0 && student.score <= 100
));

// 计算平均分；空数组时返回 0，避免出现 NaN。
const average = list => {
  if (list.length === 0) return 0;
  const total = list.reduce((sum, student) => sum + student.score, 0);
  return (total / list.length).toFixed(2);
};

// 找到最高分学生；空数组时返回 null，由调用方负责保护。
const highest = list => {
  if (list.length === 0) return null;
  return list.reduce((max, student) => (
    student.score > max.score ? student : max
  ), list[0]);
};

// 筛出不及格学生姓名。
const failed = list => list.filter(student => student.score < 60).map(student => student.name);

// 把分数转换为等级。
const toGrade = score => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// 统计各等级人数。
const gradeCount = list => list.reduce((result, student) => {
  const grade = toGrade(student.score);
  return { ...result, [grade]: result[grade] + 1 };
}, { A: 0, B: 0, C: 0, D: 0, F: 0 });

const report = list => {
  const valid = cleanScores(list);
  if (valid.length === 0) return '没有有效成绩';
  const top = highest(valid);
  const grades = gradeCount(valid);
  const failedNames = failed(valid);
  return `有效人数：${valid.length}人；平均分：${average(valid)}；最高分：${top.score}分（${top.name}）；` +
    `等级分布：A${grades.A}人 B${grades.B}人 C${grades.C}人 D${grades.D}人 F${grades.F}人；` +
    `不及格：${failedNames.join('、') || '无'}`;
};

const runScoreStat = list => {
  const lines = [
    '=== 班级成绩统计工具 ===',
    '原始数据：',
    JSON.stringify(list),
    `清洗后：${JSON.stringify(cleanScores(list))}`,
    `统计报告：${report(list)}`,
    `空数据实验：${report([])}`
  ];
  lines.forEach(line => console.log(line));
  const output = document.querySelector('#output');
  if (output) output.textContent = lines.join('\n');
  return lines;
};

if (typeof document !== 'undefined') runScoreStat(scores);
