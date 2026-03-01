/**
 * 酒店详情页面
 * 
 * 作用：
 * 1. 显示酒店名称、地址、评分
 * 2. 显示评价列表
 * 3. 提供添加评价功能
 * 4. 提供收藏/取消收藏按钮
 * 5. 跳转到在线平台（Booking.com）
 * 
 * 使用场景：
 * - 从地图页面点击酒店标记进入
 * - 从收藏列表点击酒店进入
 * 
 * 注意：
 * - 评价数据由另一位朋友负责抓取
 * - 此页面只负责从数据库读取和显示
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Divider, TextInput, Portal, Modal, IconButton } from 'react-native-paper';
import { useHotelStore } from '../store/hotelStore';
import { colors, spacing, typography } from '@shared/constants/theme';
import { formatScore, formatDate, getScoreColor } from '@shared/utils/format';
import { Loading } from '@shared/components/Loading';

interface HotelDetailScreenProps {
  route: any;
  navigation: any;
}

export default function HotelDetailScreen({ route, navigation }: HotelDetailScreenProps) {
  const { hotelId } = route.params;
  const {
    currentHotel,
    reviews,
    isLoading,
    isFavorite,
    loadHotelDetail,
    addReview,
    toggleFavorite,
  } = useHotelStore();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 加载酒店详情
  useEffect(() => {
    loadHotelDetail(hotelId);
  }, [hotelId]);

  // 提交评价
  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert('请输入评价内容');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(hotelId, rating, comment);
      setShowReviewModal(false);
      setComment('');
      setRating(5);
      alert('评价提交成功！');
    } catch (error: any) {
      alert(error.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 切换收藏
  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(hotelId);
    } catch (error: any) {
      alert(error.message || '操作失败，请重试');
    }
  };

  // 跳转到 Booking.com
  const handleOpenBooking = () => {
    if (currentHotel) {
      const url = `https://www.booking.com/search.html?ss=${encodeURIComponent(currentHotel.name)}`;
      Linking.openURL(url);
    }
  };

  if (isLoading || !currentHotel) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          iconColor={isFavorite ? colors.danger : colors.text}
          onPress={handleToggleFavorite}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* 酒店信息卡片 */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.hotelName}>{currentHotel.name}</Text>
            <Text style={styles.hotelAddress}>{currentHotel.address}</Text>

            {/* 评分 */}
            <View style={styles.scoreContainer}>
              <Text
                style={[
                  styles.scoreText,
                  { color: getScoreColor(currentHotel.safetyScore) },
                ]}
              >
                {formatScore(currentHotel.safetyScore)}
              </Text>
              <Text style={styles.scoreLabel}>/5.0</Text>
              <Text style={styles.reviewCount}>
                ({currentHotel.reviewCount} 条评价)
              </Text>
            </View>

            {/* 操作按钮 */}
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={() => setShowReviewModal(true)}
                style={styles.actionButton}
              >
                添加评价
              </Button>
              <Button
                mode="outlined"
                onPress={handleOpenBooking}
                style={styles.actionButton}
              >
                在线预订
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* 评价列表 */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>用户评价</Text>

          {reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无评价</Text>
              <Text style={styles.emptySubtext}>成为第一个评价的人吧！</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} style={styles.reviewCard}>
                <Card.Content>
                  {/* 评分 */}
                  <View style={styles.reviewHeader}>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} style={styles.star}>
                          {star <= review.rating ? '⭐' : '☆'}
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.reviewDate}>
                      {formatDate(review.createdAt)}
                    </Text>
                  </View>

                  {/* 评价内容 */}
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* 添加评价弹窗 */}
      <Portal>
        <Modal
          visible={showReviewModal}
          onDismiss={() => setShowReviewModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>添加评价</Text>

          {/* 星级评分 */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>评分：</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={styles.starLarge}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 评价内容 */}
          <TextInput
            label="评价内容"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            mode="outlined"
            style={styles.commentInput}
          />

          {/* 按钮 */}
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowReviewModal(false)}
              style={styles.modalButton}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmitReview}
              style={styles.modalButton}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              提交
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    margin: spacing.lg,
    elevation: 4,
  },
  hotelName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  hotelAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 24,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  reviewsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  reviewCard: {
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  starLarge: {
    fontSize: 32,
    marginRight: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  ratingLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: spacing.md,
  },
  commentInput: {
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

