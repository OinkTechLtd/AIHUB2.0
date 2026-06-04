import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RefreshCw, Terminal, Info, Play, Download, Settings, Github, SlidersHorizontal, AlertCircle, FileText } from 'lucide-react';
import { AITool, StartupNews } from './types';
import Header from './components/Header';
import Filters from './components/Filters';
import AIToolCard from './components/AIToolCard';
import StartupNewsFeed from './components/StartupNewsFeed';

export default function App() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [startups, setStartups] = useState<StartupNews[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [targetAudience, setTargetAudience] = useState<'programmers' | 'everyone'>('programmers');
  const [sortBy, setSortBy] = useState<'date' | 'alphabet' | 'status'>('date');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // URL status check state
  const [statusChecks, setStatusChecks] = useState<Record<string, 'working' | 'unstable' | 'offline' | 'checking'>>({});
  
  // Simulated isHoliday states to allow live testing
  const [isHolidayMockActive, setIsHolidayMockActive] = useState<boolean>(false);
  const [showHolidayMode, setShowHolidayMode] = useState<boolean>(false);

  // Check if standard New Year Period operates (Dec 25 to Jan 10)
  const isActualNewYearPeriod = (): boolean => {
    const now = new Date();
    const month = now.getMonth(); // 11 is December, 0 is January
    const date = now.getDate();
    return (month === 11 && date >= 25) || (month === 0 && date <= 10);
  };

  const isCustomNewYearMode = isHolidayMockActive || isActualNewYearPeriod();

  // Load tools and startups
  useEffect(() => {
    // Determine whether to enable New Year mode by default based on actual date
    if (isActualNewYearPeriod()) {
      setShowHolidayMode(true);
      setIsHolidayMockActive(true);
    }

    // Fetch Tools from static JSON
    fetch('/tools.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tools catalog');
        return res.json();
      })
      .then((data: AITool[]) => {
        setTools(data);
        // Trigger status checks once tools are loaded
        triggerUrlsStatusCheck(data);
      })
      .catch((err) => console.error(err));

    // Fetch Startups from static JSON
    fetch('/startups.json')
      .then((res) => {
         if (!res.ok) throw new Error('Failed to load startups feed');
         return res.json();
      })
      .then((data: StartupNews[]) => {
         setStartups(data);
      })
      .catch((err) => console.error(err));

    // Load favorites from LocalStorage
    const storedFavs = localStorage.getItem('ai_hub_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error('Failed to parse favorites storage', e);
      }
    }
  }, []);

  // Sync favorites with localStorage
  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fid) => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('ai_hub_favorites', JSON.stringify(updated));
  };

  // Perform a background head fetch to each tool's URL
  const triggerUrlsStatusCheck = async (toolsList: AITool[]) => {
    const initialStatuses: Record<string, 'checking' | 'unstable' | 'offline' | 'working'> = {};
    toolsList.forEach((t) => {
      initialStatuses[t.id] = 'checking';
    });
    setStatusChecks((prev) => ({ ...prev, ...initialStatuses }));

    // Start fetching
    toolsList.forEach(async (tool) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        // Run clean fetch probe using mode 'no-cors' so CORS pings go through safely.
        // We also check real, existing endpoints. 
        await fetch(tool.url, {
          mode: 'no-cors',
          signal: controller.signal,
          headers: {
            'User-Agent': isCustomNewYearMode ? 'HappyNewYearBot/2.0' : 'AIHubBot/2.0',
          }
        });
        
        clearTimeout(timeoutId);
        setStatusChecks((prev) => ({ ...prev, [tool.id]: 'working' }));
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          // Took longer than 5 seconds - unstable
          setStatusChecks((prev) => ({ ...prev, [tool.id]: 'unstable' }));
        } else {
          // If connection fails (e.g. holiday mockup mock domains that are offline), Offline.
          // For real domains that might block localhost/Cors but are actually working, 
          // let's double check if they are known active sites, we could assign working.
          // But to be fully realistic, if DNS resolves (successful or CORS opaque), we set working.
          // If it fails with TypeError on fake domains, we mark it offline. This makes perfect sense!
          setStatusChecks((prev) => ({ ...prev, [tool.id]: 'offline' }));
        }
      }
    });
  };

  // Trigger check manually
  const handleManualRecheck = () => {
    triggerUrlsStatusCheck(tools);
  };

  // Categories extraction
  const getCategories = () => {
    const currentTools = tools.filter((t) => {
      // If holiday, show only if holiday mode active
      if (t.isHoliday && !showHolidayMode) return false;
      return true;
    });
    const unique = Array.from(new Set(currentTools.map((t) => t.category))) as string[];
    return unique;
  };

  // Dynamic filter lists
  const filteredTools = tools
    .filter((tool) => {
      // 1. Audience Tab Filter
      if (tool.targetAudience !== targetAudience) return false;

      // 2. Holiday Filter: Hide holiday-specific tools if holiday mode is disabled
      if (tool.isHoliday && !showHolidayMode) return false;

      // 3. Category Filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;

      // 4. Favorites Only
      if (showOnlyFavorites && !favorites.includes(tool.id)) return false;

      // 5. Search query matching
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(query);
        const matchesDesc = tool.description.toLowerCase().includes(query);
        const matchesCat = tool.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // First, always rank priority items (CoderGoAI, TatNet, GigaCode, Russian AI Map) at the top!
      const prioA = a.isPriority ? 1 : 0;
      const prioB = b.isPriority ? 1 : 0;
      if (prioA !== prioB) {
        return prioB - prioA;
      }

      if (sortBy === 'alphabet') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        const statusA = statusChecks[a.id] || (a.working ? 'working' : 'offline');
        const statusB = statusChecks[b.id] || (b.working ? 'working' : 'offline');
        
        const priority: Record<string, number> = { working: 3, unstable: 2, offline: 1, checking: 0 };
        return (priority[statusB] || 0) - (priority[statusA] || 0);
      }
      // Default: date (latest added)
      return b.addedDate.localeCompare(a.addedDate);
    });

  // Calculate stats for header
  const visibleTools = tools.filter(t => !t.isHoliday || showHolidayMode);
  const totalCount = visibleTools.length;
  const workingCount = visibleTools.filter(t => {
    const status = statusChecks[t.id];
    if (status) return status === 'working';
    return t.working;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      
      {/* Top Banner indicating technical specs of crawler */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 bg-blue-500 text-white rounded">
              <Terminal className="w-3.5 h-3.5" /> GHA CRAWLER
            </span>
            <span className="font-mono">
              Поисковый робот <code className="text-slate-100">update_ai_list.py</code> запускается по крону <b>каждые 6 часов</b> UTC (с обходом капчи и блокировок через BuxarParser).
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <a href="/sitemap.xml" target="_blank" className="hover:text-white underline inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> sitemap.xml
            </a>
            <a href="/robots.txt" target="_blank" className="hover:text-white underline inline-flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> robots.txt
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">VER: 2026.1</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Header Applet Component */}
        <Header
          totalTools={totalCount}
          workingToolsCount={workingCount}
          isHolidayMockActive={isHolidayMockActive}
          onToggleHolidayMock={() => {
            const next = !isHolidayMockActive;
            setIsHolidayMockActive(next);
            setShowHolidayMode(next);
          }}
          showHolidayMode={showHolidayMode}
          onToggleShowHolidayMode={() => setShowHolidayMode(!showHolidayMode)}
          favoritesCount={favorites.length}
          isCustomNewYearMode={isCustomNewYearMode}
        />

        {/* Dynamic Instruction info card about TatNet & GitHub actions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-blue-500/15 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 md:max-w-2xl">
            <h4 id="quick-hint-title" className="font-bold text-slate-900 tracking-tight text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Интеграция с GitHub Actions & Деплой на TatNet
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Скрипт проверяет работоспособность каждого URL и встраивает новые ИИ на основе трендов GitHub, TatNet и YCombinator. Мы создали для вас подробные спецификации робота и деплоя внутри проекта.
            </p>
          </div>
          
          <button
            onClick={handleManualRecheck}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 text-xs font-bold shadow-sm cursor-pointer hover:shadow transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Перепроверить пинг URL</span>
          </button>
        </div>

        {/* Content Layout Grid: 12 Cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main List: Filters & Tools (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter controls widget */}
            <Filters
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              selectedCategory={selectedCategory}
              onCategorySelect={(cat) => setSelectedCategory(cat)}
              targetAudience={targetAudience}
              onTargetAudienceSelect={(aud) => {
                setTargetAudience(aud);
                setSelectedCategory('all'); // reset category when tab shifts
              }}
              categories={getCategories()}
              sortBy={sortBy}
              onSortChange={(sort) => setSortBy(sort)}
              showOnlyFavorites={showOnlyFavorites}
              onToggleOnlyFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
            />

            {/* Catalog list Container */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
                  Результаты: {filteredTools.length} / {totalCount} инструментов найдено
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    Сбросить поиск
                  </button>
                )}
              </div>

              {filteredTools.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 space-y-3">
                  <p className="text-base font-semibold">Ничего не найдено</p>
                  <p className="text-xs">Попробуйте изменить параметры поиска или активируйте другой фильтр.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool) => (
                      <AIToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorite={favorites.includes(tool.id)}
                        onToggleFavorite={handleToggleFavorite}
                        statusUrlCheck={statusChecks[tool.id]}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

          </div>

          {/* Right sidebar block (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
            <StartupNewsFeed news={startups} />
          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <footer className="border-t border-slate-200/50 bg-white mt-20 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-bold text-slate-700">AI HUB 2.0 &copy; 2026. Лицензия MIT.</p>
            <p>Агрегатор технологических стартапов и инструментов искусственного интеллекта TatNet.</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <span>HappyNewYearBot/2.0</span>
            <span className="text-slate-200">|</span>
            <span>SEO Оптимизировано (Google & Яндекс)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
