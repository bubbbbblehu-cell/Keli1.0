/**
 * 检测首页
 * 
 * 作用：
 * 1. 显示 6 个检测部位（门锁、窗户、镜子、浴室、插座、路由器）
 * 2. 支持多选
 * 3. 至少选择 1 个部位才能继续
 * 4. 跳转到自查引导页面
 * 
 * 使用场景：
 * - 用户点击底部导航的"检测"标签进入
 * - 开始新的检测流程
 * 
 * 检测部位：
 * 1. 🔒 门锁安全检查
 * 2. 🪟 窗户外部检查
 * 3. 🪞 双面镜检测
 * 4. 🚿 浴室通风口检查
 * 5. 🔌 插座与面板检查
 * 6. 📡 路由器与信号检查
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Checkbox } from 'react-native-paper';
import { useDetectionStore } from '../store/detectionStore';
import { DETECTION_TYPES } from '@shared/constants/detection';
import { colors, spacing, typography } from '@shared/constants/theme';

interface DetectionHomeScreenProps {
  navigation: any;
}

export default function DetectionHomeScreen({ navigation }: DetectionHomeScreenProps) {
  const { selectedTypes, selectType, deselectType, resetDetection } = useDetectionStore();

  // 重置检测状态
  useEffect(() => {
    resetDetection();
  }, []);

  // 切换选择
  const handleToggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      deselectType(typeId);
    } else {
      selectType(typeId);
    }
  };

  // 继续到自查引导
  const handleContinue = () => {
    if (selectedTypes.length === 0) {
      alert('请至少选择一个检测部位');
      return;
    }
    navigation.navigate('DetectionGuide', { selectedTypes });
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>安全检测</Text>
        <Text style={styles.subtitle}>选择需要检测的部位</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 检测部位列表 */}
        {DETECTION_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.id);

          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => handleToggleType(type.id)}
              activeOpacity={0.7}
            >
              <Card style={[styles.typeCard, isSelected && styles.typeCardSelected]}>
                <Card.Content>
                  <View style={styles.typeCardContent}>
                    {/* 图标和信息 */}
                    <View style={styles.typeInfo}>
                      <Text style={styles.typeIcon}>{type.icon}</Text>
                      <View style={styles.typeText}>
                        <Text style={styles.typeName}>{type.name}</Text>
                        <Text style={styles.typeDescription}>{type.description}</Text>
                      </View>
                    </View>

                    {/* 复选框 */}
                    <Checkbox
                      status={isSelected ? 'checked' : 'unchecked'}
                      onPress={() => handleToggleType(type.id)}
                    />
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* 提示信息 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 检测说明</Text>
          <Text style={styles.infoText}>
            1. 选择需要检测的部位（可多选）{'\n'}
            2. 根据引导进行自查{'\n'}
            3. 拍摄照片上传{'\n'}
            4. AI 智能分析并给出建议
          </Text>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          已选择 {selectedTypes.length} 个部位
        </Text>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={selectedTypes.length === 0}
          style={styles.continueButton}
        >
          继续
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
  typeCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  typeCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  typeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  typeText: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  typeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedCount: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  continueButton: {
    paddingVertical: spacing.sm,
  },
});

