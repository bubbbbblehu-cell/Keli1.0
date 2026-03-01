import { City } from '../types';

export const CITIES: City[] = [
  {
    id: 'xishuangbanna',
    code: 'xishuangbanna',
    name: '西双版纳',
    country: '中国',
    latitude: 22.0084,
    longitude: 100.7979,
    isActive: true,
  },
  {
    id: 'guiyang',
    code: 'guiyang',
    name: '贵阳',
    country: '中国',
    latitude: 26.6470,
    longitude: 106.6302,
    isActive: true,
  },
  {
    id: 'shanghai',
    code: 'shanghai',
    name: '上海',
    country: '中国',
    latitude: 31.2304,
    longitude: 121.4737,
    isActive: true,
  },
  {
    id: 'bangkok',
    code: 'bangkok',
    name: '曼谷',
    country: '泰国',
    latitude: 13.7563,
    longitude: 100.5018,
    isActive: true,
  },
  {
    id: 'naples',
    code: 'naples',
    name: '那不勒斯',
    country: '意大利',
    latitude: 40.8518,
    longitude: 14.2681,
    isActive: true,
  },
];

export const DEFAULT_CITY = CITIES[0];

