/**
 * Converts a plain object into FormData for multipart requests.
 * - undefined      -> skipped
 * - null           -> sent as "" (use to clear a value, e.g. parentId)
 * - arrays         -> appended repeatedly under the same key
 *                     (images: [f1, f2], categoryIds: [1, 2])
 * - File / Blob    -> appended as is
 * - other values   -> stringified
 */
export const toFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;

    if (value === null) {
      formData.append(key, "");
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
