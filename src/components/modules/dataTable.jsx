import React, { memo, useMemo, useRef, useEffect } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
} from "@/components/modules/Table/table";
import SelectAction from "./Button/SelectAction";
import registryEntity from "@/utils/registryEntity";
import SelectAllCheckbox from "./Table/Cell/SelectAllCheckbox";
import RowSelectCheckbox from "./Table/Cell/RowSelectCheckBox";
import { useModal } from "@/contexts/ModalContext";
import DataTableSkelton from "./Table/dataTableSkelton";
import useInfiniteCustomeQuery from "@/hooks/useCustomeInfiniteQuery";
import { Input } from "./input";
import { Search } from "lucide-react";
import { Button } from "./Button/button";
import useCustomeMutation from "@/hooks/useCustomeMutation";
import { useQueryClient } from "@tanstack/react-query";

function DataTable({
  enableRowSelection = false,
  user,
  entityName,
  search = false,
}) {
  const registry = registryEntity[entityName]?.table;
  const queryClient = useQueryClient();
  const dataArrayName = registry.dataArrayName;
  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteCustomeQuery(
    registry.key,
    registry.deps,
    registry.url,
    registry.headers,
    registry.isPrivate
  );

  const { mutate, isPending } = useCustomeMutation(
    registry.key,
    registry.deps,
    `${registry.url}/search`,
    { "content-type": "application/json" },
    "post",
    true,
    dataArrayName
  );

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const value = searchInputRef.current?.value?.trim();
    mutate(
      { value },
      {
        onSuccess: (response) => {
          const finalKey = [registry.key, registry.deps];
          queryClient.setQueryData(finalKey, (oldData) => {
            return {
              pages: [
                {
                  [dataArrayName]: response[dataArrayName],
                },
              ],
              pageParams: [undefined],
            };
          });
        },
      }
    );
  };

  const flatData = useMemo(() => {
    if (!pages || !pages.pages) return [];
    const arr = pages.pages.flatMap((p) => p?.[dataArrayName] ?? []);
    return arr;
  }, [pages, dataArrayName]);

  const allRowIds = useMemo(
    () => flatData?.map((d) => d._id) ?? [],
    [flatData]
  );

  const columnHelper = useMemo(() => createColumnHelper(), []);
  const { showModal } = useModal();
  let columns = registry.columns(user.role, showModal, user);

  if (enableRowSelection) {
    const selectColumn = columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <SelectAllCheckbox
          allRowIds={table.options.meta?.allRowIds ?? allRowIds}
        />
      ),
      cell: ({ row, table }) => {
        const metaIds = table.options.meta?.allRowIds ?? allRowIds;
        return <RowSelectCheckbox rowId={row.id} allRowIds={metaIds} />;
      },
      size: 40,
    });

    columns = [...columns, selectColumn];
  }

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
    meta: { allRowIds },
  });

  const observerRef = useRef(null);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage().catch(() => {
              /* swallow */
            });
          }
        }
      },
      {
        threshold: 0.5,
      }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <DataTableSkelton enableRowSelection={enableRowSelection} />;
  }

  if (isError) {
    return (
      <div className="p-4">
        <p>خطا در بارگذاری داده‌ها.</p>
        <pre>{String(error)}</pre>
        <button onClick={() => refetch()}>تلاش مجدد</button>
      </div>
    );
  }

  return (
    <>
      {search && (
        <div className="flex flex-row-reverse">
          <div className="input-container w-100 border-1 rounded-sm flex items-center">
            <Input
              ref={searchInputRef}
              placeholder="جستجو ..."
              className="w-100 !text-sm border-0 !shadow-none focus:!ring-0"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="cursor-pointer flex items-center justify-center"
            >
              <Search />
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card shadow-sm overflow-hidden my-4 w-full">
        <Table>
          <TableHeader className="sticky top-0">
            {table?.getHeaderGroups()?.map((hg) => (
              <TableRow className="bg-gray-100" key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-center py-3">
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table && table?.getRowModel()?.rows?.length > 0 ? (
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow key={row.id}>
                  {row._getAllVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {cell.column.columnDef.cell(cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>رکوردی برای نمایش وجود ندارد</TableCell>
              </TableRow>
            )}
            <tr className="w-[1px] h-[1px] opacity-0" ref={observerRef}></tr>
          </TableBody>
          {enableRowSelection && (
            <TableFooter className="sticky bottom-0">
              <TableRow className="bg-white">
                <TableCell className="bg-white">
                  <SelectAction registry={registry} />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </>
  );
}

export default memo(DataTable);
