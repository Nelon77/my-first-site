export default function handler(req, res) {
  return res.status(200).json({
    meta: {
      competition: 88,
      trendScore: 76,
      newsCount: 12
    },
    hotTopic: "TEST HOT TOPIC OK",
    marketAnalysis: "TEST MARKET OK",
    report: "TEST REPORT OK"
  });
}
