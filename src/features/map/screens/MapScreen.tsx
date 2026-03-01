/**
 * 地图主页面
 * 
 * 作用：
 * 1. 显示地图（react-native-maps）
 * 2. 显示酒店标记（Marker）
 * 3. 显示热力图（Circle）
 * 4. 点击标记显示酒店信息
 * 5. 点击标记跳转到酒店详情
 * 6. 显示统计信息（酒店总数、已评分数）
 * 7. 提供筛选控制（最低评分、热力图开关）
 * 
 * 使用场景：
 * - 用户登录后的主页面
 * - 查看城市内的酒店分布
 * - 点击酒店查看详情
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, FAB, Portal, Modal, Button, Slider } from 'react-native-paper';
import { useMapStore } from '../store/mapStore';
import { colors, spacing } from '@shared/constants/theme';
import { formatScore, getScoreColor } from '@shared/utils/format';
import { Loading } from '@shared/components/Loading';

interface MapScreenProps {
  navigation: any;
}

export default function MapScreen({ navigation }: MapScreenProps) {
  const {
    selectedCity,
    filteredHotels,
    heatmapData,
    isLoading,
    showHeatmap,
    minRating,
    setShowHeatmap,
    setMinRating,
    initializeCity,
  } = useMapStore();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempMinRating, setTempMinRating] = useState(minRating);

  // 初始化城市
  useEffect(() => {
    initializeCity();
  }, []);

  // 如果正在加载或没有选中城市，显示加载页面
  if (isLoading || !selectedCity) {
    return <Loading />;
  }

  // 地图初始区域
  const initialRegion = {
    latitude: selectedCity.latitude,
    longitude: selectedCity.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // 点击酒店标记
  const handleMarkerPress = (hotelId: string) => {
    navigation.navigate('HotelDetail', { hotelId });
  };

  // 应用筛选
  const applyFilter = () => {
    setMinRating(tempMinRating);
    setShowFilterModal(false);
  };

  // 重置筛选
  const resetFilter = () => {
    setTempMinRating(0);
    setMinRating(0);
    setShowFilterModal(false);
  };

  return (
    <View style={styles.container}>
      {/* 地图 */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* 热力图 */}
        {showHeatmap &&
          heatmapData.map((point, index) => (
            <Circle
              key={`heatmap-${index}`}
              center={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              radius={500 + point.weight * 200} // 根据权重调整半径
              fillColor={`${getScoreColor(point.weight * 5)}40`} // 40 是透明度
              strokeWidth={0}
            />
          ))}

        {/* 酒店标记 */}
        {filteredHotels.map((hotel) => (
          <Marker
            key={hotel.id}
            coordinate={{
              latitude: hotel.latitude,
              longitude: hotel.longitude,
            }}
            pinColor={getScoreColor(hotel.safetyScore)}
            onPress={() => handleMarkerPress(hotel.id)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{hotel.name}</Text>
                <Text style={styles.calloutScore}>
                  评分: {formatScore(hotel.safetyScore)}/5.0
                </Text>
                <Text style={styles.calloutReviews}>
                  {hotel.reviewCount} 条评价
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* 统计信息卡片 */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>{selectedCity.name}</Text>
        <Text style={styles.statsText}>
          酒店总数: {filteredHotels.length}
        </Text>
        <Text style={styles.statsText}>
          已评分: {filteredHotels.filter((h) => h.reviewCount > 0).length}
        </Text>
      </View>

      {/* 热力图开关按钮 */}
      <TouchableOpacity
        style={[styles.heatmapButton, showHeatmap && styles.heatmapButtonActive]}
        onPress={() => setShowHeatmap(!showHeatmap)}
      >
        <Text style={styles.heatmapButtonText}>
          {showHeatmap ? '🔥 热力图' : '🗺️ 标记'}
        </Text>
      </TouchableOpacity>

      {/* 城市切换按钮 */}
      <FAB
        icon="map-marker"
        style={styles.cityFab}
        onPress={() => navigation.navigate('CitySelection')}
        label="切换城市"
      />

      {/* 筛选按钮 */}
      <FAB
        icon="filter"
        style={styles.filterFab}
        onPress={() => setShowFilterModal(true)}
        label={minRating > 0 ? `≥${minRating}分` : '筛选'}
      />

      {/* 筛选弹窗 */}
      <Portal>
        <Modal
          visible={showFilterModal}
          onDismiss={() => setShowFilterModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>筛选条件</Text>

          <Text style={styles.filterLabel}>
            最低评分: {tempMinRating.toFixed(1)} 分
          </Text>
          <Slider
            value={tempMinRating}
            onValueChange={setTempMinRating}
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
          />

          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={resetFilter} style={styles.modalButton}>
              重置
            </Button>
            <Button mode="contained" onPress={applyFilter} style={styles.modalButton}>
              应用
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
  },
  map: {
    flex: 1,
  },
  statsCard: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  heatmapButton: {
    position: 'absolute',
    top: 50,
    right: spacing.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heatmapButtonActive: {
    backgroundColor: colors.primary,
  },
  heatmapButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  cityFab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.md,
  },
  filterFab: {
    position: 'absolute',
    bottom: 30,
    right: spacing.md,
  },
  callout: {
    width: 200,
    padding: spacing.sm,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  calloutScore: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  calloutReviews: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    margin: spacing.xl,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
});

