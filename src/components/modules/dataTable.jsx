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
import { Button } from "./Button/button";

function DataTable({
  enableRowSelection = false,
  user,
  entityName,
  search = false,
}) {
  const registry = registryEntity[entityName]?.table;
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
    registry.isPrivate,
  );
  const flatData = useMemo(() => {
    if (!pages || !pages.pages) return [];
    const arr = pages.pages.flatMap((p) => p?.[dataArrayName] ?? []);
    return arr;
  }, [pages, dataArrayName]);

  const allRowIds = useMemo(
    () => flatData?.map((d) => d._id) ?? [],
    [flatData],
  );

  const columnHelper = useMemo(() => createColumnHelper(), []);
  const { showModal } = useModal();
  let columns = registry.columns(user?.role, showModal, user);

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
            fetchNextPage().catch(() => {});
          }
        }
      },
      {
        threshold: 0.1,
      },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <DataTableSkelton enableRowSelection={enableRowSelection} />;
  }

  return (
    <>
      <div className="rounded-[5px] border bg-card shadow-sm overflow-hidden my-4 w-full">
        <Table className="relative">
          <TableHeader className="sticky top-0 hover:bg-gray-100">
            {table?.getHeaderGroups()?.map((hg) => (
              <TableRow className="bg-gray-100 hover:bg-gray-100" key={hg.id}>
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
                <TableCell>
                  {isError
                    ? error?.response?.data?.error
                    : "رکوردی برای نمایش وجود ندارد"}
                </TableCell>
              </TableRow>
            )}
            <tr className="w-[.1px] h-[.1px] opacity-0" ref={observerRef}></tr>
          </TableBody>
          {enableRowSelection && (
            <TableFooter className="sticky bottom-0">
              <TableRow className="bg-transparent">
                <TableCell className="bg-transparent">
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
