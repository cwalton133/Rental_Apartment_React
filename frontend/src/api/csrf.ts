import axios from "axios";

export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/csrf-token/", { withCredentials: true });
    document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

export const getCsrfToken = (): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
};
