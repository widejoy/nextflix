"use client";

import { useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ComponentProps,
} from "react";
import { fetchShows } from "@/utils/fetchData";
import Showlist from "@/components/showlist";

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showsQuery: ReturnType<typeof useQuery>;
  filteredShows: Show[];
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface Show {
  id: number;
  title: string;
  name: string;
  release_year?: string;
  poster?: { src: string; hash: string };
}

interface SearchProviderProps {
  children: ReactNode;
  initialData: { shows: { data: Show[] } };
}

export const SearchProvider = (props: SearchProviderProps) => {
  const { initialData, children } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const showsQuery = useQuery({
    queryKey: ["shows"],
    queryFn: fetchShows,
    staleTime: 5 * 60 * 1000,
    initialData: initialData.shows,
  });

  const shows = showsQuery?.data?.data || [];

  const filteredShows = searchQuery
    ? shows.filter((show: { name: string }) =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shows;

  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, showsQuery, filteredShows }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

type ContentProps = ComponentProps<"div">;

export function LoadingContent(props: ContentProps) {
  const { showsQuery } = useSearch();

  if (showsQuery.isLoading) {
    return <div {...props} />;
  }
}

export function ErrorContent(props: ContentProps) {
  const { showsQuery } = useSearch();

  if (showsQuery.isError) {
    return <div {...props} />;
  }
}

type ShowInputProps = ComponentProps<"input">;

export function ShowInput(props: ShowInputProps) {
  const { filteredShows, searchQuery, setSearchQuery } = useSearch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      aria-expanded={filteredShows.length > 0}
      value={searchQuery}
      onChange={handleSearchChange}
      {...props}
    />
  );
}

export function FilteredShowsList(props: ContentProps) {
  const { filteredShows } = useSearch();

  return (
    filteredShows.length > 0 &&
    filteredShows.map((show) => (
      <div key={show.id} {...props}>
        <Showlist show={show} />
      </div>
    ))
  );
}

type NoShowConditionProps = ComponentProps<"p">;

export function NoShowCondition(props: NoShowConditionProps) {
  const { filteredShows } = useSearch();

  return filteredShows.length === 0 && <p {...props}>No shows found</p>;
}
