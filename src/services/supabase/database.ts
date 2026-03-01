import { supabase } from './client';
import { Hotel, Review, City } from '@shared/types';

export const databaseService = {
  // 获取城市列表
  async getCities(): Promise<City[]> {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  },

  // 获取酒店列表
  async getHotels(cityId: string): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('city_id', cityId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  },

  // 获取酒店详情
  async getHotelDetail(hotelId: string): Promise<Hotel | null> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotelId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 获取酒店评价
  async getHotelReviews(hotelId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 添加评价
  async addReview(review: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 收藏酒店
  async addFavorite(userId: string, hotelId: string) {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, hotel_id: hotelId });
    
    if (error) throw error;
  },

  // 取消收藏
  async removeFavorite(userId: string, hotelId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('hotel_id', hotelId);
    
    if (error) throw error;
  },

  // 获取收藏列表
  async getFavorites(userId: string): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('hotel:hotels(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data?.map((item: any) => item.hotel) || [];
  },
};

