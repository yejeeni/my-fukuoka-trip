import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Info, ExternalLink, Utensils, X, Star, MapPin, MessageSquare, Plane, Building, ShoppingBag, Search, Coffee, Luggage, Map } from 'lucide-react';

const App = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const itineraryData = {
    1: {
      date: "2026.01.19 (월)",
      title: "1일차: 유후인 힐링 여행",
      locations: [
        { 
          id: 1, 
          time: "08:30", 
          name: "인천공항(ICN) 출국", 
          desc: "진에어 LJ267 탑승", 
          type: "transport",
          pos: [37.4602, 126.4407], 
          hideFromMap: true 
        },
        { 
          id: 2, 
          time: "09:55", 
          name: "후쿠오카 공항 도착", 
          desc: "국제선 터미널 입국 및 입국 심사", 
          type: "transport",
          pos: [33.5859, 130.4442] 
        },
        { 
          id: 3, 
          time: "10:38 / 11:08", 
          name: "유후인행 버스 탑승", 
          desc: "공항 버스 정류장에서 유후인행 고속버스 승차", 
          type: "transport",
          pos: [33.5850, 130.4430] 
        },
        { 
          id: 4, 
          time: "13:00", 
          name: "유후 마부시 신 (본점)", 
          desc: "유후인역 앞 소고기/장어 덮밥 전문점", 
          type: "food",
          menu: "분고규/장어 마부시: 3,200円 (세후)",
          blogKeyword: "유후인 유후마부시 신 본점 후기",
          pos: [33.2615, 131.3551] 
        },
        { 
          id: 5, 
          time: "15:00", 
          name: "유후인 거리 산책 & 간식", 
          desc: "긴린코 호수까지 이어지는 산책로 구경", 
          type: "sightseeing",
          menu: "말차 아이스크림 600円 / 금상고로케 220円",
          blogKeyword: "유후인 테라토 말차 아이스크림 금상고로케",
          pos: [33.2647, 131.3615] 
        },
        { 
          id: 6, 
          time: "16:40", 
          name: "료칸 픽업 요청 및 이동", 
          desc: "JR 유후인역 공중전화/인포에서 픽업 요청", 
          type: "transport",
          pos: [33.2628, 131.3565] 
        },
        { 
          id: 7, 
          time: "18:00", 
          name: "Pension Youkankyo 체크인", 
          desc: "조용한 숲속 가이세키 료칸 숙박 및 석식", 
          type: "hotel",
          menu: "가이세키 석식/조식 포함",
          blogKeyword: "유후인 펜션 유칸쿄 후기",
          pos: [33.2670, 131.3485] 
        }
      ]
    },
    2: {
      date: "2026.01.20 (화)",
      title: "2일차: 후쿠오카 도심 복귀",
      locations: [
        { 
          id: 8, 
          time: "10:30", 
          name: "유후인 버스센터 출발", 
          desc: "하카타행 고속버스 탑승", 
          type: "transport",
          pos: [33.2625, 131.3555] 
        },
        { 
          id: 9, 
          time: "12:30", 
          name: "호텔 짐 보관 (하카타)", 
          desc: "커낼시티 워싱턴 호텔 짐 맡기기", 
          type: "hotel",
          pos: [33.5912, 130.4215] 
        },
        { 
          id: 10, 
          time: "13:30", 
          name: "이치란 라멘 텐진점", 
          desc: "텐진역 인근 커스텀 라멘", 
          type: "food",
          menu: "기본 980円~ (토핑 추가비 별도)",
          blogKeyword: "후쿠오카 이치란 라멘 텐진점 후기",
          pos: [33.5891, 130.3995] 
        },
        { 
          id: 11, 
          time: "15:00", 
          name: "텐진 지하상가 쇼핑", 
          desc: "유럽풍 인테리어 대형 쇼핑몰 구경", 
          type: "shopping",
          pos: [33.5915, 130.3989] 
        },
        { 
          id: 12, 
          time: "17:00", 
          name: "오호리 공원", 
          desc: "호수 산책 및 스타벅스 휴식", 
          type: "sightseeing",
          blogKeyword: "후쿠오카 오호리 공원 산책",
          pos: [33.5847, 130.3764] 
        },
        { 
          id: 99, 
          time: "18:30", 
          name: "호텔 체크인", 
          desc: "커낼시티 워싱턴 호텔 체크인 및 휴식", 
          type: "hotel",
          pos: [33.5912, 130.4215] 
        },
        { 
          id: 13, 
          time: "19:30", 
          name: "라쿠텐치 하카타역앞점", 
          desc: "풍성한 구성의 모츠나베 저녁", 
          type: "food",
          menu: "단품2+명란1+폰즈곱창1+곱창추가1+두부1+야채1+면1: 총 5,730円",
          blogKeyword: "라쿠텐치 하카타역앞점 모츠나베 후기",
          pos: [33.5885, 130.4195] 
        },
        { 
          id: 14, 
          time: "21:00", 
          name: "맥스밸류 하카타 기온점", 
          desc: "24시간 대형 마트 식료품 쇼핑", 
          type: "shopping",
          blogKeyword: "후쿠오카 맥스밸류 하카타 기온점 쇼핑",
          pos: [33.5910, 130.4135] 
        },
        { 
          id: 15, 
          time: "22:00", 
          name: "돈키호테 나카스점", 
          desc: "쇼핑 및 나카스 강변 야경 투어", 
          type: "shopping",
          blogKeyword: "돈키호테 나카스점 면세 쇼핑 후기",
          pos: [33.5925, 130.4065] 
        }
      ]
    },
    3: {
      date: "2026.01.21 (수)",
      title: "3일차: 풍성한 아침과 귀국",
      locations: [
        { 
          id: 16, 
          time: "08:00", 
          name: "원조 하카타 멘타이주", 
          desc: "명물 명란덮밥 전문점", 
          type: "food",
          menu: "멘타이주 1,848円 (세후)",
          blogKeyword: "후쿠오카 멘타이주 아침 웨이팅 후기",
          pos: [33.5913, 130.4026] 
        },
        { 
          id: 17, 
          time: "08:00", 
          name: "맥도날드 커낼시티점", 
          desc: "해피밀 맥모닝 식사", 
          type: "food",
          menu: "맥모닝 세트 약 560円",
          blogKeyword: "일본 맥도날드 해피밀 맥모닝 후기",
          pos: [33.5898, 130.4105] 
        },
        { 
          id: 18, 
          time: "10:30", 
          name: "도초지 & 구시다 신사", 
          desc: "목조 대불 관람 및 시내 관광", 
          type: "sightseeing",
          pos: [33.5950, 130.4140] 
        },
        { 
          id: 19, 
          time: "12:00", 
          name: "점심 식사 (장소 미정)", 
          desc: "하카타 인근 원하는 메뉴로 자유 식사", 
          type: "food",
          menu: "현지 상황에 따라 결정",
          blogKeyword: "하카타역 점심 맛집 추천",
          pos: [33.5897, 130.4207] 
        },
        { 
          id: 20, 
          time: "13:00", 
          name: "짐 찾기 및 공항 이동", 
          desc: "호텔에서 짐 픽업 후 지하철 이동", 
          type: "transport",
          pos: [33.5859, 130.4442] 
        },
        { 
          id: 21, 
          time: "14:40", 
          name: "진에어 LJ264 출국", 
          desc: "후쿠오카 공항 면세점 구경 후 귀국", 
          type: "transport",
          pos: [33.5859, 130.4442] 
        }
      ]
    }
  };

  const currentDayData = itineraryData[activeDay];

  const getIcon = (type) => {
    switch (type) {
      case 'transport': return <Plane size={14} />;
      case 'food': return <Utensils size={14} />;
      case 'hotel': return <Luggage size={14} />;
      case 'shopping': return <ShoppingBag size={14} />;
      default: return <MapPin size={14} />;
    }
  };

  const openBlogSearch = (keyword) => {
    const url = `https://search.naver.com/search.naver?where=view&query=${encodeURIComponent(keyword)}`;
    window.open(url, '_blank');
  };

  const openInGoogleMaps = (loc) => {
    const [lat, lng] = loc.pos;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) { setIsMapLoaded(true); return; }
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true; script.onload = () => setIsMapLoaded(true);
      document.head.appendChild(script);
    };
    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;
    const L = window.L; if (!L || !L.map) return;
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, { zoomControl: false, attributionControl: true }).setView([33.5897, 130.4207], 13);
      // 다국어 지원을 위해 CartoDB Voyager 타일로 교체 (한국어 표기 확률이 더 높음)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(leafletMap.current);
    }
    const map = leafletMap.current;
    markersRef.current.forEach(m => m.remove());
    if (polylineRef.current) polylineRef.current.remove();
    markersRef.current = [];
    
    const visibleLocations = currentDayData.locations.filter(loc => !loc.hideFromMap);
    const points = visibleLocations.map(loc => loc.pos);
    const customIcon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    
    visibleLocations.forEach(loc => {
      const marker = L.marker(loc.pos, { icon: customIcon }).addTo(map).on('click', () => setSelectedLoc(loc));
      markersRef.current.push(marker);
    });
    
    if (points.length > 1) {
      polylineRef.current = L.polyline(points, { color: '#ef4444', weight: 3, dashArray: '5, 10', opacity: 0.5 }).addTo(map);
    }
    if (points.length > 0) map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
  }, [isMapLoaded, activeDay, currentDayData]);

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden text-slate-900">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center z-[50]">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <span className="text-red-500">✈️</span> 후쿠오카-유후인 가이드
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">2026.01.19 - 21 Plan</p>
        </div>
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[1, 2, 3].map((day) => (
            <button key={day} onClick={() => { setActiveDay(day); setSelectedLoc(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeDay === day ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              Day {day}
            </button>
          ))}
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <div className="w-full md:w-80 lg:w-[420px] overflow-y-auto p-5 border-r border-slate-100 z-10 custom-scrollbar bg-slate-50/30">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Calendar size={16} className="text-red-400" /> {currentDayData.title}
            </h2>
            <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              {currentDayData.locations.map((loc) => (
                <div key={loc.id} className="relative pl-7 group">
                  <div className={`absolute left-0 top-2 w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full z-10 group-hover:scale-125 transition-transform shadow-sm`}></div>
                  <div onClick={() => setSelectedLoc(loc)} className={`cursor-pointer p-4 rounded-2xl border transition-all ${selectedLoc?.id === loc.id ? 'bg-white border-red-200 shadow-lg ring-1 ring-red-50' : 'bg-white border-slate-100 hover:border-red-100 hover:shadow-md'}`}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        {getIcon(loc.type)} {loc.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{loc.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{loc.desc}</p>
                    
                    {loc.menu && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Budget / Menu</div>
                        <span className="text-xs font-black text-slate-800 leading-tight">{loc.menu}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-slate-50 overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {selectedLoc && (
          <div className="absolute top-0 right-0 w-full md:w-[420px] h-full bg-white shadow-2xl z-[100] flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                {getIcon(selectedLoc.type)} 상세 정보
              </h3>
              <button onClick={() => setSelectedLoc(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <section>
                <div className="mb-2">
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-md tracking-wider">{currentDayData.date}</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{selectedLoc.name}</h2>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{selectedLoc.desc}</p>
                </div>
              </section>

              {selectedLoc.menu && (
                <section className="bg-slate-900 p-5 rounded-2xl text-white shadow-xl shadow-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                    <Utensils size={14} className="text-red-400" /> 메뉴 & 가격 상세
                  </h4>
                  <p className="text-base font-bold leading-relaxed">{selectedLoc.menu}</p>
                </section>
              )}

              {selectedLoc.blogKeyword && (
                <section>
                  <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <Search size={14} /> 실제 블로그 후기
                  </h4>
                  <button 
                    onClick={() => openBlogSearch(selectedLoc.blogKeyword)}
                    className="w-full group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-black">N</div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">네이버 블로그에서 보기</p>
                        <p className="text-[10px] text-slate-400">"{selectedLoc.blogKeyword}" 검색 결과</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-slate-300 group-hover:text-green-500" />
                  </button>
                </section>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button onClick={() => openInGoogleMaps(selectedLoc)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95">
                <MapPin size={18} /> 구글 맵에서 길찾기
              </button>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .leaflet-container { width: 100%; height: 100%; z-index: 1; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-in { animation: slideIn 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default App;