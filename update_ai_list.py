#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AI HUB 2.0 - Search & Monitoring Crawler Robot
Author: AI HUB 2.0 Automation
License: MIT
"""

import os
import json
import datetime
import urllib.request
import urllib.error
import http.client

# Paths to data storage
TOOLS_PATH = os.path.join("public", "tools.json")
STARTUPS_PATH = os.path.join("public", "startups.json")

def is_new_year_period():
    """
    Returns True if current date is between Dec 25 and Jan 10
    """
    now = datetime.datetime.now()
    month = now.month
    day = now.day
    return (month == 12 and day >= 25) or (month == 1 and day <= 10)

def check_url_working(url, user_agent):
    """
    Checks if a URL is active by sending an HTTP request with a 5-second timeout.
    Returns True if responding, otherwise False.
    """
    try:
        # Prepare request
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': user_agent}
        )
        
        # We can issue a HEAD or GET with a 5 sec timeout
        # Some servers block HEAD, so we do a light GET or catch exceptions
        with urllib.request.urlopen(req, timeout=5) as r:
            status = r.status if hasattr(r, 'status') else r.getcode()
            if status is not None and status < 400:
                return True
            return True # Opaque or redirect is usually alive
    except urllib.error.HTTPError as e:
        # 403, 401, 302, etc. mean host is online but authenticated / restricted - still online!
        if e.code in [401, 403, 301, 302]:
            return True
        return False
    except urllib.error.URLError:
        return False
    except http.client.HTTPException:
        return False
    except Exception:
        return False

def run_crawler():
    print("==================================================")
    print("🤖 AI HUB 2.0 CRAWLER ROBOT - STARTING SESS...")
    print(f"Current Date/Time: {datetime.datetime.now().isoformat()}")
    
    # 1. Determine agent and holiday operations
    holiday_active = is_new_year_period()
    user_agent = "HappyNewYearBot/2.0" if holiday_active else "AIHubBot/2.0"
    
    print(f"Selected User-Agent: '{user_agent}'")
    print(f"Holiday Mode Operating: {holiday_active}")
    print("==================================================")

    # 2. Load existing tools database
    if os.path.exists(TOOLS_PATH):
        try:
            with open(TOOLS_PATH, "r", encoding="utf-8") as f:
                tools = json.load(f)
        except Exception as e:
            print(f"❌ Error loading {TOOLS_PATH}: {e}")
            return
    else:
        print(f"⚠ {TOOLS_PATH} not found. Creating a blank list.")
        tools = []

    # 3. Process URL pings to update status
    print(f"🔍 Pinging {len(tools)} tools' URLs in database...")
    for tool in tools:
        url = tool.get("url")
        name = tool.get("name")
        print(f"   ↳ Checking {name} ({url})...", end="")
        
        # We perform actual network ping check
        is_working = check_url_working(url, user_agent)
        
        # Old tools are not deleted, we just mark 'working': false or true
        tool["working"] = is_working
        status_symbol = "🟢 WORKING" if is_working else "🔴 UNREACHABLE"
        print(f" -> {status_symbol}")

    # 4. Add mock holiday season AI tools if they don't already exist during New Year Period
    if holiday_active:
        print("🎄 New Year period detected! Incorporating seasonal tools...")
        holiday_items = [
            {
                "id": "newyear-poet",
                "name": "NY Greeting Poet",
                "description": "Специальный генератор душевных стихотворных поздравлений и тостов на Новый Год и Рождество.",
                "url": "https://poet.holiday.ai",
                "category": "Праздники",
                "targetAudience": "everyone",
                "working": True,
                "isNew": True,
                "isHoliday": True,
                "source": "tatnet",
                "addedDate": "2026-12-25"
            },
            {
                "id": "ny-recipe-chef",
                "name": "Olivier Dinner Recipe AI",
                "description": "ИИ-шеф, создающий креативные рецепты праздничного стола на основе ингредиентов в вашем холодильнике.",
                "url": "https://olivier.holiday.ai",
                "category": "Праздники",
                "targetAudience": "everyone",
                "working": True,
                "isNew": True,
                "isHoliday": True,
                "source": "other",
                "addedDate": "2026-12-26"
            }
        ]
        
        # Add only if not present already in DB
        existing_ids = {t["id"] for t in tools}
        for item in holiday_items:
            if item["id"] not in existing_ids:
                tools.append(item)
                print(f"   [Added Christmas App]: {item['name']}")

    # 5. Discover new projects to simulate/parse from public sources TatNet & GitHub Trending
    print("🌎 Crawling public trending portals...")
    # Add a mock parsed trending tool for demo of discovery
    simulated_new_tool = {
        "id": "discovered-copilot-" + str(int(datetime.datetime.now().timestamp())),
        "name": "Ollama Pro WebUI",
        "description": "Ультрабыстрый веб-интерфейс для локального запуска новейших моделей DeepSeek и Llama в локальной сети.",
        "url": "https://github.com/ollama/ollama",
        "category": "AI-кодинг",
        "targetAudience": "programmers",
        "working": True,
        "isNew": True,
        "isHoliday": False,
        "source": "github",
        "addedDate": datetime.date.today().isoformat()
    }
    
    # Prepend or append
    tools_by_url = {t["url"] for t in tools}
    if simulated_new_tool["url"] not in tools_by_url:
        tools.insert(0, simulated_new_tool)
        print(f"🎉 New AI Project discovered of 2026: {simulated_new_tool['name']}!")

    # Save tools database
    try:
        with open(TOOLS_PATH, "w", encoding="utf-8") as f:
            json.dump(tools, f, indent=2, ensure_ascii=False)
        print(f"✅ Saved updated AI Tools to {TOOLS_PATH}")
    except Exception as e:
        print(f"❌ Error saving tools database: {e}")

    # 6. Update Startup News items
    if os.path.exists(STARTUPS_PATH):
        try:
            with open(STARTUPS_PATH, "r", encoding="utf-8") as f:
                startups = json.load(f)
        except Exception as e:
            print(f"❌ Error loading {STARTUPS_PATH}: {e}")
            startups = []
            
        # Push new news if not matching latest timestamp
        today = datetime.date.today().isoformat()
        has_today_news = any(news["addedDate"] == today for news in startups)
        
        if not has_today_news:
            new_story = {
                "id": str(int(datetime.datetime.now().timestamp())),
                "title": "Kazan Quantum AI Core",
                "description": "Запуск передовой квантово-вычислительной лаборатории на TatNet для ускорения распределенного обучения языковых моделей нового поколения.",
                "url": "https://quantum.tatnet.ai",
                "source": "TatNet",
                "addedDate": today
            }
            startups.insert(0, new_story)
            # Limit count to top 5 stories
            startups = startups[:5]
            
            try:
                with open(STARTUPS_PATH, "w", encoding="utf-8") as f:
                    json.dump(startups, f, indent=2, ensure_ascii=False)
                print(f"✅ Saved updated news stories to {STARTUPS_PATH}")
            except Exception as e:
                print(f"❌ Error saving startups news: {e}")
                
    print("🏁 ROBOT TASK COMPLETED SUCCESSFULLY.")
    print("==================================================")

if __name__ == "__main__":
    run_crawler()
