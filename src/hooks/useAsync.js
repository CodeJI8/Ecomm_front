import { useCallback, useEffect, useState } from "react";

export default function useAsync(request) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ request: null, attempt: -1, data: null, error: null });
  const run = useCallback(() => setAttempt((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve()
      .then(() => request({ signal: controller.signal }))
      .then((data) => {
        if (!controller.signal.aborted) setResult({ request, attempt, data, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ request, attempt, data: null, error });
      });
    return () => controller.abort();
  }, [request, attempt]);

  const current = result.request === request && result.attempt === attempt;
  return {
    data: current ? result.data : null,
    loading: !current,
    error: current ? result.error : null,
    run,
  };
}
