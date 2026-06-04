import { motion } from 'motion/react';
import { Newspaper, ExternalLink, Flame, Calendar } from 'lucide-react';
import { StartupNews } from '../types';

interface StartupNewsFeedProps {
  news: StartupNews[];
}

export default function StartupNewsFeed({ news }: StartupNewsFeedProps) {
  return (
    <div id="startup-news-widget" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full sticky top-6">
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 tracking-tight text-base">Новые стартапы</h2>
            <p className="text-xs text-slate-400">Сводка GitHub & TatNet</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-full animate-pulse border border-amber-150">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>2026 Тренды</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
        {news.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Нет новостей по стартапам</p>
        ) : (
          news.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              key={item.id}
              className="group p-4 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition-colors duration-200 border border-slate-200/50 hover:border-blue-100"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  item.source === 'TatNet'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.source === 'GitHub'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {item.source}
                </span>
                
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.addedDate}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                {item.title}
              </h3>
              
              <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-3 flex justify-end">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 group-hover:underline cursor-pointer"
                >
                  <span>Подробнее</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-6 border-t border-slate-50 pt-4">
        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100/50">
          <span>Синхронизация по API:</span>
          <span className="font-mono text-emerald-500 font-semibold uppercase animate-pulse">● Активна</span>
        </div>
      </div>
    </div>
  );
}
