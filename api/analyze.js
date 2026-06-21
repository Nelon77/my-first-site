export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "no keyword" });
  }

  const prompt = `
키워드: ${keyword}

최근 7일간 인터넷 트렌드를 분석하고 JSON으로 반환:

{
  "score": 0~100,
  "trend": "상승/하락/유지",
  "summary": "짧은 화제성 분석",
  "questions": ["질문1","질문2","질문3"]
}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();

    res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ error: "server error", detail: err.message });
  }
}
