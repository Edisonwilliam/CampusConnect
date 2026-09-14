const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getListings() {
  const response = await fetch(`${API_URL}/marketplace`);

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}