import axios from "axios";

export interface Movie {
  _id: string;
  title: string;
  rank: string;
  id: string;
  __flag: string;
}

export interface Result {
  rows: Movie[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const moviesAPI = {
  async search(keyword: string): Promise<Result> {
    const res = await axios.get<Result>(
      `https://api.buildable.dev/trigger/v2/test-0d6d4ffa-777e-44c9-bb69-b9b8dd5da59f?search=${keyword}`
    );
    return res.data;
  },
};
