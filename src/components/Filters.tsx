import { Search, SlidersHorizontal, Grid, Star, Power } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  targetAudience: 'programmers' | 'everyone';
  onTargetAudienceSelect: (audience: 'programmers' | 'everyone') => void;
  categories: string[];
  sortBy: 'date' | 'alphabet' | 'status';
  onSortChange: (sort: 'date' | 'alphabet' | 'status') => void;
  showOnlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
}

export default function Filters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  targetAudience,
  onTargetAudienceSelect,
  categories,
  sortBy,
  onSortChange,
  showOnlyFavorites,
  onToggleOnlyFavorites,
}: FiltersProps) {
  return (
    <div id="catalog-controls" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 mb-6">
      
      {/* Tab Selectors & Favorites Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        
        {/* Audience Nav Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            id="tab-programmers"
            onClick={() => onTargetAudienceSelect('programmers')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              targetAudience === 'programmers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            💻 Для Программистов
          </button>
          
          <button
            id="tab-everyone"
            onClick={() => onTargetAudienceSelect('everyone')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              targetAudience === 'everyone'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            👥 Для Всех Пользователей
          </button>
        </div>

        {/* Favorites and Special Filters */}
        <div className="flex items-center gap-3">
          <button
            id="toggle-fav-only"
            onClick={onToggleOnlyFavorites}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
              showOnlyFavorites
                ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white shadow-sm'
                : 'bg-white hover:bg-slate-55 border-slate-200 text-slate-750'
            }`}
          >
            <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
            <span>Только избранные</span>
          </button>
        </div>

      </div>

      {/* Row: Search, Category list, Sort selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Search Input (4 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-405" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по названию или описанию ИИ..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Sorting Dropdown (3 cols) */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'date' | 'alphabet' | 'status')}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-55 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="date">🕒 Сначала новые</option>
            <option value="alphabet">🔤 По алфавиту</option>
            <option value="status">🟢 По работоспособности</option>
          </select>
        </div>

        {/* Legend / API Status Details (4 cols) */}
        <div className="lg:col-span-4 flex items-center justify-end text-[11px] text-slate-400 space-x-4 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
          <span className="font-semibold text-slate-500">Легенда:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Рабочий</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Нестабильный</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Offline</span>
          </div>
        </div>

      </div>

      {/* Category Chips container (horizontal scrolling or wrap) */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
          <Grid className="w-3.5 h-3.5" /> Фильтр по категориям
        </span>
        
        <div className="flex flex-wrap gap-2">
          <button
            id="cat-chip-all"
            onClick={() => onCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 border border-slate-150 text-slate-650 hover:bg-slate-100'
            }`}
          >
            Все категории ({categories.length})
          </button>

          {categories.map((category) => (
            <button
              id={`cat-chip-${category.toLowerCase().replace(/\s+/g, '-')}`}
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-150 text-slate-650 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
