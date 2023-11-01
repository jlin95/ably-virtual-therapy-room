const INFERMEDICA_API_URL =
  "https://28c7164e-2a08-4fcf-9e1e-af9f38ae2e6e.mock.pstmn.io/v3/diagnosis";

export default async function POST(req) {
  console.log(req.method, req.body);
  const res = await fetch(INFERMEDICA_API_URL, {
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.INFERMEDICA_API_KEY,
      "API-ID": process.env.INFERMEDICA_APP_ID,
    },
    body: {
      sex: "male",
      age: {
        value: 30,
      },
      evidence: [
        {
          id: "s_1193",
          choice_id: "present",
          source: "initial",
        },
        {
          id: "s_488",
          choice_id: "present",
        },
        {
          id: "s_418",
          choice_id: "present",
        },
      ],
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
