/**
 * 城市选择页面
 * 
 * 作用：
 * 1. 显示支持的城市列表（按国家分组）
 * 2. 选择城市后保存到本地
 * 3. 跳转到地图页面
 * 
 * 使用场景：
 * - 首次启动应用时显示
 * - 用户想切换城市时显示
 * 
 * 支持的城市：
 * - 🇨🇳 中国: 西双版纳、贵阳、上海
 * - 🇹🇭 泰国: 曼谷
 * - 🇮🇹 意大利: 那不勒斯
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useMapStore } from '../store/mapStore';
import { CITIES } from '@shared/constants/cities';
import { colors, spacing, typography } from '@shared/constants/theme';
import { City } from '@shared/types';

interface CitySelectionScreenProps {
  navigation: any;
}

export default function CitySelectionScreen({ navigation }: CitySelectionScreenProps) {
  const { selectedCity, setSelectedCity } = useMapStore();

  // 按国家分组城市
  const citiesByCountry = CITIES.reduce((acc, city) => {
    if (!acc[city.country]) {
      acc[city.country] = [];
    }
    acc[city.country].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  // 选择城市
  const handleSelectCity = async (city: City) => {
    await setSelectedCity(city);
    navigation.goBack();
  };

  // 国家旗帜映射
  const countryFlags: Record<string, string> = {
    '中国': '🇨🇳',
    '泰国': '🇹🇭',
    '意大利': '🇮🇹',
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>选择城市</Text>
        <Text style={styles.subtitle}>查看不同城市的酒店安全信息</Text>
      </View>

      {/* 城市列表 */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {Object.entries(citiesByCountry).map(([country, cities]) => (
          <View key={country} style={styles.countrySection}>
            {/* 国家标题 */}
            <Text style={styles.countryTitle}>
              {countryFlags[country] || '🌍'} {country}
            </Text>

            {/* 城市卡片 */}
            {cities.map((city) => (
              <TouchableOpacity
                key={city.id}
                onPress={() => handleSelectCity(city)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.cityCard,
                    selectedCity?.id === city.id && styles.cityCardSelected,
                  ]}
                >
                  <Card.Content>
                    <View style={styles.cityCardContent}>
                      <View style={styles.cityInfo}>
                        <Text style={styles.cityName}>{city.name}</Text>
                        <Text style={styles.cityCode}>{city.code}</Text>
                      </View>
                      {selectedCity?.id === city.id && (
                        <Text style={styles.selectedIcon}>✓</Text>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 提示信息 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 更多城市正在陆续添加中...
          </Text>
        </View>
      </ScrollView>
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
  countrySection: {
    marginBottom: spacing.xl,
  },
  countryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  cityCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cityCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cityCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cityCode: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

