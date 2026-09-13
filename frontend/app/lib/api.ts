const API_URL = "http://localhost:5000";

export async function getListings() {
  const response = await fetch(`${API_URL}/marketplace`);

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}