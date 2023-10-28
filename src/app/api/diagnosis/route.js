export async function POST() {
  // https://28c7164e-2a08-4fcf-9e1e-af9f38ae2e6e.mock.pstmn.io/v3/diagnosis

  const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY, // replace with API ID and API KEY
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
