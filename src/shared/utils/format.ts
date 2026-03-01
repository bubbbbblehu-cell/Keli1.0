export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString('zh-CN');
  } else if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};

export const formatScore = (score: number): string => {
  return score.toFixed(1);
};

export const getScoreColor = (score: number): string => {
  if (score >= 4.5) return '#4ade80'; // 绿色
  if (score >= 4.0) return '#fbbf24'; // 黄色
  return '#f87171'; // 红色
};

export const getRiskLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 4.5) return 'low';
  if (score >= 4.0) return 'medium';
  return 'high';
};

export const getRiskLevelText = (level: 'high' | 'medium' | 'low'): string => {
  const map = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return map[level];
};

