export default async function handler(req, res) {

  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({
      error: "키워드가 없습니다."
    });
  }

  const prompt = `
키워드: ${keyword}

최근 7일간 인터넷 트렌드를 분석해 주세요.

반드시 아래 JSON 형식만 반환하세요.

{
  "score": 0,
  "trend": "상승",
  "summary": "분석 내용",
  "questions": [
    "질문1",
    "질문2",
    "질문3"
  ]
}
`;

  try {

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-4o-mini",

          response_format: {
            type: "json_object"
          },

          messages: [
            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI 호출 실패"
      });
    }

    const result = JSON.parse(
      data.choices[0].message.content
    );

    return res.status(200).json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}
