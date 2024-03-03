const BACKEND_URL = "https://api.adriatic.hr/test";

const createRequest = async (url, method, headers, body) => {
  const controller = new AbortController();
  const abortTimeout = setTimeout(() => controller.abort(), 5000);

  try {
    const requestOptions = {
      method,
      body,
      signal: controller.signal,
    };

    if (headers) {
      requestOptions.headers = headers;
    }

    const response = await fetch(`${BACKEND_URL}/${url}`, requestOptions);

    clearTimeout(abortTimeout);

    const data = await response.json();

    if (data) {
      return { status: "success", data };
    }

    return { status: "error" };
  } catch (error) {
    if (error.name === "AbortError") {
      return { status: "error", message: error.message };
    } else {
      return { status: "error", message: "Unable to fetch data!" };
    }
  }
};

export const getAccomodationData = async () =>
  await createRequest("accommodation", "GET", null, null);
