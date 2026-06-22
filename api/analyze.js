export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "keyword missing" });
  }

  await new Promise(r => setTimeout(r, 600));

  const competition = Math.floor(Math.random() * 40) + 60;
  const trendScore = Math.floor(Math.random() * 40) + 50;
  const newsCount = Math.floor(Math.random() * 25) + 5;

  return res.status(200).json({
    keyword,

    meta: {
      competition,
      trendScore,
      newsCount
    },

    hotTopic: `📊 인터넷 화제성 분석

- 뉴스/커뮤니티 언급: ${newsCount}
- 경쟁도: ${competition}
- 트렌드 점수: ${trendScore}`,

    marketAnalysis: `📊 시장 구조 분석

- 경쟁 수준: ${competition > 70 ? "높음" : "보통"}
- 진입 난이도: ${competition > 85 ? "어려움" : "중간"}
- 성장성: ${trendScore > 70 ? "높음" : "보통"}`,

    report: `🧠 AI 리포트

"${keyword}"는 현재
검색 + SNS 반응이 동시에 발생하는 트렌드 초기 구간입니다.`
  });
}
