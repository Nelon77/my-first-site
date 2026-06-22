import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "GET 요청만 허용됩니다."
    });
  }

  const { keyword } = req.query;

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({
      error: "키워드를 입력해주세요."
    });
  }

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
당신은 "AI 키워드 검색·분석기"의 핵심 분석 엔진입니다.

역할:
- 사용자가 입력한 키워드를 분석합니다.
- 최근 7일 기준의 검색 관심도와 인터넷 화제성을 평가합니다.
- 뉴스, 커뮤니티, SNS, 블로그, 동영상 플랫폼의 일반적인 흐름을 종합적으로 참고한다고 가정합니다.
- 실제 실시간 검색 API에 접근할 수 없으므로, 추정·예측 표현을 사용해야 합니다.

분석 규칙:

1. 입력값 검증
- 의미 없는 문자열(예: "asdf", "ㅋㅋㅋㅋ", "ㅁㄴㅇㄹ")은 분석 불가로 판단합니다.
- 욕설, 스팸성 키워드는 분석 불가로 판단합니다.
- 키워드 길이가 1글자인 경우 신뢰도를 낮게 평가합니다.

2. 점수 규칙
- score는 반드시 0~100 사이의 정수입니다.
- 최근 7일 관심도가 높을수록 높은 점수를 부여합니다.
- 점수는 키워드마다 고정되지 않습니다.
- 같은 키워드라도 시간이 지나면 점수가 달라질 수 있습니다.

점수 기준 예시:

0~15: 매우 낮음
16~30: 낮음
31~45: 보통 이하
46~60: 보통
61~75: 높음
76~85: 매우 높음
86~100: 폭발적 관심

3. trend 규칙

반드시 아래 셋 중 하나만 사용합니다.

- 상승
- 유지
- 하락

4. summary 규칙

- 100~150자 내외로 작성합니다.
- "~로 추정됩니다", "~하는 흐름입니다"처럼 신중한 표현을 사용합니다.
- 과장된 표현은 금지합니다.
- 근거 없는 단정은 금지합니다.
- 키워드의 최근 관심 요인을 설명합니다.

5. questions 규칙

- 정확히 3개만 생성합니다.
- 사용자가 실제 검색할 법한 질문으로 작성합니다.
- 질문은 서로 중복되면 안 됩니다.

6. 출력 형식 규칙

반드시 JSON 객체만 반환합니다.

마크다운 금지.
설명 금지.
코드블록 금지.

반환 형식:

{
  "score": 0,
  "trend": "상승",
  "summary": "",
  "questions": [
    "",
    "",
    ""
  ]
}

분석 키워드: "${keyword}"
`;

    let result;
    let retry = 3;

    while (retry > 0) {

      try {

        result = await model.generateContent(prompt);
        break;

      } catch (error) {

        retry--;

        if (retry === 0) {
          throw error;
        }

        await new Promise(resolve =>
          setTimeout(resolve, 2000)
        );
      }
    }

    const text = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    return res.status(200).json({
      score: Number(data.score) || 0,
      trend: data.trend || "유지",
      summary: data.summary || "분석 데이터가 부족합니다.",
      questions: Array.isArray(data.questions)
        ? data.questions.slice(0, 3)
        : []
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "분석 실패",
      detail: error.message
    });
  }
}
