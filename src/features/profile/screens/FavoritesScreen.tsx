/**
 * 收藏列表页面
 * 
 * 作用：
 * 1. 显示所有收藏的酒店
 * 2. 每个酒店显示名称、城市、评分
 * 3. 点击跳转到酒店详情
 * 4. 支持取消收藏
 * 
 * 使用场景：
 * - 从 ProfileScreen 点击"我的收藏"进入
 * - 查看收藏的酒店
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useProfileStore } from '../store/profileStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { formatScore, getScoreColor } from '@shared/utils/format';
import { Loading } from '@shared/components/Loading';
import { Hotel } from '@shared/types';

interface FavoritesScreenProps {
  navigation: any;
}

export default function FavoritesScreen({ navigation }: FavoritesScreenProps) {
  const { favorites, isLoading, loadFavorites, removeFavorite } = useProfileStore();

  // 加载收藏列表
  useEffect(() => {
    loadFavorites();
  }, []);

  // 取消收藏
  const handleRemoveFavorite = (hotelId: string, hotelName: string) => {
    Alert.alert('取消收藏', `确定要取消收藏"${hotelName}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFavorite(hotelId);
          } catch (error: any) {
            Alert.alert('失败', error.message || '操作失败，请重试');
          }
        },
      },
    ]);
  };

  // 跳转到酒店详情
  const handleViewHotel = (hotelId: string) => {
    navigation.navigate('MapTab', {
      screen: 'HotelDetail',
      params: { hotelId },
    });
  };

  // 渲染酒店卡片
  const renderHotelItem = ({ item }: { item: Hotel }) => (
    <TouchableOpacity
      onPress={() => handleViewHotel(item.id)}
      activeOpacity={0.7}
    >
      <Card style={styles.hotelCard}>
        <Card.Content>
          <View style={styles.cardContent}>
            {/* 酒店信息 */}
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.hotelAddress} numberOfLines={1}>
                {item.address}
              </Text>

              {/* 评分 */}
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
                <Text style={styles.reviewCount}>
                  ({item.reviewCount} 条评价)
                </Text>
              </View>
            </View>

            {/* 取消收藏按钮 */}
            <IconButton
              icon="heart"
              iconColor={colors.danger}
              size={24}
              onPress={() => handleRemoveFavorite(item.id, item.name)}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // 空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>暂无收藏</Text>
      <Text style={styles.emptyText}>
        在地图页面点击酒店详情，{'\n'}
        然后点击收藏按钮即可添加收藏
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
        <Text style={styles.title}>我的收藏</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 收藏列表 */}
      <FlatList
        data={favorites}
        renderItem={renderHotelItem}
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
  hotelCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hotelAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
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

