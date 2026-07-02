import React, { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, Building2, PlusCircle, Sparkles, Filter, RefreshCw, Trophy, Calendar } from 'lucide-react';
import { useSportFilter } from '../../shared/context/SportFilterContext';
import { useChat } from '../../shared/context/ChatContext';
import VenueCard from './components/VenueCard';
import HostSetupModal from './components/HostSetupModal';

import badmintonCenterImg from '../../assets/images/ProtonBadmintonCenter.png';
import footballArenaImg from '../../assets/images/EliteFootballArena.png';
import heroBgImg from '../../assets/images/hero_bg.png';

const INITIAL_VENUES = [
  {
    id: 1,
    name: 'Sân Cầu Lông Proton VIP Q10',
    sport: 'badminton',
    sportName: 'Cầu lông',
    sportEmoji: '🏸',
    address: '286 Thành Thái, Phường 14, Quận 10, TP.HCM',
    distance: '0.8 km',
    rating: 4.9,
    reviewCount: 42,
    price: '50.000đ',
    priceNumber: 50000,
    courtCount: 6,
    image: badmintonCenterImg,
    hostName: 'Anh Tuấn Proton',
    facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: true },
  },
  {
    id: 2,
    name: 'Sân Bóng Đá Cỏ Nhân Tạo Elite Q7',
    sport: 'football',
    sportName: 'Bóng đá',
    sportEmoji: '⚽',
    address: '45 Nguyễn Thị Thập, Tân Phong, Quận 7, TP.HCM',
    distance: '2.5 km',
    rating: 4.8,
    reviewCount: 56,
    price: '80.000đ',
    priceNumber: 80000,
    courtCount: 4,
    image: footballArenaImg,
    hostName: 'Chị Mai Elite',
    facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: true },
  },
  {
    id: 3,
    name: 'CLB Pickleball Thảo Điền Smash',
    sport: 'pickleball',
    sportName: 'Pickleball',
    sportEmoji: '🏓',
    address: '12 Quốc Hương, Thảo Điền, TP. Thủ Đức, TP.HCM',
    distance: '4.1 km',
    rating: 5.0,
    reviewCount: 31,
    price: '60.000đ',
    priceNumber: 60000,
    courtCount: 8,
    image: heroBgImg,
    hostName: 'Coach Hùng Pickle',
    facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: true },
  },
  {
    id: 4,
    name: 'Cụm Sân Tennis Phú Thọ Thể Thao',
    sport: 'tennis',
    sportName: 'Tennis',
    sportEmoji: '🎾',
    address: '219 Lý Thường Kiệt, Phường 15, Quận 11, TP.HCM',
    distance: '1.7 km',
    rating: 4.7,
    reviewCount: 28,
    price: '90.000đ',
    priceNumber: 90000,
    courtCount: 5,
    image: heroBgImg,
    hostName: 'Ban Quản Lý Phú Thọ',
    facilities: { wifi: true, parking: true, shower: true, canteen: false, rental: true },
  },
  {
    id: 5,
    name: 'Trung Tâm Bóng Rổ SSA Arena Q3',
    sport: 'basketball',
    sportName: 'Bóng rổ',
    sportEmoji: '🏀',
    address: '141 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
    distance: '3.0 km',
    rating: 4.9,
    reviewCount: 19,
    price: '70.000đ',
    priceNumber: 70000,
    courtCount: 3,
    image: footballArenaImg,
    hostName: 'Coach Long SSA',
    facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: true },
  },
  {
    id: 6,
    name: 'Nhà Thi Đấu Bóng Chuyền Tân Bình',
    sport: 'volleyball',
    sportName: 'Bóng chuyền',
    sportEmoji: '🏐',
    address: '448 Hoàng Văn Thụ, Phường 4, Tân Bình, TP.HCM',
    distance: '3.8 km',
    rating: 4.6,
    reviewCount: 22,
    price: '55.000đ',
    priceNumber: 55000,
    courtCount: 4,
    image: badmintonCenterImg,
    hostName: 'Anh Hoàng Tân Bình',
    facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: false },
  },
];

export default function Bookings() {
  const { selectedSport } = useSportFilter();
  const { openChat } = useChat();

  const [venues, setVenues] = useState(INITIAL_VENUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  const handleHostSave = (newVenue) => {
    setVenues(prev => [newVenue, ...prev]);
  };

  const handleOpenChat = (venue) => {
    openChat(venue.hostName || venue.name);
  };

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      // 1. Sport Filter
      if (selectedSport && selectedSport !== 'all' && venue.sport !== selectedSport) {
        return false;
      }
      // 2. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = venue.name.toLowerCase().includes(q);
        const matchAddr = venue.address.toLowerCase().includes(q);
        if (!matchName && !matchAddr) return false;
      }
      // 3. Location Filter
      if (locationFilter !== 'all') {
        if (!venue.address.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
      }
      // 4. Price Filter
      if (priceFilter !== 'all') {
        const p = venue.priceNumber || 50000;
        if (priceFilter === 'low' && p > 60000) return false;
        if (priceFilter === 'mid' && (p <= 60000 || p > 80000)) return false;
        if (priceFilter === 'high' && p <= 80000) return false;
      }
      return true;
    });
  }, [venues, selectedSport, searchTerm, locationFilter, priceFilter]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white pb-24 font-sans animate-in fade-in duration-300">
      
      {/* Hero Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#74C365] via-[#589470] to-[#001F3F] px-6 py-4 sm:py-5 sm:px-8 text-white shadow-xl mt-6 sm:mt-8 mb-6 sm:mb-8 overflow-hidden backdrop-blur-md border border-white/10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Hệ Thống Đặt Sân Trực Tuyến 24/7</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              Khám Phá & Đặt Sân Thể Thao
            </h1>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 bg-white/80 dark:bg-[#001F3F]/60 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-11 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#589470] transition-colors appearance-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-[#001F3F]">📍 Tất cả khu vực TP.HCM</option>
              <option value="Quận 10" className="bg-white dark:bg-[#001F3F]">Quận 10 (Thành Thái, Bắc Hải...)</option>
              <option value="Quận 7" className="bg-white dark:bg-[#001F3F]">Quận 7 (Nguyễn Thị Thập, Phú Mỹ Hưng...)</option>
              <option value="Thủ Đức" className="bg-white dark:bg-[#001F3F]">TP. Thủ Đức (Thảo Điền, An Phú...)</option>
              <option value="Quận 11" className="bg-white dark:bg-[#001F3F]">Quận 11 (Lý Thường Kiệt, Phú Thọ...)</option>
              <option value="Quận 3" className="bg-white dark:bg-[#001F3F]">Quận 3 (Võ Văn Tần, CMT8...)</option>
              <option value="Tân Bình" className="bg-white dark:bg-[#001F3F]">Quận Tân Bình (Hoàng Văn Thụ...)</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full pl-11 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#589470] transition-colors appearance-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-[#001F3F]">💵 Tất cả mức giá</option>
              <option value="low" className="bg-white dark:bg-[#001F3F]">Dưới 60.000đ / 30p</option>
              <option value="mid" className="bg-white dark:bg-[#001F3F]">Từ 60.000đ - 80.000đ / 30p</option>
              <option value="high" className="bg-white dark:bg-[#001F3F]">Trên 80.000đ / 30p (VIP)</option>
            </select>
          </div>
        </div>

        {(locationFilter !== 'all' || priceFilter !== 'all') && (
          <div className="flex justify-end mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={() => {
                setLocationFilter('all');
                setPriceFilter('all');
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* Venues Grid */}
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onChat={handleOpenChat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white/50 dark:bg-[#001F3F]/40 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-white/10 my-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Không tìm thấy khu sân nào phù hợp
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khu vực, mức giá khác xem sao nhé.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setLocationFilter('all');
              setPriceFilter('all');
            }}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#74C365] to-[#589470] text-white font-bold text-sm shadow-lg shadow-[#589470]/20 hover:opacity-90 transition-all"
          >
            Xem tất cả sân hiện có
          </button>
        </div>
      )}

      {/* Host Setup Modal */}
      <HostSetupModal 
        isOpen={isHostModalOpen} 
        onClose={() => setIsHostModalOpen(false)} 
        onSave={handleHostSave} 
      />

    </div>
  );
}
