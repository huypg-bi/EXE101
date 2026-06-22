import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { bookingService } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';

function Bookings() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAll();
      // Sort: newest bookings first
      setBookings(data.sort((a, b) => b.id - a.id));
      setError(null);
    } catch (err) {
      console.error('Lỗi khi fetch bookings:', err);
      setError(err.message || 'Không thể tải danh sách đặt sân. Vui lòng đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setError('Vui lòng đăng nhập để xem danh sách đặt sân.');
        setIsLoading(false);
      } else {
        fetchBookings();
      }
    }
  }, [user, authLoading]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy lịch đặt sân này không?');
    if (!confirmCancel) return;

    try {
      await bookingService.cancel(bookingId);
      alert('Đã hủy đặt sân thành công!');
      fetchBookings(); // Reload list
    } catch (err) {
      alert(err.message || 'Lỗi khi hủy đặt sân');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 z-40 px-4 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Lịch đặt sân của tôi</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Đang tải lịch đặt sân...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 px-6 space-y-4">
            <XCircle className="w-14 h-14 text-red-500 mx-auto opacity-80" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {!isLoading && !error && bookings.length === 0 && (
          <div className="text-center py-20 px-6 space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Chưa có lịch đặt sân nào</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
              Bạn chưa thực hiện giao dịch đặt sân nào. Hãy tìm kiếm cụm sân phù hợp và đặt chỗ ngay!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-[#CDFF00] text-gray-900 text-sm font-bold rounded-xl hover:bg-[#b8e800] transition-all shadow-sm"
            >
              Tìm sân ngay
            </button>
          </div>
        )}

        {!isLoading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const start = new Date(booking.start_time);
              const end = new Date(booking.end_time);
              
              const isConfirmed = booking.status === 'confirmed';
              
              return (
                <div 
                  key={booking.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-4.5"
                >
                  {/* Court Header & Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {booking.court?.venue?.name || 'Cụm sân'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                        {booking.court?.name || 'Sân số'} ({booking.court?.sport?.name || 'Thể thao'})
                      </p>
                    </div>
                    <span 
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        isConfirmed 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                      }`}
                    >
                      {isConfirmed ? 'Đã xác nhận' : 'Đã hủy'}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-y border-gray-100 dark:border-gray-800 py-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{start.toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.court?.venue?.address || 'Địa chỉ sân'}</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-bold text-sm">
                        {booking.total_price.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    
                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs font-semibold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Hủy lịch đặt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Bookings;
