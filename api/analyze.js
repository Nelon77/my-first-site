export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "keyword missing" });
  }

  const prompt = `
너는 한국 인터넷 트렌드 분석가다.

키워드: ${keyword}

다음 형식으로만 JSON 반환:

{
  "score": 1~100 숫자,
  "trend": "상승 / 하락 / 유지",
  "summary": "최근 7일 기준 인터넷 화제성 분석",
  "interest": ["핵심 관심1", "핵심 관심2", "핵심 관심3"],
  "questions": ["질문1", "질문2", "질문3"]
}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();

  const content = data.choices?.[0]?.message?.content;

  try {
    res.status(200).json(JSON.parse(content));
  } catch (e) {
    res.status(500).json({
      error: "parse error",
      raw: content
    });
  }
}
