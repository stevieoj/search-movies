import * as React from "react";
import { useQuery } from "react-query";
import { moviesAPI } from "../apis";
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

  const checkHasNoResults = () => {
    if (query.data && !query.data.rows?.length) {
      if (!query.isLoading) {
        return true;
      }
    }
    return false;
  };

  const getResult = () => {
    if (Array.isArray(query.data?.rows)) {
      return query.data.rows.slice(0, maxResults);
    }
    return query.data?.rows;
  };

  const clearSearch = () => {
    setKeyword("");
  };

  return {
    search,
    keyword,
    clearSearch,
    results: getResult(),
    noResults: checkHasNoResults(),
  };
};
