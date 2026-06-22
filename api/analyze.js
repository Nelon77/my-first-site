import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔎 뉴스 수집 (키워드 기반 검색 데이터)
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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "GET만 허용" });
  }

  const { keyword } = req.query;

  if (!keyword?.trim()) {
    return res.status(400).json({ error: "키워드를 입력하세요" });
  }

  // 🔥 SSE (스트리밍)
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const send = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    // 1️⃣ 관련 데이터 수집
    const news = await fetchNews(keyword);

    // 2️⃣ Gemini 모델
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // 3️⃣ 핵심 프롬프트 (📌 키워드 분석기 역할)
    const prompt = `
너는 "AI 키워드 분석 엔진"이다.

목표:
사용자가 입력한 키워드를 기반으로
검색 + 의미 + 트렌드 + 확장 키워드를 구조적으로 분석한다.

키워드: ${keyword}

아래 형식으로 출력:

1. 🔍 키워드 의미 분석
2. 📊 현재 검색/화제성 상태 (높음/중간/낮음 + 이유)
3. 🧠 핵심 키워드 5개
4. 🔗 연관 키워드 (확장 검색용)
5. ❓ 사람들이 실제로 검색하는 질문 5개
6. 📈 트렌드 방향 (상승/하락/정체)

참고 뉴스 데이터:
${JSON.stringify(news)}
`;

    const result = await model.generateContentStream(prompt);

    // 4️⃣ 뉴스 먼저 전달 (UI용)
    send({
      type: "news",
      data: news,
    });

    // 5️⃣ 스트리밍 분석 결과
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        send({
          type: "chunk",
          data: text,
        });
      }
    }

    // 6️⃣ 완료
    send({ type: "done" });
    res.end();
  } catch (err) {
    console.error(err);

    send({
      type: "error",
      message: "키워드 분석 실패",
    });

    res.end();
  }
}
