import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔎 뉴스 수집
async function fetchNews(keyword) {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=ko&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`
    );

    const data = await res.json();

    return (
      data.articles?.map((a) => ({
        title: a.title,
        source: a.source.name,
        url: a.url,
        description: a.description,
      })) || []
    );
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 📊 경쟁도
function calculateCompetition(newsCount) {
  if (newsCount >= 5) return 90;
  if (newsCount >= 3) return 70;
  if (newsCount >= 1) return 50;
  return 20;
}

// 📈 트렌드 점수
function calculateTrend(newsCount) {
  if (newsCount >= 5) return 85;
  if (newsCount >= 3) return 65;
  if (newsCount >= 1) return 45;
  return 20;
}

// 🧠 AI 자기검수 엔진
async function aiSelfReview(model, keyword, analysisText, meta) {
  const reviewPrompt = `
너는 GLET AI 검수 엔진이다.

아래 분석 결과를 검수하고 문제를 수정하라.

📌 기준:
- 논리 오류
- 과장된 트렌드 판단
- 키워드 부족
- 구조 불명확
- 잘못된 정보

키워드: ${keyword}

메타:
- 뉴스 수: ${meta.newsCount}
- 경쟁도: ${meta.competition}
- 트렌드 점수: ${meta.trendScore}

1차 분석:
${analysisText}

📌 규칙:
- 문제 있으면 "수정본만"
- 문제 없으면 "OK"
`;

  const result = await model.generateContent(reviewPrompt);
  return result.response.text();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET만 허용" });
  }

  const { keyword } = req.query;

  if (!keyword?.trim()) {
    return res.status(400).json({ error: "키워드를 입력하세요" });
  }

  // SSE 설정
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const send = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    // 1️⃣ 뉴스 수집
    const news = await fetchNews(keyword);

    const competition = calculateCompetition(news.length);
    const trendScore = calculateTrend(news.length);

    // 2️⃣ Gemini 모델
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // 3️⃣ 분석 프롬프트
    const prompt = `
너는 GLET AI 키워드 트렌드 분석 엔진이다.

키워드: ${keyword}

📊 데이터:
- 뉴스 수: ${news.length}
- 경쟁도: ${competition}
- 트렌드 점수: ${trendScore}

다음을 포함:
1. 키워드 의미
2. 시장 분석
3. 핵심 키워드 5개
4. 연관 키워드 5개
5. 사용자 질문 5개
6. 트렌드 판단
7. 경쟁도 해석
8. 전략
`;

    const result = await model.generateContentStream(prompt);

    let fullAnalysis = "";

    // 4️⃣ 뉴스 먼저 전송
    send({ type: "news", data: news });

    // 5️⃣ 메트릭 전송 (🔥 차트용 핵심 데이터)
    send({
      type: "meta",
      data: {
        competition,
        trendScore,
        newsCount: news.length,
      },
    });

    // 6️⃣ 스트리밍 분석
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullAnalysis += text;

        send({
          type: "chunk",
          data: text,
        });
      }
    }

    // 7️⃣ AI 자기검수
    const review = await aiSelfReview(
      model,
      keyword,
      fullAnalysis,
      {
        competition,
        trendScore,
        newsCount: news.length,
      }
    );

    send({
      type: "review",
      data: review,
    });

    // 8️⃣ 차트용 데이터 (🔥 중요)
    send({
      type: "chart",
      data: [
        { type: "경쟁도", score: competition },
        { type: "트렌드", score: trendScore },
      ],
    });

    // 9️⃣ 추천 키워드
    const suggestPrompt = `
키워드: ${keyword}

연관 검색어 5개 JSON 배열:
["", "", "", "", ""]
`;

    const suggestResult = await model.generateContent(suggestPrompt);

    let suggestions = [];
    try {
      suggestions = JSON.parse(suggestResult.response.text());
    } catch {}

    send({
      type: "suggestions",
      data: suggestions,
    });

    // 🔟 종료
    send({ type: "done" });
    res.end();
  } catch (err) {
    console.error(err);

    send({
      type: "error",
      message: "GLET 분석 실패",
    });

    res.end();
  }
}
