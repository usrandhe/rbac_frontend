import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface UseDebouncedSearchProps {
    onSearchChange: (search: string) => void;
    onPageChange: (page: number) => void;
    delay?: number;
}

export function useDebouncedSearch({
    onSearchChange,
    onPageChange,
    delay = 300,
}: UseDebouncedSearchProps) {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, delay);

    useEffect(() => {
        onSearchChange(debouncedSearchValue);
        onPageChange(1);
    }, [debouncedSearchValue, onSearchChange, onPageChange]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    return {
        searchValue,
        handleSearch,
    };
}
