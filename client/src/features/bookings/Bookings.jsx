import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogIn, Sparkles, LogOut, Crown } from 'lucide-react';
import gpsImg from '../../assets/svgs/gps.svg';
import arrowDownImg from '../../assets/svgs/arrow_down.svg';
import notificationImg from '../../assets/svgs/notification.svg';
import searchImg from '../../assets/svgs/search.svg';
import badmintonImg from '../../assets/icons/badminton.png';
import footballImg from '../../assets/icons/football.png';
import pickleballImg from '../../assets/icons/pickelball.png';
import tennisImg from '../../assets/icons/tennis.png';
import protonImg from '../../assets/images/ProtonBadmintonCenter.png';
import eliteImg from '../../assets/images/EliteFootballArena.png';
import CourtCard from '../home/components/CourtCard';
import Header from '../../shared/components/Header';
import { courtService } from '../../shared/services/api';

/* ─── Ưu đãi nhanh ─── */

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

/* ─── Danh mục môn thể thao ─── */

const MOCK_SPORTS = [
  { id: 1, name: 'Badminton', image: badmintonImg, key: 'badminton' },
  { id: 2, name: 'Football', image: footballImg, key: 'football' },
  { id: 3, name: 'Pickleball', image: pickleballImg, key: 'pickleball' },
  { id: 4, name: 'Tennis', image: tennisImg, key: 'tennis' },
];

/* ─── Skeleton Loading cho Court Card ─── */
function CourtCardSkeleton() {
  return (
    <div className="flex gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"></div>
      <div className="flex-1 py-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
      </div>
    </div>
  );
}

/* ─── Component chính ─── */

function Bookings() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSport, setSelectedSport] = useState(null);
  const [currentLocation] = useState('Hồ Chí Minh');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourts = async () => {
    setIsLoading(true);
    try {
      const data = await courtService.getAll();
      const mappedCourts = data.map(c => ({
        id: c.id,
        name: c.venue?.name || c.name, // Display venue name mainly
        rating: 4.8, // Mockup rating
        distance: 'Quận 9', // Default mock distance/district
        district: c.venue?.address?.split(',').pop()?.trim() || 'Quận 9', 
        price: c.price_per_hour ? `${Math.round(c.price_per_hour / 1000)}k/h` : '100k/h',
        sport: MOCK_SPORTS.find(s => s.id === c.sport_id || s.name === c.sport?.name)?.key || 'badminton',
        image: null // API doesn't provide images yet
      }));
      setCourts(mappedCourts);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sân:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleFilterSport = (sportId) => {
    const next = sportId === selectedSport ? null : sportId;
    setSelectedSport(next);
  };

  /* Lọc sân theo môn thể thao */
  const selectedSportKey = selectedSport
    ? MOCK_SPORTS.find((s) => s.id === selectedSport)?.key
    : null;

  const filteredCourts = selectedSportKey
    ? courts.filter((c) => c.sport === selectedSportKey)
    : courts;

  const handleBookCourt = (courtId) => {
    navigate(`/courts/${courtId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">

      {/* ── Thanh tiêu đề ── */}
      <Header 
        currentLocation={currentLocation}
        isDark={isDark}
        setIsDark={setIsDark}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        searchPlaceholder="Search sports, courts or areas..."
      />



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
                  className={`relative w-14 h-14 rounded-full overflow-hidden transition-all flex items-center justify-center ${
                    selectedSport === sport.id ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <img src={sport.image} alt={sport.name} className="w-full h-full object-cover" />
                  {selectedSport === sport.id && (
                    <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 pointer-events-none"></div>
                  )}
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

        {/* ── Nearby Courts ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Nearby Courts</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View Map</button>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <CourtCardSkeleton />
              <CourtCardSkeleton />
              <CourtCardSkeleton />
            </div>
          ) : filteredCourts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredCourts.map((court) => (
                <CourtCard key={court.id} court={court} onBook={handleBookCourt} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-2xl">🏟️</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No courts found for this sport</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try selecting a different sport</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default Bookings;
