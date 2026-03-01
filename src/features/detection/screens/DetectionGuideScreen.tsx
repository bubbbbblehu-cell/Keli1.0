/**
 * 自查引导页面
 * 
 * 作用：
 * 1. 对每个选中的部位显示自查问题
 * 2. 显示风险提示
 * 3. 用户回答"有异常"或"正常"
 * 4. 记录自查结果
 * 5. 跳转到拍照页面
 * 
 * 使用场景：
 * - 从 DetectionHomeScreen 选择部位后进入
 * - 引导用户进行初步自查
 * 
 * 自查问题示例：
 * - 门锁：握住门把手摇晃，是否感觉到明显松动或听到零件撞击声？
 * - 窗户：观察窗外 1 米内是否有空调外机、水管或邻居阳台？
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, RadioButton } from 'react-native-paper';
import { useDetectionStore } from '../store/detectionStore';
import { DETECTION_TYPES } from '@shared/constants/detection';
import { colors, spacing, typography } from '@shared/constants/theme';

interface DetectionGuideScreenProps {
  route: any;
  navigation: any;
}

export default function DetectionGuideScreen({ route, navigation }: DetectionGuideScreenProps) {
  const { selectedTypes } = route.params;
  const { setSelfCheckResults } = useDetectionStore();

  // 自查结果状态
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 获取选中的检测部位详情
  const selectedDetectionTypes = DETECTION_TYPES.filter((type) =>
    selectedTypes.includes(type.id)
  );

  // 设置答案
  const handleSetAnswer = (typeId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [typeId]: answer }));
  };

  // 继续到拍照页面
  const handleContinue = () => {
    // 检查是否所有问题都已回答
    const allAnswered = selectedDetectionTypes.every((type) => answers[type.id]);
    if (!allAnswered) {
      alert('请回答所有问题');
      return;
    }

    // 保存自查结果
    const selfCheckResults = selectedDetectionTypes.map((type) => ({
      type: type.id,
      hasIssue: answers[type.id] === 'yes',
      note: type.question,
    }));
    setSelfCheckResults(selfCheckResults);

    // 跳转到拍照页面
    navigation.navigate('PhotoCapture', { selectedTypes, selfCheckResults });
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>自查引导</Text>
        <Text style={styles.subtitle}>请根据以下问题进行自查</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {selectedDetectionTypes.map((type, index) => (
          <Card key={type.id} style={styles.guideCard}>
            <Card.Content>
              {/* 部位标题 */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{type.icon}</Text>
                <Text style={styles.cardTitle}>
                  {index + 1}. {type.name}
                </Text>
              </View>

              {/* 自查问题 */}
              <View style={styles.questionBox}>
                <Text style={styles.questionLabel}>自查问题：</Text>
                <Text style={styles.questionText}>{type.question}</Text>
              </View>

              {/* 风险提示 */}
              <View style={styles.warningBox}>
                <Text style={styles.warningLabel}>⚠️ 风险提示：</Text>
                <Text style={styles.warningText}>{type.riskWarning}</Text>
              </View>

              {/* 答案选项 */}
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>您的答案：</Text>
                <RadioButton.Group
                  onValueChange={(value) => handleSetAnswer(type.id, value)}
                  value={answers[type.id] || ''}
                >
                  <View style={styles.radioOption}>
                    <RadioButton value="yes" />
                    <Text style={styles.radioLabel}>有异常</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="no" />
                    <Text style={styles.radioLabel}>正常</Text>
                  </View>
                </RadioButton.Group>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* 提示信息 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 完成自查后，下一步将拍摄照片进行 AI 智能分析
          </Text>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.footerButton}
        >
          返回
        </Button>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.footerButton}
        >
          继续拍照
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
  guideCard: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  questionBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: `${colors.warning}20`,
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginBottom: spacing.md,
  },
  warningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  answerBox: {
    marginTop: spacing.sm,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  radioLabel: {
    fontSize: 14,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
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

