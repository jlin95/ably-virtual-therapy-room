const URL =
  "https://28c7164e-2a08-4fcf-9e1e-af9f38ae2e6e.mock.pstmn.io/v3/diagnosis";
export async function POST() {
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.INFERMEDICA_API_KEY,
      "API-ID": process.env.INFERMEDICA_APP_ID,
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
