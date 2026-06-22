import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Moon, Sun, LogIn } from 'lucide-react';
import gpsImg from '../../assets/images/gps.svg';
import arrowDownImg from '../../assets/images/arrow_down.svg';
import notificationImg from '../../assets/images/notification.svg';
import searchImg from '../../assets/images/search.svg';
import CourtCard from './components/CourtCard';
import MatchCard from './components/MatchCard';
import badmintonImg from '../../assets/images/badminton.svg';
import footballImg from '../../assets/images/football.svg';
import pickleballImg from '../../assets/images/pickleball.svg';
import tennisImg from '../../assets/images/tennis.svg';
import { courtService, matchService, bookingService } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';

/* ─── Dữ liệu mẫu ─── */
const MOCK_FLASH_DEALS = [
  {
    id: 1,
    tag: 'HAPPY HOUR',
    tagStyle: 'bg-[#CDFF00] text-gray-900',
    headline: '40% OFF Weekday Mornings',
    bgClass: 'bg-[#0D1117]',
    watermark: 'HAPPY HOUR',
  },
  {
    id: 2,
    tag: 'LIMITED TIME',
    tagStyle: 'bg-green-600 text-white',
    headline: 'Book First Go Free',
    bgClass: 'bg-[#0A2010]',
    watermark: 'LIMITED TIME',
  },
];

const MOCK_SPORTS = [
  { id: 1, name: 'Badminton', image: badmintonImg },
  { id: 2, name: 'Football', image: footballImg },
  { id: 3, name: 'Pickleball', image: pickleballImg },
  { id: 4, name: 'Tennis', image: tennisImg },
];

/* ─── Component chính ─── */
function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSport, setSelectedSport] = useState(null);
  const [currentLocation] = useState('Hồ Chí Minh');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [courts, setCourts] = useState([]);
  const [matches, setMatches] = useState([]);

  const isLoggedIn = !!user;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const courtsData = await courtService.getAll();
        setCourts(courtsData);
        
        const matchesData = await matchService.getAll();
        setMatches(matchesData);
      } catch (err) {
        console.error('Lỗi khi fetch dữ liệu dashboard:', err);
      }
    };
    loadData();
  }, []);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleFilterSport = (sportId) => {
    setSelectedSport(sportId === selectedSport ? null : sportId);
  };

  const handleBookCourt = async (courtId) => {
    try {
      if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để đặt sân!');
        navigate('/login');
        return;
      }
      
      const court = courts.find(c => c.id === courtId);
      if (!court) return;
      
      const priceText = `${court.price_per_hour.toLocaleString('vi-VN')} VNĐ/h`;
      const priceVal = court.price_per_hour * 2;
      
      const confirmBooking = window.confirm(`Bạn muốn đặt sân này trong 2 giờ tới với giá ${priceVal.toLocaleString('vi-VN')} VNĐ chứ?`);
      if (!confirmBooking) return;
      
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);
      
      const bookingData = {
        court_id: courtId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        total_price: priceVal
      };
      
      await bookingService.create(bookingData);
      alert('Đặt sân thành công! Đang chuyển đến danh sách đặt sân...');
      navigate('/bookings');
    } catch (err) {
      alert(err.message || 'Lỗi khi đặt sân');
    }
  };

  const handleJoinMatch = async (matchId) => {
    try {
      if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để tham gia trận đấu!');
        navigate('/login');
        return;
      }
      await matchService.join(matchId);
      alert('Đã tham gia trận đấu thành công!');
      
      // Refresh matches list
      const matchesData = await matchService.getAll();
      setMatches(matchesData);
    } catch (err) {
      alert(err.message || 'Lỗi khi tham gia trận đấu');
    }
  };

  const handleCreateMatch = async () => {
    try {
      if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để tạo trận giao lưu!');
        navigate('/login');
        return;
      }
      
      const title = prompt('Nhập tiêu đề trận giao lưu của bạn:', 'Giao lưu cầu lông cuối tuần');
      if (!title) return;
      
      // Find suitable badminton court
      const badmintonCourt = courts.find(c => c.sport?.name === 'Cầu lông');
      if (!badmintonCourt) {
        alert('Không tìm thấy sân cầu lông hợp lệ nào để tổ chức!');
        return;
      }
      
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 3);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);
      
      const matchData = {
        title: title,
        description: 'Giao lưu vui vẻ, nâng cao sức khỏe và trình độ.',
        sport_id: badmintonCourt.sport_id,
        court_id: badmintonCourt.id,
        required_level: 'Intermediate',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        max_players: 4
      };
      
      await matchService.create(matchData);
      alert('Tạo trận giao lưu thành công!');
      
      // Refresh matches list
      const matchesData = await matchService.getAll();
      setMatches(matchesData);
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo trận giao lưu');
    }
  };

  const handleLogout = () => {
    logout();
    alert('Đã đăng xuất!');
  };

  // Client-side filtering
  const filteredCourts = courts.filter(court => {
    const matchesSearch = searchKeyword
      ? `${court.venue?.name} ${court.name} ${court.venue?.address}`.toLowerCase().includes(searchKeyword.toLowerCase())
      : true;
    const matchesSport = selectedSport
      ? (selectedSport === 1 && court.sport?.name === 'Cầu lông') ||
        (selectedSport === 2 && court.sport?.name === 'Bóng đá') ||
        (selectedSport === 3 && court.sport?.name === 'Pickleball') ||
        (selectedSport === 4 && court.sport?.name === 'Tennis')
      : true;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">

      {/* ── Thanh tiêu đề ── */}
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
              onClick={() => setIsDark(d => !d)}
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

            {/* Đăng nhập / Đăng xuất */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 px-2.5 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                Đăng xuất
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-2.5 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Avatar người dùng */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold select-none">
                {isLoggedIn ? (user.profile?.full_name || user.email).charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2.5">
          <img src={searchImg} alt="search" className="w-4 h-4 shrink-0 opacity-40 dark:invert" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search sports, courts or areas..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
        </div>
      </header>

      <div className="px-4 pt-5 space-y-7">

        {/* ── Ưu đãi nhanh ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Flash Deals</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {MOCK_FLASH_DEALS.map((deal) => (
              <div
                key={deal.id}
                className={`shrink-0 w-72 h-40 ${deal.bgClass} rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden cursor-pointer`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-white/[0.07] text-6xl font-black tracking-widest whitespace-nowrap">
                    {deal.watermark}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full w-fit mb-2 ${deal.tagStyle}`}>
                  {deal.tag}
                </span>
                <p className="text-white font-bold text-sm leading-snug">{deal.headline}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Danh mục môn thể thao ── */}
        <section>
          <div className="flex justify-around">
            {MOCK_SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleFilterSport(sport.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedSport === sport.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <img src={sport.image} alt={sport.name} className="w-8 h-8 object-contain" />
                </div>
                <span className={`text-xs font-medium ${selectedSport === sport.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Sân gần đây ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Nearby Courts</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View Map</button>
          </div>
          <div className="flex flex-col gap-3">
            {filteredCourts.map((court) => {
              const mappedCourt = {
                id: court.id,
                name: `${court.venue?.name || 'Sân đấu'} - ${court.name}`,
                rating: 4.8,
                distance: '1.2 km',
                district: court.venue?.address?.split(',').slice(-2, -1)[0]?.trim() || 'Quận 7',
                price: `${(court.price_per_hour / 1000).toFixed(0)}k/h`,
                sport: court.sport?.name === 'Cầu lông' ? 'badminton' : (court.sport?.name === 'Bóng đá' ? 'football' : (court.sport?.name === 'Pickleball' ? 'pickleball' : 'tennis')),
                image: null
              };
              return <CourtCard key={court.id} court={mappedCourt} onBook={handleBookCourt} />;
            })}
            {filteredCourts.length === 0 && (
              <p className="text-gray-500 text-center text-sm py-4">Không có sân nào phù hợp</p>
            )}
          </div>
        </section>

        {/* ── Tham gia trận đấu ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Join a Match</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium" onClick={() => navigate('/matches')}>View All</button>
          </div>
          <div className="flex flex-col gap-3">
            {matches.map((match) => {
              const userName = match.host?.profile?.full_name || 'Người dùng';
              const mappedMatch = {
                id: match.id,
                userName: userName,
                level: ['BEGINNER', 'INTERMEDIATE', 'PRO'].includes(match.required_level.toUpperCase()) ? match.required_level.toUpperCase() : 'INTERMEDIATE',
                sport: match.sport?.name || 'Thể thao',
                time: new Date(match.start_time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) + ', ' + new Date(match.start_time).toLocaleDateString('vi-VN'),
                avatarBadge: userName.charAt(0).toUpperCase()
              };
              return <MatchCard key={match.id} match={mappedMatch} onJoin={handleJoinMatch} />;
            })}
            {matches.length === 0 && (
              <p className="text-gray-500 text-center text-sm py-4">Không có trận đấu nào</p>
            )}
          </div>
        </section>

      </div>

      {/* ── Nút hành động nổi ── */}
      <button
        onClick={handleCreateMatch}
        className="fixed bottom-20 right-5 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/40 hover:bg-blue-500 active:scale-95 transition-all z-40"
        aria-label="Tạo trận mới"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}

export default Dashboard;
