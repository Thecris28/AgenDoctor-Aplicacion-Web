

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export async function getAllPsychologists() {
  const response = await fetch(`${API_URL}/psicologos/get_psicologos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching psychologists');
  }

  const data = await response.json();

  return data;
}

