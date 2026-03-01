/**
 * 检测历史页面
 * 
 * 作用：
 * 1. 显示所有检测记录
 * 2. 每条记录显示检测时间、部位、评分、风险等级
 * 3. 点击查看详细结果
 * 4. 支持删除记录
 * 
 * 使用场景：
 * - 从 ProfileScreen 点击"检测历史"进入
 * - 查看历史检测记录
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, IconButton, Chip } from 'react-native-paper';
import { useProfileStore } from '../store/profileStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { formatScore, formatDate, getRiskLevelText, getScoreColor } from '@shared/utils/format';
import { Loading } from '@shared/components/Loading';
import { Detection } from '@shared/types';

interface DetectionHistoryScreenProps {
  navigation: any;
}

export default function DetectionHistoryScreen({ navigation }: DetectionHistoryScreenProps) {
  const { detectionHistory, isLoading, loadDetectionHistory } = useProfileStore();

  // 加载检测历史
  useEffect(() => {
    loadDetectionHistory();
  }, []);

  // 查看详细结果
  const handleViewResult = (detection: Detection) => {
    navigation.navigate('DetectionTab', {
      screen: 'DetectionResult',
      params: { result: detection.detectionResult },
    });
  };

  // 删除记录
  const handleDeleteRecord = (detectionId: string) => {
    Alert.alert('删除记录', '确定要删除这条检测记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          // TODO: 实现删除功能
          Alert.alert('提示', '删除功能开发中...');
        },
      },
    ]);
  };

  // 获取风险等级颜色
  const getRiskColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
    }
  };

  // 渲染检测记录
  const renderDetectionItem = ({ item }: { item: Detection }) => (
    <TouchableOpacity
      onPress={() => handleViewResult(item)}
      activeOpacity={0.7}
    >
      <Card style={styles.detectionCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            {/* 时间 */}
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

            {/* 删除按钮 */}
            <IconButton
              icon="delete"
              size={20}
              iconColor={colors.textSecondary}
              onPress={() => handleDeleteRecord(item.id)}
            />
          </View>

          {/* 评分和风险等级 */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreContainer}>
              <Text
                style={[
                  styles.scoreText,
                  { color: getScoreColor(item.safetyScore) },
                ]}
              >
                {formatScore(item.safetyScore)}
              </Text>
              <Text style={styles.scoreLabel}>/5.0</Text>
            </View>

            <Chip
              style={[
                styles.riskChip,
                { backgroundColor: `${getRiskColor(item.detectionResult.riskLevel)}20` },
              ]}
              textStyle={{ color: getRiskColor(item.detectionResult.riskLevel) }}
            >
              {getRiskLevelText(item.detectionResult.riskLevel)}
            </Chip>
          </View>

          {/* 检测项目 */}
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsLabel}>检测项目：</Text>
            <View style={styles.itemsChips}>
              {item.detectionResult.detectedItems.slice(0, 3).map((detectedItem, index) => (
                <Chip
                  key={index}
                  style={styles.itemChip}
                  textStyle={styles.itemChipText}
                  compact
                >
                  {detectedItem.name}
                </Chip>
              ))}
              {item.detectionResult.detectedItems.length > 3 && (
                <Text style={styles.moreText}>
                  +{item.detectionResult.detectedItems.length - 3}
                </Text>
              )}
            </View>
          </View>

          {/* 状态 */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>状态：</Text>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === 'completed'
                      ? colors.success
                      : item.status === 'failed'
                      ? colors.danger
                      : colors.warning,
                },
              ]}
            >
              {item.status === 'completed'
                ? '已完成'
                : item.status === 'failed'
                ? '失败'
                : '处理中'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // 空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📷</Text>
      <Text style={styles.emptyTitle}>暂无检测记录</Text>
      <Text style={styles.emptyText}>
        点击底部"检测"标签，{'\n'}
        开始您的第一次安全检测
      </Text>
    </View>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={colors.background}
        />
        <Text style={styles.title}>检测历史</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 检测记录列表 */}
      <FlatList
        data={detectionHistory}
        renderItem={renderDetectionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h2,
    color: colors.background,
  },
  placeholder: {
    width: 48,
  },
  listContent: {
    padding: spacing.lg,
  },
  detectionCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  riskChip: {
    height: 32,
  },
  itemsContainer: {
    marginBottom: spacing.md,
  },
  itemsLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  itemsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  itemChip: {
    height: 28,
    backgroundColor: colors.surface,
  },
  itemChipText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

