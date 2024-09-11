"use client"
import { MdSearch } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/_components/ui/button";

type SearchProps = {
    placeholder: string;
    option1: string;
    option2: string;
};

export default function Search({ placeholder, option1, option2 }: SearchProps) {
    const [searchType, setSearchType] = useState<typeof option1 | typeof option2>(option2);
    const [searchValue, setSearchValue] = useState<string>(""); // Add state for input value

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

    useEffect(() => {
        const currentValue = params.get(searchType) || "";
        setSearchValue(currentValue);
    }, [searchType, searchParams, params]);

    // Debounced input handler
    const handleSearchInput = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value) {
            params.set(searchType, value);
        } else {
            params.delete(searchType);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 100);

    // Handle search option toggle
    const handleSearchClick = () => {
        params.delete(searchType); // Clear current param
        setSearchType((prev) => (prev === option1 ? option2 : option1)); // Toggle search type
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={`flex items-center dark:bg-navy-700 bg-slate-300 p-2.5 w-max gap-2.5 rounded-lg h-12`}>
            <MdSearch size={20} />
            <input
                type="text"
                placeholder={placeholder}
                className={`border-none bg-transparent outline-none dark:text-white`}
                onChange={(e) => { setSearchValue(e.target.value); handleSearchInput(e) }}
                value={searchValue}
            />
            <Button
                onClick={handleSearchClick}
                className={`font-bold border border-navy-900 ${searchType === option1 ? "dark:bg-navy-800 bg-white" : ""}`}
                variant="ghost"
            >
                {option1}
            </Button>
        </div>
    )
}