#!/usr/bin/env python3
"""
Wave Forecast Agent for ASF App
Fetches real wave data from Open-Meteo Marine API
"""

import json
import urllib.request
from datetime import datetime

# São Paulo Coast coordinates
CITIES = [
    {"name": "Bertioga", "lat": -23.85, "lon": -46.15},
    {"name": "Santos", "lat": -23.95, "lon": -46.33},
    {"name": "Guarujá", "lat": -23.99, "lon": -46.25},
    {"name": "Ubatuba", "lat": -23.43, "lon": -45.07},
    {"name": "São Sebastião", "lat": -23.76, "lon": -45.41},
    {"name": "Ilhabela", "lat": -23.78, "lon": -45.36},
    {"name": "Praia Grande", "lat": -24.01, "lon": -46.40},
    {"name": "Caraguatatuba", "lat": -23.62, "lon": -45.41},
]

def fetch_wave_data():
    """Fetch wave data for all cities"""
    lats = ",".join([str(c["lat"]) for c in CITIES])
    lons = ",".join([str(c["lon"]) for c in CITIES])
    
    url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lats}&longitude={lons}&hourly=wave_height,wave_direction,wave_period&timezone=America/Sao_Paulo&forecast_days=1"
    
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            return data
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def format_direction(degrees):
    """Convert degrees to compass direction"""
    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    idx = round(degrees / 45) % 8
    return dirs[idx]

def get_wave_rating(height):
    """Get wave rating based on height"""
    if height < 0.3:
        return "🔴 Pequena", "#E74C3C"
    elif height < 0.8:
        return "🟡 Média", "#F39C12"
    elif height < 1.5:
        return "🟢 Boa", "#27AE60"
    elif height < 2.5:
        return "🔵 Grande", "#3498DB"
    else:
        return "🟣 Muito Grande", "#9B59B6"

def generate_html(data):
    """Generate HTML for wave forecast"""
    if not data:
        return "<p>Erro ao carregar previsão</p>"
    
    today = datetime.now().strftime("%d/%m/%Y")
    weekday = datetime.now().strftime("%A")
    
    weekdays = {
        "Monday": "Segunda",
        "Tuesday": "Terça", 
        "Wednesday": "Quarta",
        "Thursday": "Quinta",
        "Friday": "Sexta",
        "Saturday": "Sábado",
        "Sunday": "Domingo"
    }
    
    weekday_pt = weekdays.get(weekday, weekday)
    
    html = f'''
    <div style="background: linear-gradient(135deg, #00A8CC 0%, #0E2439 100%); padding: 16px; margin: 0 20px 20px; border-radius: 16px; color: white;">
        <p style="font-size: 14px; font-weight: 600;">🌊 Previsão de Ondas - {weekday_pt}, {today}</p>
        <p style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Fonte: Open-Meteo Marine API</p>
    </div>
    '''
    
    # Handle single or multiple locations
    locations = data if isinstance(data, list) else [data]
    
    for i, city in enumerate(CITIES):
        if i < len(locations):
            loc_data = locations[i]
            
            # Get current hour data
            current_hour = datetime.now().hour
            hourly = loc_data.get("hourly", {})
            
            if current_hour < len(hourly.get("wave_height", [])):
                wave_height = hourly["wave_height"][current_hour]
                wave_direction = hourly["wave_direction"][current_hour] if current_hour < len(hourly.get("wave_direction", [])) else 0
                wave_period = hourly["wave_period"][current_hour] if current_hour < len(hourly.get("wave_period", [])) else 0
                
                # Get max height of the day
                max_height = max(hourly.get("wave_height", [0]))
                min_height = min(hourly.get("wave_height", [0]))
                
                rating, color = get_wave_rating(wave_height)
                direction = format_direction(wave_direction) if wave_direction else "N/A"
                
                html += f'''
                <div class="card" style="margin: 0 20px 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="font-size: 16px; color: #0E2439;">🏖️ {city["name"]}</h3>
                            <p style="font-size: 12px; color: #666;">{rating}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 24px; font-weight: bold; color: {color};">{wave_height:.1f}m</p>
                            <p style="font-size: 10px; color: #999;">agora</p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                        <div style="text-align: center; background: #f8f9fa; padding: 8px; border-radius: 8px;">
                            <p style="font-size: 10px; color: #999;">Período</p>
                            <p style="font-size: 14px; font-weight: bold; color: #0E2439;">{wave_period:.0f}s</p>
                        </div>
                        <div style="text-align: center; background: #f8f9fa; padding: 8px; border-radius: 8px;">
                            <p style="font-size: 10px; color: #999;">Direção</p>
                            <p style="font-size: 14px; font-weight: bold; color: #0E2439;">{direction}</p>
                        </div>
                        <div style="text-align: center; background: #f8f9fa; padding: 8px; border-radius: 8px;">
                            <p style="font-size: 10px; color: #999;">Máx/Mín</p>
                            <p style="font-size: 14px; font-weight: bold; color: #0E2439;">{max_height:.1f}/{min_height:.1f}m</p>
                        </div>
                    </div>
                </div>
                '''
    
    return html

def main():
    print("🌊 Wave Forecast Agent - ASF App")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Fetch data for each city
    all_data = []
    for city in CITIES:
        url = f"https://marine-api.open-meteo.com/v1/marine?latitude={city['lat']}&longitude={city['lon']}&hourly=wave_height,wave_direction,wave_period&timezone=America/Sao_Paulo&forecast_days=1"
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                data = json.loads(response.read().decode())
                all_data.append(data)
                print(f"✅ {city['name']}: data fetched")
        except Exception as e:
            print(f"❌ {city['name']}: {e}")
            all_data.append(None)
    
    # Generate HTML
    html = generate_html(all_data)
    
    # Save to file
    with open("docs/wave-forecast.html", "w") as f:
        f.write(html)
    
    print("\n✅ Wave forecast saved to docs/wave-forecast.html")

if __name__ == "__main__":
    main()