export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({
      error: "keyword missing"
    });
  }

  // ⏳ 분석 지연 (현실감)
  await new Promise(r => setTimeout(r, 700));

  // 🎲 핵심 지표
  const competition = Math.floor(Math.random() * 40) + 60;
  const trendScore = Math.floor(Math.random() * 40) + 50;
  const newsCount = Math.floor(Math.random() * 25) + 5;

  // 🔥 결과 구조 (확장형)
  const response = {
    keyword,

    meta: {
      competition,
      trendScore,
      newsCount,

      // 추가 확장용 (나중 API 붙이기 쉽게)
      sentiment: competition > 75 ? "hot" : "normal",
      stage: trendScore > 70 ? "growth" : "stable"
    },

    hotTopic: `
📊 인터넷 화제성 분석

키워드: "${keyword}"

- 최근 뉴스/커뮤니티 언급량: ${newsCount}개
- 경쟁도: ${competition}/100
- 트렌드 점수: ${trendScore}/100

${competition > 80
  ? "⚠️ 현재 매우 높은 관심이 집중된 키워드입니다."
  : "ℹ️ 현재는 안정적인 관심 수준입니다."}
    `,

    marketAnalysis: `
📊 시장 구조 분석

- 경쟁 수준: ${competition > 75 ? "높음" : "보통"}
- 진입 난이도: ${competition > 85 ? "어려움" : "중간"}
- 성장 단계: ${trendScore > 70 ? "성장기" : "초기/안정기"}
    `,

    report: `
🧠 AI 분석 리포트

"${keyword}"는 현재

✔ 검색 트렌드와 SNS 언급이 동시에 발생하는 패턴이며
✔ 단기 이슈 또는 초기 성장 키워드일 가능성이 있습니다

현재 상태:
- 시장 반응: ${competition > 75 ? "강함" : "보통"}
- 확산 가능성: ${trendScore > 70 ? "높음" : "중간"}
    `
  };

  return res.status(200).json(response);
}
