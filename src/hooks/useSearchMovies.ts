import * as React from "react";
import { useQuery } from "react-query";
import { Movie, moviesAPI } from "../apis";
import debounce from "lodash.debounce";

type Options = {
  maxResults?: number;
};

export const useSearchMovies = function (opts?: Options) {
  const maxResults = opts?.maxResults || 20;
  const [keyword, setKeyword] = React.useState("");

  const query = useQuery(["movies", keyword], () => moviesAPI.search(keyword), {
    enabled: keyword.length > 1,
    staleTime: 1000 * 60 * 5,
  });

  const { current: search } = React.useRef(
    debounce((keyword: string) => {
      setKeyword(keyword);
    }, 500)
  );

  const getResult = (): Movie[] => {
    const rows = query.data?.rows || [];
    if (rows.length) {
      return rows.slice(0, maxResults);
    }
    return rows;
  };

  const checkHasNoResults = () => {
    if(keyword && !query.isLoading) {
      if(!getResult().length) {
        return true;
      }
    }
    return false;
  };

  const clear = () => {
    setKeyword("");
  };

  return {
    clear,
    search,
    keyword,
    results: getResult(),
    isLoading: query.isLoading,
    noResults: checkHasNoResults(),
  };
};
