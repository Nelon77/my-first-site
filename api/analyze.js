export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ error: "keyword missing" });
  }

  await new Promise(r => setTimeout(r, 700));

  // 📊 핵심 데이터 생성
  const competition = Math.floor(Math.random() * 40) + 60;
  const trendScore = Math.floor(Math.random() * 40) + 50;
  const newsCount = Math.floor(Math.random() * 25) + 5;
  const searchVolume7d = Math.floor(Math.random() * 90000) + 10000;

  // 🎯 카테고리 판별 (확장형)
  let category = "기타";

  if (/마인크래프트|롤|오버워치|발로란트|림버스|게임|로블록스/i.test(keyword)) {
    category = "게임";
  } else if (/아이유|BTS|NCT|뉴진스|르세라핌|아이돌|kpop/i.test(keyword)) {
    category = "아이돌/음악";
  } else if (/뉴스|정치|사건|이슈|대통령/i.test(keyword)) {
    category = "뉴스/사회";
  } else if (/원룸|월세|부동산|집|전세/i.test(keyword)) {
    category = "생활/부동산";
  } else if (/AI|GPT|코딩|프로그래밍|개발|기술/i.test(keyword)) {
    category = "기술/IT";
  }

  // 📈 상태 분석
  const intensity =
    competition > 80 ? "폭발적 관심" :
    competition > 65 ? "활발한 관심" :
    "초기 관심";

  const trendState =
    trendScore > 75 ? "급상승 구간" :
    trendScore > 55 ? "완만한 상승" :
    "정체 구간";

  const sentiment =
    Math.random() > 0.5 ? "긍정 흐름" : "논쟁/혼재 흐름";

  // 🔥 왜 인기인가 (확장형)
  const whyPopular = `
${keyword}는 최근 온라인에서 빠르게 확산되고 있는 키워드입니다.

검색량 증가와 SNS 언급이 동시에 발생하면서
알고리즘 추천 영역에 자주 노출되고 있습니다.

특히 ${category} 특성상
${competition > 70 ? "짧은 시간 내 확산 속도가 매우 빠른 구조" : "지속적으로 관심이 쌓이는 구조"}를 보입니다.
`;

  // 👍 장점
  const pros = `
- ${category} 특성상 사용자 참여도가 높음
- 콘텐츠 확산 속도 빠름
- 커뮤니티 기반 성장 가능성 존재
`;

  // ⚠️ 단점
  const cons = `
- ${competition > 80 ? "경쟁 과열로 신규 진입 어려움" : "정보 분산으로 분석 난이도 있음"}
- 트렌드 변동성이 큼
`;

  // 🧠 AI 개인 견해 (핵심)
  let aiOpinion = "";

  if (trendScore > 75 && competition > 70) {
    aiOpinion =
      "이 키워드는 단기적으로 매우 강한 관심을 받는 급등형 트렌드로 보이며, 빠르게 확산되지만 지속성은 제한적일 가능성이 있습니다.";
  } else if (category === "게임") {
    aiOpinion =
      "게임 카테고리는 구조적으로 커뮤니티 확장이 쉬워 장기 관심으로 이어질 가능성이 높습니다.";
  } else if (category === "아이돌/음악") {
    aiOpinion =
      "팬덤 기반 확산 구조라 지속적인 검색과 언급이 유지될 가능성이 큽니다.";
  } else {
    aiOpinion =
      "현재 단계에서는 중립적인 성장 구간으로 판단되며 추가 데이터가 필요합니다.";
  }

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

    hotTopic: {
      summary: `${keyword}는 최근 7일 동안 빠르게 확산 중인 트렌드입니다.`,
      reasons: [
        "검색량 증가",
        "SNS 확산",
        "커뮤니티 반응 증가",
        "추천 알고리즘 노출"
      ],
      insight: `${intensity} 단계로 확산 흐름이 감지됩니다.`
    },

    marketAnalysis: {
      structure: `${category} 영역에서 현재 ${competition > 70 ? "경쟁이 높은 상태" : "성장 가능 구간"}입니다.`,
      entry: competition > 80
        ? "이미 포화된 시장"
        : "아직 진입 가능한 시장",
      profit: trendScore > 70
        ? "수익화 가능성 높음"
        : "중장기 관찰 필요"
    },

    report: {
      whyPopular,
      pros,
      cons,
      aiOpinion,
      searchVolume7d,
      newsCount
    }
  });
}
