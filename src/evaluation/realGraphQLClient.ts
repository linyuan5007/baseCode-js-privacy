export async function fetchRealGraphQLData(query: string, variables = {}) {
  const response = await fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Real GraphQL API failed: ${response.status}`);
  }

  return response.json();
}