export function getApiData(response) {
  return response && typeof response === "object" && Object.prototype.hasOwnProperty.call(response, "data")
    ? response.data
    : response;
}
