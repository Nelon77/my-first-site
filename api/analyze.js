export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "keyword missing" });
  }

  await new Promise(r => setTimeout(r, 700));

  // 📊 기본 지표
  const competition = Math.floor(Math.random() * 40) + 60;
  const trendScore = Math.floor(Math.random() * 40) + 50;
  const newsCount = Math.floor(Math.random() * 25) + 5;
  const searchVolume7d = Math.floor(Math.random() * 90000) + 10000;

  // 📌 감정/반응 분석 (추가)
  const sentiment =
    Math.random() > 0.5 ? "긍정적 반응 증가" : "논쟁/혼재된 반응";

  // 📌 트렌드 상태
  const intensity =
    competition > 80 ? "폭발적 관심" :
    competition > 65 ? "활발한 관심" :
    "초기 관심";

  const trendState =
    trendScore > 75 ? "급상승 구간" :
    trendScore > 55 ? "완만한 상승" :
    "정체 구간";

  // 📌 산업 분류 (키워드 기반 간단 추정)
  const category =
    keyword.includes("게임") || keyword.includes("롤") || keyword.includes("오버워치")
      ? "게임/엔터테인먼트"
      : keyword.includes("부동산") || keyword.includes("원룸")
      ? "부동산/생활"
      : keyword.includes("뉴스") || keyword.includes("정치")
      ? "뉴스/사회"
      : "일반 트렌드";

  return res.status(200).json({
    keyword,

    meta: {
      competition,
      trendScore,
      newsCount,
      searchVolume7d,
      sentiment,
      intensity,
      trendState,
      category
    },

    hotTopic: {
      summary: `${keyword}는 최근 7일 기준 빠르게 언급량이 변화하고 있는 주제입니다.`,
      reasons: [
        "검색량 증가",
        "SNS 확산",
        "커뮤니티 이슈화",
        "알고리즘 추천 영향"
      ],
      insight: `${intensity} 상태로, 현재 온라인 관심도가 상승 중입니다.`
    },

    marketAnalysis: {
      structure: `현재 ${category} 영역에서 ${keyword}는 경쟁 강도 ${competition > 70 ? "높음" : "중간"} 수준입니다.`,
      entry: competition > 80
        ? "이미 경쟁자가 많은 성숙 시장입니다."
        : "아직 신규 진입 및 콘텐츠 확장이 가능한 구간입니다.",
      profit: trendScore > 70
        ? "광고/콘텐츠/트래픽 수익화 가능성이 높은 키워드입니다."
        : "중장기 관찰이 필요한 단계입니다."
    },

    report: {
      keyword,
      searchVolume7d,
      competition,
      trendScore,
      newsCount,
      sentiment,
      intensity,
      trendState,
      category
    }
  });
}
