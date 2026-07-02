import { useNavigate } from 'react-router-dom';
import { Gamepad2, CalendarCheck, ShieldCheck } from 'lucide-react';
import heroBgImg from '../../assets/images/hero_bg.png';
function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent text-slate-900 dark:text-[#F6F7ED] relative z-50 w-full overflow-x-clip font-sans transition-colors duration-500 selection:bg-[#589470]/30">

      {/* ── Hero Banner (Full Width with Slanted Divider) ── */}
      <div className="relative w-full h-[450px] md:h-[560px] bg-slate-900 overflow-visible" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0% 100%)' }}>
        {/* Background Image */}
        <img 
          src={heroBgImg} 
          alt="Badminton court" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-95 scale-105 transition-transform duration-1000 hover:scale-100" 
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/45 transition-colors duration-500" />

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 -mt-16">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-3 drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
            SportGo
          </h1>
          <p className="text-xl md:text-3xl font-semibold text-white max-w-3xl drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] tracking-wide">
            Chơi đúng người - Ghép đúng trình độ
          </p>
        </div>
      </div>

      {/* ── Overlapping Thumbnail Image (Left aligned, on top of slant) ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-16">
        <div className="absolute -top-32 md:-top-44 left-6 md:left-16 z-30">
          <div className="w-44 h-44 md:w-64 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden border-[6px] border-white dark:border-[#1E488F] shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-white dark:bg-[#001F3F] transition-all hover:scale-105 duration-300">
            <img 
              src={heroBgImg} 
              alt="Court thumbnail" 
              className="w-full h-full object-cover object-[70%_50%] scale-125" 
            />
          </div>
        </div>
      </div>

      {/* ── 3-Column Features Section (Clean layout matching palettes) ── */}
      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          
          {/* Game Rooms */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Gamepad2 className="w-12 h-12 text-[#589470] dark:text-[#DBE64C] transition-colors duration-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#589470] dark:text-[#DBE64C] tracking-wide transition-colors duration-500">
              Game Rooms:
            </h3>
            <p className="text-base md:text-lg text-slate-700 dark:text-[#F6F7ED]/85 leading-relaxed font-normal transition-colors duration-500">
              Nơi người chơi lẻ tự tạo phòng chờ để tìm bạn chơi phù hợp theo thời gian, trình độ hoặc địa điểm, hỗ trợ đầy đủ tính năng chat, bấm tham gia và xác nhận vào nhóm.
            </p>
          </div>

          {/* Bookings */}
          <div className="flex flex-col">
            <div className="mb-4">
              <CalendarCheck className="w-12 h-12 text-slate-900 dark:text-[#F6F7ED] transition-colors duration-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-[#F6F7ED] tracking-wide transition-colors duration-500">
              Bookings:
            </h3>
            <p className="text-base md:text-lg text-slate-700 dark:text-[#F6F7ED]/85 leading-relaxed font-normal transition-colors duration-500">
              Hệ thống đặt sân trực tiếp cho phép người chơi xem dịch vụ và chọn khung giờ linh hoạt, đồng thời giúp chủ sân chủ động quản lý số lượng, thiết lập giá và chat với khách hàng.
            </p>
          </div>

          {/* Teams */}
          <div className="flex flex-col">
            <div className="mb-4">
              <ShieldCheck className="w-12 h-12 text-slate-900 dark:text-[#F6F7ED] transition-colors duration-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-[#F6F7ED] tracking-wide transition-colors duration-500">
              Teams:
            </h3>
            <p className="text-base md:text-lg text-slate-700 dark:text-[#F6F7ED]/85 leading-relaxed font-normal transition-colors duration-500">
              Tính năng trả phí giúp các đội nhóm đẩy bài đăng lên top forum và tích lũy đánh giá sao từ người trải nghiệm để tăng uy tín, từ đó thu hút thành viên dễ dàng hơn.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;
