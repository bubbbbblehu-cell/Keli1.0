/**
 * 个人中心首页
 * 
 * 作用：
 * 1. 显示用户头像、昵称、邮箱
 * 2. 支持编辑个人信息
 * 3. 显示收藏数量、检测次数
 * 4. 跳转到收藏列表
 * 5. 跳转到检测历史
 * 6. 跳转到设置页面
 * 7. 退出登录按钮
 * 
 * 使用场景：
 * - 用户点击底部导航的"我的"标签进入
 * - 查看和编辑个人信息
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Card, List, Divider, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { useAuthStore } from '@features/auth/store/authStore';
import { useProfileStore } from '../store/profileStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { Loading } from '@shared/components/Loading';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuthStore();
  const { profile, favorites, detectionHistory, loadProfile, loadFavorites, loadDetectionHistory, updateProfile } = useProfileStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadProfile(),
          loadFavorites(),
          loadDetectionHistory(),
        ]);
      } catch (error) {
        console.error('Load profile data error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 打开编辑弹窗
  const handleOpenEdit = () => {
    setDisplayName(profile?.displayName || '');
    setShowEditModal(true);
  };

  // 保存个人信息
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      setShowEditModal(false);
      Alert.alert('成功', '个人信息已更新');
    } catch (error: any) {
      Alert.alert('失败', error.message || '更新失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert('失败', error.message || '退出失败，请重试');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 用户信息卡片 */}
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              {/* 头像 */}
              <Avatar.Text
                size={80}
                label={profile?.displayName?.charAt(0).toUpperCase() || 'U'}
                style={styles.avatar}
              />

              {/* 用户信息 */}
              <View style={styles.userInfo}>
                <Text style={styles.displayName}>{profile?.displayName || '用户'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
              </View>
            </View>

            {/* 编辑按钮 */}
            <Button
              mode="outlined"
              icon="pencil"
              onPress={handleOpenEdit}
              style={styles.editButton}
            >
              编辑资料
            </Button>
          </Card.Content>
        </Card>

        {/* 统计信息 */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('DetectionHistory')}
          >
            <Text style={styles.statValue}>{detectionHistory.length}</Text>
            <Text style={styles.statLabel}>检测</Text>
          </TouchableOpacity>
        </View>

        {/* 功能列表 */}
        <Card style={styles.menuCard}>
          <List.Item
            title="我的收藏"
            description="查看收藏的酒店"
            left={(props) => <List.Icon {...props} icon="heart" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Favorites')}
          />
          <Divider />
          <List.Item
            title="检测历史"
            description="查看历史检测记录"
            left={(props) => <List.Icon {...props} icon="history" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('DetectionHistory')}
          />
          <Divider />
          <List.Item
            title="设置"
            description="应用设置"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('提示', '设置功能开发中...')}
          />
        </Card>

        {/* 关于 */}
        <Card style={styles.menuCard}>
          <List.Item
            title="关于我们"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('关于', '女性安全地图 v3.0\n\n专为女性用户设计的酒店安全信息平台')}
          />
          <Divider />
          <List.Item
            title="隐私政策"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('提示', '隐私政策页面开发中...')}
          />
        </Card>

        {/* 退出登录按钮 */}
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={colors.danger}
        >
          退出登录
        </Button>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* 编辑资料弹窗 */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>编辑资料</Text>

          <TextInput
            label="昵称"
            value={displayName}
            onChangeText={setDisplayName}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowEditModal(false)}
              style={styles.modalButton}
              disabled={isSaving}
            >
              取消
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.modalButton}
              loading={isSaving}
              disabled={isSaving}
            >
              保存
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: spacing.lg,
    marginTop: 60,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  userInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    marginTop: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  menuCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 2,
  },
  logoutButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderColor: colors.danger,
  },
  bottomSpace: {
    height: 100,
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    margin: spacing.xl,
    borderRadius: 12,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
});

