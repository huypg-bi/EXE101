import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Calendar, Clock, MapPin, Users, Plus, ArrowLeft } from 'lucide-react';
import { matchService, courtService } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';

const LEVEL_STYLES = {
  BEGINNER: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  INTERMEDIATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  PRO: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
};

const BORDER_COLORS = {
  BEGINNER: 'border-green-500',
  INTERMEDIATE: 'border-blue-500',
  PRO: 'border-orange-500',
};

function Matches() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const matchesData = await matchService.getAll();
      setMatches(matchesData);
      
      const courtsData = await courtService.getAll();
      setCourts(courtsData);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi fetch dữ liệu matches:', err);
      setError(err.message || 'Lỗi kết nối server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoinMatch = async (matchId) => {
    try {
      if (!user) {
        alert('Vui lòng đăng nhập để tham gia trận giao lưu!');
        navigate('/login');
        return;
      }
      await matchService.join(matchId);
      alert('Đã tham gia trận đấu thành công!');
      loadData(); // reload
    } catch (err) {
      alert(err.message || 'Lỗi khi tham gia trận đấu');
    }
  };

  const handleLeaveMatch = async (matchId) => {
    const confirmLeave = window.confirm('Bạn có chắc chắn muốn rời khỏi trận đấu này không?');
    if (!confirmLeave) return;

    try {
      await matchService.leave(matchId);
      alert('Đã rời khỏi trận đấu thành công!');
      loadData(); // reload
    } catch (err) {
      alert(err.message || 'Lỗi khi rời trận đấu');
    }
  };

  const handleCreateMatch = async () => {
    try {
      if (!user) {
        alert('Vui lòng đăng nhập để tạo trận giao lưu!');
        navigate('/login');
        return;
      }
      
      const title = prompt('Nhập tiêu đề trận giao lưu của bạn:', 'Giao lưu cầu lông tối nay');
      if (!title) return;
      
      // Find suitable badminton court
      const badmintonCourt = courts.find(c => c.sport?.name === 'Cầu lông');
      if (!badmintonCourt) {
        alert('Không tìm thấy sân cầu lông nào hợp lệ để tổ chức!');
        return;
      }
      
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 3);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);
      
      const matchData = {
        title: title,
        description: 'Giao lưu vui vẻ, nâng cao sức khỏe và chia sẻ chi phí sân.',
        sport_id: badmintonCourt.sport_id,
        court_id: badmintonCourt.id,
        required_level: 'Intermediate',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        max_players: 4
      };
      
      await matchService.create(matchData);
      alert('Tạo trận giao lưu thành công!');
      loadData(); // reload
    } catch (err) {
      alert(err.message || 'Lỗi khi tạo trận giao lưu');
    }
  };

  const currentUserId = user?.id || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 z-40 px-4 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Trận đấu giao lưu</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Đang tải các trận đấu...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 px-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && matches.length === 0 && (
          <div className="text-center py-20 px-6 space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Chưa có trận đấu nào</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
              Hiện tại không có trận giao lưu nào được lên lịch. Bạn có muốn tạo một trận mới và mời mọi người tham gia không?
            </p>
            <button
              onClick={handleCreateMatch}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              Tạo trận đấu ngay
            </button>
          </div>
        )}

        {!isLoading && !error && matches.length > 0 && (
          <div className="space-y-4">
            {matches.map((match) => {
              const start = new Date(match.start_time);
              const hostName = match.host?.profile?.full_name || 'Người dùng';
              const levelUpper = (match.required_level || 'Intermediate').toUpperCase();
              
              // Find if current user is host or player
              const isHost = user && match.host?.email === user.email;
              const isJoined = user && match.participants?.some(p => p.user?.email === user.email && p.role === 'PLAYER');
              
              return (
                <div 
                  key={match.id}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border-l-4 ${BORDER_COLORS[levelUpper] ?? 'border-gray-400'} border-y border-r border-gray-100 dark:border-gray-800/80 shadow-sm p-4 space-y-3`}
                >
                  {/* Title & Host */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {match.title}
                      </h3>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${LEVEL_STYLES[levelUpper] ?? 'bg-gray-100 text-gray-600'}`}>
                        {levelUpper}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Host bởi: <span className="text-gray-600 dark:text-gray-300 font-semibold">{hostName}</span>
                    </p>
                  </div>

                  {/* Info details */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{start.toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      <span>{match.sport?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{match.participants?.length || 1} / {match.max_players} Players</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 border-t border-gray-200/50 dark:border-gray-700/50 pt-2 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{match.court?.venue?.name || 'Sân bãi'} • {match.court?.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[10px] text-gray-400">
                      Trạng thái: <span className={`font-bold ${match.status === 'OPEN' ? 'text-green-500' : 'text-orange-500'}`}>{match.status}</span>
                    </p>
                    
                    {isHost ? (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl">
                        Bạn là Host
                      </span>
                    ) : isJoined ? (
                      <button
                        onClick={() => handleLeaveMatch(match.id)}
                        className="text-xs font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950 px-4 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all animate-fade"
                      >
                        Rời trận
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinMatch(match.id)}
                        disabled={match.status !== 'OPEN'}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-1.5 rounded-xl transition-all shadow-sm shadow-blue-600/20"
                      >
                        Tham gia
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Create Button */}
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

export default Matches;
