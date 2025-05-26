import {
  ErrorContent,
  FilteredShowsList,
  LoadingContent,
  NoShowCondition,
  SearchProvider,
  ShowInput,
} from "./page-clients";

interface Show {
  id: number;
  title: string;
  name: string;
  release_year?: string;
  poster?: { src: string; hash: string };
}

interface ApiResponse {
  shows: { data: Show[] };
}

export default function SearchClient({
  initialData,
}: {
  initialData: ApiResponse;
}) {
  <LoadingContent className="text-white text-center mt-20">
    Loading...
  </LoadingContent>;

  <ErrorContent className="text-red-500 text-center mt-20">
    Error fetching shows
  </ErrorContent>;

  return (
    <SearchProvider initialData={initialData}>
      <div className="w-full max-w-[1332px] mx-auto px-4 pt-[88px]">
        <ShowInput
          autoComplete="off"
          id="search"
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="search-results"
          className="w-full border-0 text-black text-2xl font-semibold leading-[115%] outline-none placeholder:text-opacity-50"
          placeholder="Search shows"
          type="text"
        />

        <div
          id="search-results"
          className="flex flex-wrap gap-16 pt-6  max-lg:gap-10 max-sm:justify-between max-sm:gap-[24px]"
        >
          <FilteredShowsList className="w-full max-w-[200px] max-sm:max-w-[45%]" />
          <NoShowCondition className="text-black text-2xl font-semibold leading-[115%]" />
        </div>
      </div>
    </SearchProvider>
  );
}
