/**
 * 结果展示页面
 * 
 * 作用：
 * 1. 显示总体安全评分（0-5.0）
 * 2. 显示风险等级（高/中/低）
 * 3. 显示每个部位的详细结果
 * 4. 显示安全建议
 * 5. 支持保存到历史记录
 * 6. 支持分享结果
 * 
 * 使用场景：
 * - AI 分析完成后显示结果
 * - 查看检测历史时显示
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Share } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { useDetectionStore } from '../store/detectionStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { formatScore, getRiskLevelText } from '@shared/utils/format';
import { DetectionResult } from '@shared/types';

interface DetectionResultScreenProps {
  route: any;
  navigation: any;
}

export default function DetectionResultScreen({ route, navigation }: DetectionResultScreenProps) {
  const { result } = route.params as { result: DetectionResult };
  const { saveDetection, resetDetection } = useDetectionStore();
  const [isSaving, setIsSaving] = useState(false);

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

  // 保存检测记录
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveDetection();
      alert('保存成功！');
    } catch (error: any) {
      alert(error.message || '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 分享结果
  const handleShare = async () => {
    try {
      const message = `
🏨 酒店安全检测结果

📊 安全评分: ${formatScore(result.safetyScore)}/5.0
⚠️ 风险等级: ${getRiskLevelText(result.riskLevel)}

${result.hasRisk ? '⚠️ 发现安全隐患，请注意！' : '✅ 未发现明显安全隐患'}

检测项目:
${result.detectedItems.map((item, index) => `${index + 1}. ${item.name}: ${item.hasRisk ? '有风险' : '正常'}`).join('\n')}

建议:
${result.recommendations.join('\n')}

来自：女性安全地图
      `.trim();

      await Share.share({
        message,
        title: '酒店安全检测结果',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // 开始新的检测
  const handleNewDetection = () => {
    resetDetection();
    navigation.navigate('DetectionHome');
  };

  // 返回首页
  const handleGoHome = () => {
    resetDetection();
    navigation.navigate('MapTab');
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>检测结果</Text>
        <Text style={styles.subtitle}>AI 智能分析完成</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 总体评分卡片 */}
        <Card style={styles.scoreCard}>
          <Card.Content>
            <Text style={styles.scoreLabel}>安全评分</Text>
            <Text
              style={[
                styles.scoreValue,
                { color: getRiskColor(result.riskLevel) },
              ]}
            >
              {formatScore(result.safetyScore)}
            </Text>
            <Text style={styles.scoreMax}>/5.0</Text>

            <View
              style={[
                styles.riskBadge,
                { backgroundColor: `${getRiskColor(result.riskLevel)}20` },
              ]}
            >
              <Text
                style={[
                  styles.riskText,
                  { color: getRiskColor(result.riskLevel) },
                ]}
              >
                {getRiskLevelText(result.riskLevel)}
              </Text>
            </View>

            {result.hasRisk && (
              <Text style={styles.warningText}>⚠️ 发现安全隐患，请注意！</Text>
            )}
          </Card.Content>
        </Card>

        {/* 检测项目详情 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>检测详情</Text>
          {result.detectedItems.map((item, index) => (
            <Card key={index} style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.itemStatus,
                      {
                        color: item.hasRisk ? colors.danger : colors.success,
                      },
                    ]}
                  >
                    {item.hasRisk ? '⚠️ 有风险' : '✓ 正常'}
                  </Text>
                </View>

                {item.hasRisk && item.riskDescription && (
                  <View style={styles.riskBox}>
                    <Text style={styles.riskLabel}>风险描述：</Text>
                    <Text style={styles.riskDescription}>
                      {item.riskDescription}
                    </Text>
                  </View>
                )}

                {item.suggestion && (
                  <View style={styles.suggestionBox}>
                    <Text style={styles.suggestionLabel}>💡 建议：</Text>
                    <Text style={styles.suggestionText}>{item.suggestion}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* 安全建议 */}
        {result.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>安全建议</Text>
            <Card style={styles.recommendationCard}>
              <Card.Content>
                {result.recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationBullet}>•</Text>
                    <Text style={styles.recommendationText}>
                      {recommendation}
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </View>
        )}

        {/* 置信度 */}
        <View style={styles.confidenceBox}>
          <Text style={styles.confidenceLabel}>
            分析置信度: {(result.confidence * 100).toFixed(0)}%
          </Text>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          icon="content-save"
          onPress={handleSave}
          style={styles.footerButton}
          loading={isSaving}
          disabled={isSaving}
        >
          保存
        </Button>
        <Button
          mode="outlined"
          icon="share-variant"
          onPress={handleShare}
          style={styles.footerButton}
        >
          分享
        </Button>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNewDetection}
          style={styles.footerButton}
        >
          新的检测
        </Button>
        <Button
          mode="outlined"
          onPress={handleGoHome}
          style={styles.footerButton}
        >
          返回首页
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.background,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.background,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  scoreCard: {
    marginBottom: spacing.lg,
    elevation: 4,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 24,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  riskBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  riskText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  itemCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  riskBox: {
    backgroundColor: `${colors.danger}10`,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  riskLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  riskDescription: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  suggestionBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
  },
  suggestionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  recommendationCard: {
    elevation: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  recommendationBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  confidenceBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
});

