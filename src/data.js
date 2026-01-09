export const itineraryData = {
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
          time: "17:00", 
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
          desc: "호수 산책", 
          type: "sightseeing",
          blogKeyword: "후쿠오카 오호리 공원 산책",
          pos: [33.5847, 130.3764] 
        },
        { 
          id: 99, 
          time: "18:00", 
          name: "호텔 체크인", 
          desc: "커낼시티 워싱턴 호텔 체크인 및 휴식", 
          type: "hotel",
          pos: [33.5912, 130.4215] 
        },
        { 
          id: 13, 
          time: "18:30", 
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