"use client";

import { createContext, ReactNode, useState, useEffect } from "react";
import { EpisodeProps } from "@/types";

interface EpisodeContextType {
  data: EpisodeProps[];
  setData: (data: EpisodeProps[]) => void;
}

export const EpisodeContext = createContext<EpisodeContextType | undefined>(
  undefined
);

export const EpisodeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<EpisodeProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/all-episodes`);
      const json = await res.json();
      setData(json["data"]);
    };
    fetchData();
    console.log(data);
  }, []);

  return (
    <EpisodeContext.Provider value={{ data, setData }}>
      {children}
    </EpisodeContext.Provider>
  );
};