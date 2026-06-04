import { motion } from 'motion/react';
import { Star, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Zap } from 'lucide-react';
import { AITool } from '../types';

interface AIToolCardProps {
  key?: string;
  tool: AITool;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  statusUrlCheck: 'working' | 'unstable' | 'offline' | 'checking' | undefined;
}

const categoryColors: Record<string, string> = {
  'AI-кодинг': 'bg-blue-50 text-blue-700 border-blue-100',
  'Генерация текста': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Нейросети': 'bg-purple-50 text-purple-700 border-purple-100',
  'Стартапы': 'bg-amber-50 text-amber-700 border-amber-100',
  'Праздники': 'bg-rose-50 text-rose-700 border-rose-100 border-dashed animate-pulse',
};

const sourceLabels: Record<string, string> = {
  github: 'GitHub',
  tatnet: 'TatNet',
  producthunt: 'Product Hunt',
  ycombinator: 'YCombinator',
  other: 'Каталог',
};

export default function AIToolCard({ tool, isFavorite, onToggleFavorite, statusUrlCheck }: AIToolCardProps) {
  const status = statusUrlCheck || (tool.working ? 'working' : 'offline');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      id={`tool-card-${tool.id}`}
      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Decorative top-border or highlight for Holiday / New tools */}
      {tool.isHoliday && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-emerald-500 to-red-500" />
      )}
      {tool.isNew && !tool.isHoliday && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      )}

      <div>
        {/* Header: Badges & Favorite */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[tool.category] || 'bg-slate-50 text-slate-700 border-slate-100'}`}>
              {tool.category}
            </span>
            {tool.isNew && (
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                <Zap className="w-3 h-3 fill-current" /> NEW
              </span>
            )}
            {tool.isHoliday && (
              <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded animate-bounce">
                🎄 2026 🎄
              </span>
            )}
          </div>
          
          <button
            id={`btn-fav-${tool.id}`}
            onClick={() => onToggleFavorite(tool.id)}
            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              isFavorite
                ? 'bg-amber-50 border-amber-100 text-amber-500 hover:bg-amber-100'
                : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & URL Source */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          <span className="font-mono text-[10px] uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            Источник: {sourceLabels[tool.source] || tool.source}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-6 font-sans leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer Area with Status URL Checks & Button */}
      <div className="border-t border-slate-50 pt-4 flex items-center justify-between mt-auto">
        {/* Dynamic Status Display */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {status === 'checking' && (
            <span id={`status-label-${tool.id}`} className="inline-flex items-center gap-1 text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>Проверка...</span>
            </span>
          )}
          {status === 'working' && (
            <span id={`status-label-${tool.id}`} className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-current" />
              <span>Рабочий ✅</span>
            </span>
          )}
          {status === 'unstable' && (
            <span id={`status-label-${tool.id}`} className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-current text-white" />
              <span>Нестабильный 🟡</span>
            </span>
          )}
          {status === 'offline' && (
            <span id={`status-label-${tool.id}`} className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Недоступен 🔴</span>
            </span>
          )}
        </div>

        {/* Action Button */}
        <a
          id={`btn-open-${tool.id}`}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 shadow-sm hover:bg-blue-600 hover:shadow-md transition-all duration-300 px-4 py-2 rounded-xl cursor-pointer"
        >
          <span>Открыть</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
