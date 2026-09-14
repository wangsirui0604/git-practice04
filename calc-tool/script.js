// 自主实践：社团活动经费统计工具
// 数据流：原始记录 -> 清洗 -> 已支付记录 -> 分类汇总 -> 文本报告。
const transactions = [
  { item: '海报打印', category: '宣传', amount: '120.50', paid: true },
  { item: '活动饮用水', category: '物资', amount: '86', paid: true },
  { item: '场地租赁', category: '场地', amount: '300', paid: false },
  { item: '志愿者午餐', category: '物资', amount: '168.40', paid: true },
  { item: '错误记录', category: '其他', amount: 'not-a-number', paid: true },
  { item: '负数记录', category: '其他', amount: '-20', paid: true }
];

// 清洗金额：显式转数值，只保留有限且非负的记录。
const cleanTransactions = list => list.map(record => ({
  ...record,
  amount: Number(String(record.amount).trim())
})).filter(record => (
  record.item && record.category && Number.isFinite(record.amount) && record.amount >= 0
));

// 只保留已经支付的记录。
const paidTransactions = list => list.filter(record => record.paid === true);

// 用 reduce 按类别求和。
const totalByCategory = list => list.reduce((totals, record) => ({
  ...totals,
  [record.category]: (totals[record.category] || 0) + record.amount
}), {});

// 计算总额，使用 toFixed 统一金额展示精度。
const totalAmount = list => list.reduce((sum, record) => sum + record.amount, 0).toFixed(2);

// 用 map 将分类对象转换成便于阅读的文本行。
const formatCategoryTotals = totals => Object.entries(totals)
  .map(([category, amount]) => `${category}：${amount.toFixed(2)}元`)
  .join('；');

const buildExpenseReport = list => {
  const clean = cleanTransactions(list);
  const paid = paidTransactions(clean);
  if (paid.length === 0) return '没有可统计的已支付记录';
  const categoryTotals = totalByCategory(paid);
  return `有效记录：${clean.length}条；已支付：${paid.length}条；` +
    `已支付总额：${totalAmount(paid)}元；分类汇总：${formatCategoryTotals(categoryTotals)}`;
};

const runExpenseTool = list => {
  const clean = cleanTransactions(list);
  const paid = paidTransactions(clean);
  const lines = [
    '=== 社团活动经费统计工具 ===',
    '输入记录：',
    JSON.stringify(list),
    `清洗后：${JSON.stringify(clean)}`,
    `统计结果：${buildExpenseReport(list)}`,
    `空数据实验：${buildExpenseReport([])}`,
    `仅非法输入实验：${buildExpenseReport([{ item: '测试', category: '其他', amount: 'abc', paid: true }])}`
  ];
  lines.forEach(line => console.log(line));
  const output = document.querySelector('#output');
  if (output) output.textContent = lines.join('\n');
  return { clean, paid, lines };
};

if (typeof document !== 'undefined') runExpenseTool(transactions);
