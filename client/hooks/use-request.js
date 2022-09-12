import { useCallback, useState } from "react";
import axios from "axios";

export const useRequest = (requestConfig) => {
  const [errors, setErrors] = useState(null);

  const sendRequest = useCallback(async () => {
    setErrors(null);
    try {
      const response = await axios({ url: requestConfig.url, method: requestConfig.method, data: requestConfig.body, params: requestConfig.params });
      return response;
    } catch(err) {
      console.log(err);
      setErrors(
        <div className="alert alert-danger" role="alert">
          <h3>Oops...</h3>
          <ul className="my-0" >
            {
              err.response.data.errors.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))
            }
          </ul>
        </div>
      );
    }
  }, [requestConfig]);

  return [errors, sendRequest];
};