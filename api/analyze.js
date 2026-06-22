export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ error: "keyword missing" });
  }

  await new Promise(r => setTimeout(r, 600));

  // 📊 기본 지표
  const competition = Math.floor(Math.random() * 40) + 60;
  const trendScore = Math.floor(Math.random() * 40) + 50;
  const newsCount = Math.floor(Math.random() * 25) + 5;
  const searchVolume7d = Math.floor(Math.random() * 90000) + 10000;

  // 📌 안전 분류 (무조건 fallback 있음)
  const category =
    /게임|롤|오버워치|마인크래프트/.test(keyword)
      ? "게임/엔터테인먼트"
      : /부동산|원룸|월세/.test(keyword)
      ? "부동산/생활"
      : /뉴스|정치|이슈/.test(keyword)
      ? "뉴스/사회"
      : "일반 트렌드";

  // 📌 트렌드 상태
  const intensity =
    competition > 80 ? "폭발적 관심" :
    competition > 65 ? "활발한 관심" :
    "초기 관심";

  const trendState =
    trendScore > 75 ? "급상승 구간" :
    trendScore > 55 ? "완만한 상승" :
    "정체 구간";

  const sentiment =
    Math.random() > 0.5 ? "긍정/확산 중심" : "논쟁/혼재 상태";

  return res.status(200).json({
    keyword,

    meta: {
      competition,
      trendScore,
      newsCount,
      searchVolume7d,
      category,
      intensity,
      trendState,
      sentiment
    },

    // 📊 인터넷 화제성 (구조형 데이터)
    hotTopic: {
      summary: `${keyword}는 최근 7일 기준 검색과 커뮤니티 언급이 동시에 증가하고 있는 주제입니다.`,
      reasons: [
        "검색량 증가",
        "SNS 확산",
        "커뮤니티 반응 증가",
        "추천 알고리즘 노출"
      ],
      insight: `${intensity} 상태로, 현재 온라인 확산 단계에 진입했습니다.`
    },

    // 📊 시장 구조 분석 (조금 더 현실적으로)
    marketAnalysis: {
      structure: `현재 ${category} 영역에서 ${keyword}는 경쟁 수준이 ${competition > 70 ? "높은 편" : "중간"}입니다.`,
      entry: competition > 80
        ? "이미 경쟁자가 많은 성숙 시장"
        : "아직 성장 및 진입이 가능한 초기 시장",
      profit: trendScore > 70
        ? "광고/콘텐츠 수익화 가능성이 높은 주제"
        : "중장기 관찰이 필요한 트렌드"
    },

    // 🧠 AI 리포트 (핵심 데이터 + 해석용)
    report: {
      keyword,
      searchVolume7d,
      competition,
      trendScore,
      newsCount,
      category,
      intensity,
      trendState,
      sentiment
    }
  });
}
