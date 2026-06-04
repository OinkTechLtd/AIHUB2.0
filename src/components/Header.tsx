import { Sparkles, Calendar, Server, Heart } from 'lucide-react';

interface HeaderProps {
  totalTools: number;
  workingToolsCount: number;
  isHolidayMockActive: boolean;
  onToggleHolidayMock: () => void;
  showHolidayMode: boolean;
  onToggleShowHolidayMode: () => void;
  favoritesCount: number;
  isCustomNewYearMode: boolean;
}

export default function Header({
  totalTools,
  workingToolsCount,
  isHolidayMockActive,
  onToggleHolidayMock,
  showHolidayMode,
  onToggleShowHolidayMode,
  favoritesCount,
  isCustomNewYearMode
}: HeaderProps) {
  // Calculate percentage
  const workingPercentage = totalTools > 0 ? Math.round((workingToolsCount / totalTools) * 105) : 100;
  // Keep it limited to max 100
  const cleanPercentage = Math.min(workingPercentage, 100);

  return (
    <header className="relative bg-gradient-to-br from-slate-900 via-slate-805 to-blue-950 text-white rounded-3xl overflow-hidden shadow-xl mb-8 border border-white/5">
      {/* Dynamic background lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Decorative snowfall or holiday overlay if Holiday Mode Active */}
      {showHolidayMode && (
        <div className="absolute inset-0 bg-radial-[circle_at_top] from-red-500/5 via-transparent to-transparent pointer-events-none" />
      )}

      <div className="p-8 md:p-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* Main Titles */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 transition-colors rounded-full text-xs font-semibold backdrop-blur-md text-blue-300">
              <Sparkles className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Главный маркетплейс нейросетей</span>
            </div>

            <div className="space-y-2">
              <h1 id="app-title" className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                AI HUB 2.0
              </h1>
              <p className="text-slate-300 max-w-xl text-sm md:text-base leading-relaxed">
                Сверхбыстрый интеллектуальный агрегатор нейросетей, веб-сервисов и стартапов с автоматическим поисковым роботом и фоновой проверкой жизнеспособности сайтов в реальном времени.
              </p>
            </div>
          </div>

          {/* Quick status dashboard */}
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            {/* Health Stat */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-36 md:w-40">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Работоспособность</span>
              <p className="text-2xl font-extrabold mt-1 text-emerald-400 font-mono">
                {cleanPercentage}%
              </p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${cleanPercentage}%` }}
                />
              </div>
            </div>

            {/* Total Count */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-36 md:w-40">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Всего инструментов</span>
              <p className="text-2xl font-extrabold mt-1 text-blue-300 font-mono">
                {totalTools} <span className="text-xs font-normal text-slate-400">серв.</span>
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>БД синхронизирована</span>
              </div>
            </div>

            {/* Favorites Star Count */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-36 md:w-40">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">В избранном</span>
              <p className="text-2xl font-extrabold mt-1 text-amber-300 font-mono flex items-center gap-1.5">
                {favoritesCount}
                <Heart className="w-5 h-5 text-amber-400 fill-current" />
              </p>
              <span className="text-[10px] text-slate-400 block mt-2">
                Сохранено в LocalStorage
              </span>
            </div>
          </div>

        </div>

        {/* Holiday Mode Controls */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">
              Праздничный статус робота: 
            </span>
            <span className={`text-xs ml-1 font-bold ${isCustomNewYearMode ? 'text-red-400' : 'text-slate-400'}`}>
              {isCustomNewYearMode ? 'Новогодний режим 🎆 ("HappyNewYearBot/2.0")' : 'Стандартный'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Simple toggle inputs to let the user play with holiday feature easily since actual date might be different than Dec 25 */}
            <label className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5 cursor-pointer transition-colors text-xs select-none">
              <input
                type="checkbox"
                checked={isHolidayMockActive}
                onChange={onToggleHolidayMock}
                className="rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 accent-blue-500"
              />
              <span>Симулировать канун Нового Года (25 дек – 10 янв)</span>
            </label>

            <button
              onClick={onToggleShowHolidayMode}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                showHolidayMode
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              🎄 {showHolidayMode ? 'Новогодние AI Включены!' : 'Показать Новогодние AI'}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
