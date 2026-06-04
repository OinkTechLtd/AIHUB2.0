#!/usr/bin/env python3
import json
import time
import re
from urllib.parse import urlparse
from datetime import datetime

try:
    from googlesearch import search
except ImportError:
    print("⚠️ Устанавливаю googlesearch-python...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'googlesearch-python'])
    from googlesearch import search

BLACKLIST_DOMAINS = [
    'facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'reddit.com',
    'linkedin.com', 'youtube.com', 'avito.ru', 'youla.ru', 'irr.ru',
    'professionals.ru', 'e1.ru', 'ngs.ru', '74.ru', 'vse42.ru'
]

EXISTING_TOOLS_FILE = 'tools.json'
QUERIES = [
    "нейросеть генератор кода российская",
    "искусственный интеллект код нейросеть Россия",
    "ИИ помощник для программистов сайт",
    "AI tools assistant",
    "top AI 2025 coding assistant",
    "лучшие нейросети 2025 для разработчиков"
]

ALLOWED_DOMAINS = [
    'coder-goai.lovable.app',
    'tatnet.dev',
    'gigacode.ru',
    'sourcecraft.yandex.ru',
    'yandex.ru', 
    'koda.ai',
    'qodo.ai'
]

def is_valid_url(url):
    if not url or not url.startswith(('http://', 'https://')):
        return False
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    if any(bad in domain for bad in BLACKLIST_DOMAINS):
        return False
    return True

def extract_domain(url):
    try:
        return urlparse(url).netloc.lower()
    except:
        return ""

def load_existing():
    try:
        with open(EXISTING_TOOLS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, dict) and "tools" in data:
                return data["tools"]
            return data if isinstance(data, list) else []
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_results(tools):
    output = {"tools": tools, "last_updated": datetime.now().isoformat()}
    with open(EXISTING_TOOLS_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"✅ Сохранено {len(tools)} инструментов в {EXISTING_TOOLS_FILE}")

def search_google(query, num_results=10):
    results = []
    try:
        for url in search(query, num_results=num_results):
            if is_valid_url(url):
                results.append(url)
            time.sleep(0.5)
    except Exception as e:
        print(f"⚠️ Ошибка Google: {e}")
    return results

def search_yandex(query):
    # Яндекс не имеет простого API, возвращаем пример
    return []

def main():
    print("🤖 Запуск поискового робота для AIHUB2.0...")
    existing_tools = load_existing()
    existing_domains = {extract_domain(tool.get("url", "")) for tool in existing_tools}
    new_tools = {tool["url"]: tool for tool in existing_tools}
    
    for query in QUERIES:
        print(f"\n🔍 Поиск: {query}")
        urls = search_google(query, num_results=15)
        for url in urls:
            domain = extract_domain(url)
            if domain in existing_domains:
                continue
            tool = {
                "name": domain.replace("www.", "").split('.')[0].capitalize(),
                "url": url,
                "category": "Программисту" if any(w in url for w in ["coder", "gigacode", "sourcecraft", "koda", "qodo"]) else "Пользователю",
                "description": f"ИИ инструмент с домена {domain}",
                "source": "google_search",
                "status": "unknown",
                "first_seen": datetime.now().isoformat()
            }
            new_tools[url] = tool
            print(f"  ➕ Добавлен: {tool['name']} ({domain})")
    
    final_tools = [
        {
            "name": "CoderGoAI",
            "url": "https://coder-goai.lovable.app",
            "category": "Программисту",
            "description": "ИИ-агент для автоматической генерации и рефакторинга кода через задачи на русском языке",
            "region": "Россия",
            "source": "manual",
            "status": "online"
        },
        {
            "name": "GigaCode 2.0",
            "url": "https://gigacode.ru",
            "category": "Программисту",
            "region": "Россия",
            "source": "manual",
            "status": "online"
        },
        {
            "name": "Yandex AI Studio",
            "url": "https://yandex.ru/ai",
            "category": "Пользователю",
            "region": "Россия",
            "source": "manual",
            "status": "online"
        }
    ]
    
    for tool in final_tools:
        if tool["url"] not in new_tools:
            new_tools[tool["url"]] = tool
            print(f"  ➕ Добавлен (вручную): {tool['name']}")
    
    save_results(list(new_tools.values()))
    print("\n✅ Поисковый робот завершил работу!")

if __name__ == "__main__":
    main()
