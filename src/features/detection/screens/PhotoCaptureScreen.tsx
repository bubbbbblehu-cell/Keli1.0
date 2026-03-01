/**
 * 拍照上传页面
 * 
 * 作用：
 * 1. 为每个部位拍摄照片
 * 2. 支持调用相机拍照
 * 3. 支持从相册选择
 * 4. 照片预览
 * 5. 自动压缩照片（最大 1920x1920, 85% 质量）
 * 6. 上传照片到服务器
 * 7. 调用 AI 分析
 * 
 * 使用场景：
 * - 从 DetectionGuideScreen 完成自查后进入
 * - 拍摄酒店房间照片
 * 
 * 注意：
 * - 照片回传给 Agent 的功能由另一位朋友开发
 * - 此页面负责调用 Coze AI API 进行分析
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useDetectionStore } from '../store/detectionStore';
import { DETECTION_TYPES } from '@shared/constants/detection';
import { colors, spacing, typography } from '@shared/constants/theme';

interface PhotoCaptureScreenProps {
  route: any;
  navigation: any;
}

export default function PhotoCaptureScreen({ route, navigation }: PhotoCaptureScreenProps) {
  const { selectedTypes, selfCheckResults } = route.params;
  const { addPhoto, removePhoto, photos, analyzePhotos, isAnalyzing } = useDetectionStore();

  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  // 获取选中的检测部位详情
  const selectedDetectionTypes = DETECTION_TYPES.filter((type) =>
    selectedTypes.includes(type.id)
  );
  const currentType = selectedDetectionTypes[currentTypeIndex];

  // 请求相机权限
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相机权限', '请在设置中允许访问相机');
      return false;
    }
    return true;
  };

  // 请求相册权限
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相册权限', '请在设置中允许访问相册');
      return false;
    }
    return true;
  };

  // 压缩图片
  const compressImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }], // 最大宽度 1920px
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Compress image error:', error);
      return uri;
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        addPhoto({ uri: compressedUri, type: currentType.id });
        
        // 自动进入下一个部位
        if (currentTypeIndex < selectedDetectionTypes.length - 1) {
          setCurrentTypeIndex(currentTypeIndex + 1);
        }
      }
    } catch (error) {
      console.error('Take photo error:', error);
      Alert.alert('拍照失败', '请重试');
    }
  };

  // 从相册选择
  const handlePickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        addPhoto({ uri: compressedUri, type: currentType.id });
        
        // 自动进入下一个部位
        if (currentTypeIndex < selectedDetectionTypes.length - 1) {
          setCurrentTypeIndex(currentTypeIndex + 1);
        }
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('选择失败', '请重试');
    }
  };

  // 删除照片
  const handleRemovePhoto = (index: number) => {
    Alert.alert('删除照片', '确定要删除这张照片吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => removePhoto(index),
      },
    ]);
  };

  // 开始分析
  const handleAnalyze = async () => {
    if (photos.length === 0) {
      Alert.alert('提示', '请至少上传一张照片');
      return;
    }

    try {
      const result = await analyzePhotos();
      navigation.navigate('DetectionResult', { result });
    } catch (error: any) {
      Alert.alert('分析失败', error.message || '请稍后重试');
    }
  };

  // 获取当前部位的照片
  const currentTypePhotos = photos.filter((photo) => photo.type === currentType.id);

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>拍照检测</Text>
        <Text style={styles.subtitle}>
          {currentTypeIndex + 1}/{selectedDetectionTypes.length} - {currentType.name}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 当前部位信息 */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.typeHeader}>
              <Text style={styles.typeIcon}>{currentType.icon}</Text>
              <Text style={styles.typeName}>{currentType.name}</Text>
            </View>
            <Text style={styles.typeDescription}>{currentType.description}</Text>
          </Card.Content>
        </Card>

        {/* 拍照按钮 */}
        <View style={styles.captureButtons}>
          <Button
            mode="contained"
            icon="camera"
            onPress={handleTakePhoto}
            style={styles.captureButton}
          >
            拍照
          </Button>
          <Button
            mode="outlined"
            icon="image"
            onPress={handlePickImage}
            style={styles.captureButton}
          >
            相册
          </Button>
        </View>

        {/* 当前部位的照片预览 */}
        {currentTypePhotos.length > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>已拍摄照片</Text>
            <View style={styles.previewGrid}>
              {currentTypePhotos.map((photo, index) => (
                <View key={index} style={styles.previewItem}>
                  <Image source={{ uri: photo.uri }} style={styles.previewImage} />
                  <IconButton
                    icon="close-circle"
                    size={24}
                    iconColor={colors.danger}
                    style={styles.removeButton}
                    onPress={() => {
                      const globalIndex = photos.findIndex((p) => p.uri === photo.uri);
                      handleRemovePhoto(globalIndex);
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 部位切换 */}
        <View style={styles.navigationButtons}>
          <Button
            mode="outlined"
            onPress={() => setCurrentTypeIndex(Math.max(0, currentTypeIndex - 1))}
            disabled={currentTypeIndex === 0}
            style={styles.navButton}
          >
            上一个
          </Button>
          <Button
            mode="outlined"
            onPress={() =>
              setCurrentTypeIndex(
                Math.min(selectedDetectionTypes.length - 1, currentTypeIndex + 1)
              )
            }
            disabled={currentTypeIndex === selectedDetectionTypes.length - 1}
            style={styles.navButton}
          >
            下一个
          </Button>
        </View>

        {/* 所有照片预览 */}
        <View style={styles.allPhotosSection}>
          <Text style={styles.sectionTitle}>
            所有照片 ({photos.length}/{selectedDetectionTypes.length})
          </Text>
          {selectedDetectionTypes.map((type) => {
            const typePhotos = photos.filter((photo) => photo.type === type.id);
            return (
              <View key={type.id} style={styles.typePhotoRow}>
                <Text style={styles.typePhotoLabel}>
                  {type.icon} {type.name}
                </Text>
                <Text style={styles.typePhotoCount}>
                  {typePhotos.length > 0 ? '✓' : '○'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.footerButton}
          disabled={isAnalyzing}
        >
          返回
        </Button>
        <Button
          mode="contained"
          onPress={handleAnalyze}
          style={styles.footerButton}
          loading={isAnalyzing}
          disabled={isAnalyzing || photos.length === 0}
        >
          {isAnalyzing ? '分析中...' : '开始分析'}
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
  infoCard: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  typeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  typeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  captureButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  captureButton: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  previewSection: {
    marginBottom: spacing.lg,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  previewItem: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  navButton: {
    flex: 1,
  },
  allPhotosSection: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  typePhotoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typePhotoLabel: {
    fontSize: 14,
    color: colors.text,
  },
  typePhotoCount: {
    fontSize: 18,
    color: colors.primary,
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

