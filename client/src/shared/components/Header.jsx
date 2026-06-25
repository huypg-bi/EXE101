import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Moon, Sun, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../../features/profile/EditProfileModal';

import gpsImg from '../../assets/svgs/gps.svg';
import arrowDownImg from '../../assets/svgs/arrow_down.svg';
import notificationImg from '../../assets/svgs/notification.svg';
import searchImg from '../../assets/svgs/search.svg';
import badmintonImg from '../../assets/icons/badminton.png';
import pickleballImg from '../../assets/icons/pickelball.png';
import tennisImg from '../../assets/icons/tennis.png';
import footballImg from '../../assets/icons/football.png';

const SPORT_ICONS = {
  'Badminton': badmintonImg,
  'Tennis': tennisImg,
  'Football': footballImg,
  'Pickleball': pickleballImg,
};

function Header({ 
  currentLocation = 'Hồ Chí Minh', 
  isDark, 
  setIsDark, 
  searchKeyword,
  setSearchKeyword,
  searchPlaceholder = "Search..."
}) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, updateProfile } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const getAvatarLetter = () => {
    const name = user?.profile?.full_name || user?.email || '';
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 z-40 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        {/* Chọn vị trí */}
        <button className="flex items-center gap-1.5">
          <img src={gpsImg} alt="location" className="w-4 h-4 shrink-0" />
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{currentLocation}</span>
          <img src={arrowDownImg} alt="expand" className="w-3.5 h-3.5 dark:invert" />
        </button>

        {/* Các icon bên phải */}
        <div className="flex items-center gap-2">
          {/* Chuyển đổi giao diện sáng/tối */}
          <button
            onClick={() => setIsDark((d) => !d)}
            className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun className="w-4 h-4 text-yellow-400" />
              : <Moon className="w-4 h-4 text-gray-600" />
            }
          </button>

          {/* Thông báo */}
          <button className="relative p-1">
            <img src={notificationImg} alt="notifications" className="w-5 h-5 dark:invert" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
          </button>

          {/* Nút Premium */}
          <button className="relative overflow-hidden group bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium</span>
            <div className="absolute inset-0 w-[200%] -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer pointer-events-none"></div>
          </button>

          {/* Avatar */}
          {isAuthenticated && (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <span className="text-white text-xs font-bold select-none">
                  {getAvatarLetter()}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 text-white text-lg font-bold">
                        {getAvatarLetter()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                          {user?.profile?.full_name || user?.email || ''}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Trình độ môn thể thao</h5>
                      
                      {Object.entries(SPORT_ICONS).map(([sportName, icon]) => {
                        const userSport = user?.sports?.find(s => s.sport.name === sportName);
                        const level = userSport ? userSport.skill_level : 'Chưa biết';
                        return (
                          <div key={sportName} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                              <img src={icon} alt={sportName} className="w-5 h-5 rounded-md object-cover" />
                              {sportName}
                            </span>
                            <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                              level !== 'Chưa biết' 
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                                : 'text-gray-500 bg-gray-100 dark:bg-gray-800'
                            }`}>
                              {level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                      {/* Nút chỉnh sửa thông tin luôn được hiển thị vì Modal giờ nằm trong Header */}
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-bold py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        Chỉnh sửa thông tin
                      </button>
                      <button 
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-500 font-bold py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      {setSearchKeyword && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2.5">
          <img src={searchImg} alt="search" className="w-4 h-4 shrink-0 opacity-40 dark:invert" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
        </div>
      )}

      {/* Edit Profile Modal (Global) */}
      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(data) => {
          updateProfile(data);
        }}
      />
    </header>
  );
}

export default Header;
