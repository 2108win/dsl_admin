import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
type useFetchProps = {
  url: string;
  params?: any;
}
const useFetch = (props: useFetchProps) => {
  const { url, params } = props;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, params ? params : {});
        setData(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        toast.error("call api failed", {
          description: "Something went wrong. Please try again.",
        });
        setLoading(false);
      }
    };

    fetchData();

    // Clean up
    return () => {
      setData(null);
      setLoading(true);
      setError(null);
    };
  }, [url]);
  return { data, loading, error };
};

export default useFetch;
