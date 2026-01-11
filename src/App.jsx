import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Clock, Info, ExternalLink, Utensils, X, Star, MapPin, MessageSquare, Plane, Building, ShoppingBag, Search, Coffee, Luggage, Map, ChevronUp, FileText, Banknote } from 'lucide-react';

const App = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  
  // 모바일 드래그 관련 상태
  const [sheetHeight, setSheetHeight] = useState(60); // 기본 높이 (%)
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(60);

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef({}); 
  const polylineRef = useRef(null);
  const listRefs = useRef({});

  // 스타일 및 외부 라이브러리 동적 로드
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }

    const loadLeaflet = () => {
      if (window.L && window.L.map) {
        setIsMapReady(true);
        return;
      }

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          if (window.L && window.L.map) {
            setIsMapReady(true);
          }
        };
        document.head.appendChild(script);
      }
    };

    loadLeaflet();
  }, []);

  const itineraryData = {
    1: {
      date: "2026.01.19 (월)",
      title: "1일차: 유후인 힐링 여행",
      locations: [
        { id: 1, time: "08:30", name: "인천공항(ICN) 출국", desc: "진에어 LJ267 탑승", type: "transport", pos: [37.4602, 126.4407], hideFromMap: true },
        { id: 2, time: "09:55", name: "후쿠오카 공항 도착", desc: "입국 심사 및 짐 찾기", type: "transport", pos: [33.5859, 130.4442] },
        { id: 3, time: "10:38 / 11:08", name: "유후인행 버스 탑승", desc: "공항 버스 정류장에서 유후인행 고속버스 승차", type: "transport", pos: [33.5850, 130.4430] },
        { id: 4, time: "13:00", name: "유후 마부시 신", desc: "유후인역 바로 앞, 접근성이 매우 좋은 덮밥집", type: "food", menu: "분고규/장어/닭고기 마부시: 각 3,200円 (세후)", blogKeyword: "유후인 유후마부시 신", pos: [33.262972, 131.355668], isCashOnly: true },
        { id: 5, time: "15:00", name: "유후인 거리 산책 & 간식", desc: "긴린코 호수까지 이어지는 산책로 구경", type: "sightseeing", menu: "말차 아이스크림 600円 / 금상고로케 220円", blogKeyword: "유후인 테라토 말차 아이스크림 금상고로케", pos: [33.2647, 131.3615], isCashOnly: true },
        { id: 6, time: "16:40", name: "료칸 픽업 요청 및 이동", desc: "JR 유후인역 공중전화에서 픽업 요청", type: "transport", pos: [33.2628, 131.3565] },
        { id: 7, time: "18:00", name: "펜션 장한향 (ペンション 長閑郷)", desc: "조용한 숲속 가이세키 료칸 숙박 및 석식", type: "hotel", menu: "가이세키 석식/조식 포함", blogKeyword: "유후인 ペンション 長閑郷", pos: [33.272410, 131.352455], isCashOnly: true }
      ]
    },
    2: {
      date: "2026.01.20 (화)",
      title: "2일차: 후쿠오카 도심 속 쇼핑",
      locations: [
        { id: 8, time: "10:30", name: "유후인 버스센터 출발", desc: "하카타행 고속버스 탑승", type: "transport", pos: [33.26356610622231, 131.35557663489632] },
        { id: 9, time: "12:30", name: "호텔 짐 보관", desc: "캐널시티 워싱턴 호텔 짐 맡기기", type: "hotel", pos: [33.59081970541299, 130.4124404646534] },
        { id: 10, time: "13:00", name: "이치란 캐널시티 하카타점", desc: "캐널시티 커스텀 라멘\n1. 웨이팅 중 주문서 작성\n2. 키오스크에서 라멘 및 추가 토핑 선택", type: "food", menu: "기본 1,180円, 달걀 140円 등 (토핑 추가비 별도)", blogKeyword: "후쿠오카 이치란 라멘 캐널시티 하카타점 후기", pos: [33.590897, 130.410726] },
        { id: 11, time: "14:00", name: "텐진 지하상가 쇼핑", desc: "지하상가 쇼핑몰", type: "shopping",  menu: "내추럴 키친 (주방용품, 인테리어 소품)\n링고 (사과파이 450円~)\n트러플 베이커리 (트러플 소금빵 248円~)\n이모야 킨지로 (고구마튀김 120g 500円)\n칼디 (커피, 스프레드 등)", pos: [33.590772, 130.399243] },
        { id: 12, time: "16:00", name: "오호리 공원 또는 캐널시티 하카타 쇼핑", desc: "호숫가 산책 및 카페 휴식 (스타벅스, 앤드로컬스) 또는 캐널시티 하카타 쇼핑", type: "sightseeing", blogKeyword: "후쿠오카 오호리 공원", pos: [33.586474, 130.376505] },
        { id: 13, time: "18:30", name: "캐널시티 워싱턴 호텔 체크인", desc: "호텔 체크인 및 휴식", type: "hotel", pos: [33.590819, 130.412440] },
        { id: 14, time: "19:00", name: "원조 모츠나베 라쿠텐지 하카타 역앞점", desc: "일식 내장 냄비 요리 전문점", type: "food", menu: "단품2+명란1+폰즈곱창1+곱창추가1+두부1+야채1+면1: 총 5,730円", blogKeyword: "원조 모츠나베 라쿠텐지 하카타 역앞점 모츠나베 후기", pos: [33.588804, 130.415979] },
        { id: 15, time: "21:00", name: "로피아 하카타 요도바시점", desc: "일본 마트. 카드 불가! 세븐 ATM에서 마스터카드로 수수료 없이 출금 가능", type: "shopping", blogKeyword: "로피아 하카타 후기", pos: [33.588225, 130.421679], isCashOnly: true }
      ]
    },
    3: {
      date: "2026.01.21 (수)",
      title: "3일차: 일본 전통 구경 후 귀국",
      locations: [
        { id: 16, time: "07:30", name: "원조 하카타 멘타이쥬", desc: "명란덮밥 전문점. 포장해서 아침식사로", type: "food", menu: "멘타이주 1,848円 (세후)", blogKeyword: "원조 하카타 멘타이주 후기", pos: [33.591402, 130.403938] },
        { id: 17, time: "09:00", name: "스미요시 신사", desc: "일본 3대 스미요시 신사 중에 하나", type: "sightseeing", pos: [33.586542, 130.413592] },
        { id: 18, time: "09:30", name: "도초지", desc: "목조 대불이 있는 사원", type: "sightseeing", pos: [33.595173, 130.414403] },
        { id: 19, time: "12:00", name: "맥도날드 커낼시티점", desc: "캐널시티 지하 1층. 해피밀 장난감~", type: "food", menu: "짱구는못말려 & 폼폼푸린 해피밀 약 500円", blogKeyword: "일본 맥도날드 해피밀 폼폼푸린", pos: [33.590548, 130.410954] },
        { id: 20, time: "13:00", name: "짐 찾기 및 공항 이동", desc: "호텔 짐 픽업 후 공항 이동", type: "transport", pos: [33.59081970541299, 130.4124404646534] },
        { id: 21, time: "14:40", name: "진에어 LJ264 출국", desc: "귀국", type: "transport", pos: [33.5859, 130.4442] }
      ]
    }
  };

  const currentDayData = itineraryData[activeDay];

  const focusOnList = useCallback((id) => {
    setHighlightedId(id);
    const element = listRefs.current[id];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, []);

  const openDetail = (loc) => {
    setHighlightedId(loc.id);
    setSelectedLoc(loc);
    
    if (leafletMap.current && loc.pos && !loc.hideFromMap) {
      const map = leafletMap.current;
      const isMobile = window.innerWidth < 768;
      const targetZoom = 16;

      if (isMobile) {
        const markerPoint = map.project(loc.pos, targetZoom);
        const sheetPixelHeight = (window.innerHeight * sheetHeight) / 100;
        const offset = sheetPixelHeight / 2;
        const targetPoint = markerPoint.add([0, offset]);
        const targetLatLng = map.unproject(targetPoint, targetZoom);

        map.setView(targetLatLng, targetZoom, { 
          animate: true,
          duration: 0.5 
        });
      } else {
        map.flyTo(loc.pos, targetZoom, { animate: true, duration: 1.0 });
      }

      const marker = markersRef.current[loc.id];
      if (marker) {
        setTimeout(() => marker.openTooltip(), 600);
      }
    }
  };

  // 드래그 핸들러
  const handleDragStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHeight.current = sheetHeight;
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startY.current - currentY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    let newHeight = startHeight.current + deltaPercent;
    
    newHeight = Math.max(20, Math.min(90, newHeight));
    setSheetHeight(newHeight);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const anchors = [25, 60, 85];
    const closest = anchors.reduce((prev, curr) => 
      Math.abs(curr - sheetHeight) < Math.abs(prev - sheetHeight) ? curr : prev
    );
    setSheetHeight(closest);
  }, [sheetHeight]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.L) return;
    
    const L = window.L;
    
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, { 
        zoomControl: false,
        attributionControl: false 
      }).setView([33.5897, 130.4207], 13);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        maxZoom: 20 
      }).addTo(leafletMap.current);
    }

    const map = leafletMap.current;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    if (polylineRef.current) polylineRef.current.remove();
    
    const visibleLocations = currentDayData.locations.filter(loc => !loc.hideFromMap);
    const points = visibleLocations.map(loc => loc.pos);
    
    visibleLocations.forEach((loc, index) => {
      // 숫자 마커를 위한 커스텀 DivIcon 생성
      const numberIcon = L.divIcon({
        className: 'custom-number-marker',
        html: `<div class="marker-pin"></div><span class="marker-number">${index + 1}</span>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40],
      });

      const marker = L.marker(loc.pos, { icon: numberIcon })
        .addTo(map)
        .bindTooltip(loc.name, { 
          permanent: false, 
          direction: 'top', 
          offset: [0, -40],
          className: 'custom-tooltip'
        })
        .on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          openDetail(loc);
          focusOnList(loc.id);
        });
      
      markersRef.current[loc.id] = marker;
    });
    
    if (points.length > 1) {
      polylineRef.current = L.polyline(points, { 
        color: '#ef4444', 
        weight: 2, 
        dashArray: '5, 10', 
        opacity: 0.4 
      }).addTo(map);
    }
    
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
    }

    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [isMapReady, activeDay]);

  const renderTypeIcon = (type) => {
    switch (type) {
      case 'transport': return <Plane size={14} />;
      case 'food': return <Utensils size={14} />;
      case 'hotel': return <Luggage size={14} />;
      case 'shopping': return <ShoppingBag size={14} />;
      default: return <MapPin size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden text-slate-900">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center z-[1001] shadow-sm">
        <h1 className="text-base font-bold flex items-center gap-2">
          <span className="text-red-500">✈️</span> 후쿠오카 가이드
        </h1>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {[1, 2, 3].map((day) => (
            <button 
              key={day} 
              onClick={() => { 
                setActiveDay(day); 
                setSelectedLoc(null); 
                setHighlightedId(null); 
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${activeDay === day ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Day {day}
            </button>
          ))}
          <button 
            onClick={() => setShowMemo(true)}
            className="px-3 py-1 rounded-md text-[11px] font-bold transition-all text-slate-500 hover:bg-white hover:text-blue-500 flex items-center gap-1"
          >
            <FileText size={12} /> Memo
          </button>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <div 
          className="w-full md:h-full md:w-80 lg:w-[400px] z-[1000] bg-white border-t md:border-t-0 md:border-r border-slate-200 transition-all duration-300 ease-out flex flex-col absolute bottom-0 left-0 md:relative shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] md:shadow-none"
          style={{ height: window.innerWidth < 768 ? `${sheetHeight}%` : '100%' }}
        >
          <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="md:hidden w-full h-8 flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className={`w-full h-full overflow-y-auto p-4 scroll-smooth custom-scrollbar transition-opacity duration-300 ${selectedLoc ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={14} className="text-red-500" /> {currentDayData.date}
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 font-medium tracking-tight">{currentDayData.title}</p>
              </div>

              <div className="space-y-3 pb-24">
                {currentDayData.locations.map((loc) => (
                  <div 
                    key={loc.id} 
                    ref={el => listRefs.current[loc.id] = el}
                    onClick={() => openDetail(loc)}
                    className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                      highlightedId === loc.id 
                      ? 'bg-red-50 border-red-200 ring-1 ring-red-100 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${highlightedId === loc.id ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {renderTypeIcon(loc.type)} {loc.time}
                      </span>
                      {loc.isCashOnly && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">
                          <Banknote size={10} /> 현금 전용
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold text-sm transition-colors ${highlightedId === loc.id ? 'text-red-700' : 'text-slate-800 group-hover:text-red-500'}`}>{loc.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">{loc.desc}</p>
                    
                    {loc.menu && (
                      <div className={`mt-2 p-2 rounded-lg text-[10px] leading-snug border-l-2 ${highlightedId === loc.id ? 'bg-white border-red-400 text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-white transition-colors'}`}>
                        <div className="font-bold flex items-center gap-1 mb-0.5 opacity-80">
                          <Utensils size={10} /> 정보 및 비용
                        </div>
                        <div className="line-clamp-2">{loc.menu}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedLoc && (
              <div className="absolute inset-0 bg-white z-[1002] flex flex-col animate-slide-in overflow-hidden">
                <div className="py-2 px-4 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">상세 정보</span>
                  </div>
                  <button 
                    onClick={() => setSelectedLoc(null)} 
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg uppercase tracking-tight">{selectedLoc.type}</span>
                      {selectedLoc.isCashOnly && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-tight">
                          <Banknote size={12} /> 현금 전용 (No Card)
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-3 leading-tight tracking-tight">{selectedLoc.name}</h2>
                    <div className="flex items-center gap-2 text-slate-400 mt-2">
                      <Clock size={14} />
                      <span className="text-xs font-bold">{selectedLoc.time} 예정</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium">{selectedLoc.desc}</p>
                  </div>

                  {selectedLoc.menu && (
                    <div className="bg-slate-900 p-5 rounded-2xl text-white shadow-xl shadow-slate-200">
                      <h4 className="text-[10px] font-bold text-slate-400 mb-2 uppercase flex items-center gap-2">
                        <Utensils size={12} className="text-red-400" /> 정보 및 예상 비용
                      </h4>
                      <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{selectedLoc.menu}</p>
                    </div>
                  )}

                  {selectedLoc.blogKeyword && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">추천 링크</h4>
                      <button 
                        onClick={() => window.open(`https://search.naver.com/search.naver?where=view&query=${encodeURIComponent(selectedLoc.blogKeyword)}`, '_blank')}
                        className="w-full flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-green-50 hover:border-green-200 transition-all group shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xs font-black italic shadow-md group-hover:scale-110 transition-transform">N</div>
                          <div className="text-left">
                            <div className="font-bold text-xs text-slate-800">네이버 블로그 후기</div>
                            <div className="text-[10px] text-slate-400">"{selectedLoc.blogKeyword}" 검색결과</div>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-green-500 transition-colors" />
                      </button>
                    </div>
                  )}
                  
                  <div className="pb-8">
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLoc.pos[0]},${selectedLoc.pos[1]}`, '_blank')}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-100 active:scale-[0.98] transition-all"
                    >
                      <MapPin size={18} /> 구글 맵에서 길찾기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-full flex-1 relative order-1 md:order-2">
          <div ref={mapRef} className="w-full h-full z-0" style={{ background: '#f8fafc' }} />
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-20">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400 font-medium">지도를 초기화 중...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {showMemo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMemo(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative animate-pop-in">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2 font-bold">
                <FileText size={18} />
                <span>여행 메모</span>
              </div>
              <button onClick={() => setShowMemo(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <h3 className="text-blue-800 font-bold text-sm mb-2 flex items-center gap-1">
                  <Banknote size={14} /> 1. 현금 전용 (카드 불가 항목)
                </h3>
                <ul className="text-xs text-blue-900/70 space-y-1.5 font-medium">
                  <li className="flex justify-between border-b border-blue-200/50 pb-1">
                    <span>장어덮밥 (4인)</span>
                    <span className="font-bold text-blue-900">12,800엔</span>
                  </li>
                  <li className="flex justify-between border-b border-blue-200/50 pb-1">
                    <span>말차 아이스크림 (2인)</span>
                    <span className="font-bold text-blue-900">1,200엔</span>
                  </li>
                  <li className="flex justify-between border-b border-blue-200/50 pb-1">
                    <span>금상 고로케 (2인)</span>
                    <span className="font-bold text-blue-900">440엔</span>
                  </li>
                  <li className="flex justify-between">
                    <span>료칸 입탕세 (4인)</span>
                    <span className="font-bold text-blue-900">1,000엔</span>
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t-2 border-dashed border-blue-200 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-blue-500">현금 합계</span>
                  <span className="text-base font-black text-blue-700">15,440엔</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  * 최소 비용만 계산해둔 것이므로 비상금 및 소액 현금을 더 준비하세요.
                </p>
              </div>
              <button 
                onClick={() => setShowMemo(false)}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-sm transition-transform active:scale-95"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; padding: 0; overflow: hidden; position: fixed; width: 100%; height: 100%; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        .leaflet-container { width: 100%; height: 100%; z-index: 0; outline: none; }
        .custom-tooltip { 
          border: none !important; 
          background: #1e293b !important; 
          color: white !important; 
          font-weight: 800 !important; 
          font-size: 11px !important; 
          border-radius: 8px !important; 
          padding: 6px 10px !important; 
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
          border-bottom: 2px solid #ef4444 !important;
        }
        .leaflet-tooltip-top:before { border-top-color: #1e293b !important; }

        /* 커스텀 숫자 마커 스타일 */
        .custom-number-marker { position: relative; }
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #b82a2a;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -24px 0 0 -15px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          border: 2px solid white;
        }
        .marker-number {
          position: absolute;
          width: 30px;
          text-align: center;
          color: white;
          font-weight: 900;
          font-size: 14px;
          top: 0px;
          left: 0;
          z-index: 10;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        @keyframes slideInUp { 
          from { transform: translateY(10px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes popIn {
          from { transform: scale(0.9) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default App;