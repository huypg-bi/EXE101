import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Award, LogOut, Info, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { user: userData, isLoading, logout } = useAuth();

  const error = (!isLoading && !userData) ? 'Vui lòng đăng nhập để xem thông tin cá nhân.' : null;

  const handleLogout = () => {
    logout();
    alert('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 z-40 px-4 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Hồ sơ cá nhân</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-5">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Đang tải hồ sơ...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 px-6 space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/20 rounded-2xl flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
              <User className="w-8 h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {!isLoading && !error && userData && (
          <div className="space-y-5">
            {/* Profile Card Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-blue-500 to-violet-600 opacity-80" />
              <div className="relative pt-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shrink-0">
                  <span className="text-white text-3xl font-bold select-none">
                    {(userData.profile?.full_name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white mt-3">
                  {userData.profile?.full_name || 'Người dùng mới'}
                </h2>
                <span className="text-xs text-gray-400 font-medium">Thành viên mới</span>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Thông tin chung
              </h3>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{userData.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {userData.profile?.district && userData.profile?.city 
                      ? `${userData.profile.district}, ${userData.profile.city}`
                      : 'Hồ Chí Minh, Việt Nam'
                    }
                  </span>
                </div>
                
                {userData.profile?.bio && (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400 italic">
                    "{userData.profile.bio}"
                  </div>
                )}
              </div>
            </div>

            {/* User Sports skill level card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Bộ môn yêu thích
                </h3>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-blue-500 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {userData.sports && userData.sports.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {userData.sports.map((userSport) => (
                    <div 
                      key={userSport.id}
                      className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/60 flex flex-col justify-between"
                    >
                      <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                        {userSport.sport?.name}
                      </span>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold">
                          {userSport.skill_level}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          ⭐ {userSport.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center text-xs py-2">Chưa thêm bộ môn nào</p>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất tài khoản
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
