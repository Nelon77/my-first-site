import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function getColorScore(text) {
  const lengthScore = Math.min(text.length * 3, 20);

  const keywords = [
    "AI",
    "인공지능",
    "부동산",
    "원룸",
    "게임",
    "주식",
    "유튜브",
    "SNS",
    "트렌드",
    "창업"
  ];

  let keywordScore = 0;

  keywords.forEach(word => {
    if (text.includes(word)) keywordScore += 10;
  });

  return Math.min(100, 40 + lengthScore + keywordScore);
}

export default async function handler(req, res) {

  try {

    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({
        error: "키워드가 없습니다."
      });
    }

    const today = new Date();

    const endDate = today.toISOString().split("T")[0];

    const start = new Date();
    start.setDate(start.getDate() - 6);

    const startDate = start.toISOString().split("T")[0];

    const prompt = `
"${keyword}"에 대해 최근 7일간 인터넷 반응을 분석해줘.

다음 형식의 JSON만 반환해.

{
  "trend":"상승세",
  "summary":"최근 7일 동안 ...",
  "interest":[
    "...",
    "...",
    "..."
  ],
  "questions":[
    "...",
    "...",
    "..."
  ]
}

조건:

- 최근 7일 기준으로 작성
- 뉴스, SNS, 유튜브, 커뮤니티 반응 포함
- 250자 이상 작성
- keyword를 반복하지 말 것
- JSON 외 텍스트 금지
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_object"
      }
    });

    const data = JSON.parse(
      response.choices[0].message.content
    );

    res.status(200).json({
      score: getColorScore(keyword),
      dateRange: `${startDate} ~ ${endDate}`,
      ...data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "분석 실패"
    });
  }
}
