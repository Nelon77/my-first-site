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

  // 🧠 AI 판단 로직
  const intensity =
    competition > 80 ? "강한 관심" :
    competition > 65 ? "중간 관심" :
    "초기 관심";

  const trendState =
    trendScore > 75 ? "빠른 확산" :
    trendScore > 55 ? "완만한 성장" :
    "정체 구간";

  const marketLevel =
    competition > 75 ? "경쟁 높음" : "보통";

  const riskLevel =
    competition > 85 ? "진입 어려움" : "진입 가능";

  const opportunity =
    trendScore > 70 ? "성장 가능성 높음" : "관찰 필요";

  // 📦 최종 응답
  return res.status(200).json({
    keyword,

    meta: {
      competition,
      trendScore,
      newsCount,
      intensity,
      trendState,
      marketLevel,
      riskLevel,
      opportunity
    },

    hotTopic: `📊 인터넷 화제성 분석

키워드: ${keyword}

- 뉴스/커뮤니티 언급: ${newsCount}
- 경쟁도: ${competition}
- 트렌드 점수: ${trendScore}`,

    marketAnalysis: `📊 시장 구조 분석

- 시장 경쟁: ${marketLevel}
- 진입 난이도: ${riskLevel}
- 성장성: ${opportunity}`,

    report: {
      keyword,
      competition,
      trendScore,
      newsCount,
      intensity,
      trendState
    }
  });
}
