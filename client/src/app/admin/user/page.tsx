'use client';
import { useState } from 'react';
import useSWR from 'swr';

import useDebounce from '~/hooks/use-debounce';
import { createClientService } from '~/lib/service-client';
import { userServiceInstance } from '~/services/user';
import PaginationControls from '~/components/pagination-controls';
import UserSearchFilter from './_components/user-search-filter';
import UserTable from './_components/user-table';

const UserPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const { getUsers } = createClientService(userServiceInstance);

    const { data, error, isLoading } = useSWR(
        ['users', debouncedSearchQuery, page, limit],
        () => getUsers({
            q: debouncedSearchQuery || undefined,
            page,
            limit,
		}),
		{
			keepPreviousData: true
		}
    );

    const handlePageSizeChange = (newSize: number) => {
        setLimit(newSize);
        setPage(1); // Reset to first page when changing page size
    };

    if (error) throw error;

    const users = data?.users || [];
    const total = data?.total || 0;

    return (
        <div className="space-y-4">
            <UserSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <UserTable
                users={users}
                isLoading={users.length==0&&isLoading}
            />

            <PaginationControls
                totalItems={total}
                initialPage={page}
                initialSize={limit}
                onPageChange={setPage}
                onSizeChange={handlePageSizeChange}
                isLoading={isLoading}
            />
        </div>
    );
};

export default UserPage;