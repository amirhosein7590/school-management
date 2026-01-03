import React, { memo, useMemo } from "react";
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
import useCustomeQuery from "@/hooks/useCustomeQuery";
import SelectAllCheckbox from "./Table/Cell/SelectAllCheckbox";
import RowSelectCheckbox from "./Table/Cell/RowSelectCheckBox";
import { useModal } from "@/contexts/ModalContext";

function DataTable({ enableRowSelection = false, user, entityName }) {
  const registry = registryEntity[entityName]?.table;
  const { data, isPending } = useCustomeQuery(
    registry.key,
    registry.deps,
    registry.url,
    registry.headers,
    registry.isPrivate
  );

  const allRowIds = useMemo(
    () => data && data?.[registry.dataArrayName]?.map((d) => d._id),
    [data]
  );

  const columnHelper = useMemo(() => createColumnHelper(), []);
  const { showModal } = useModal();
  let columns = registry.columns(user.role, showModal);

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
    data: data?.[registry?.dataArrayName] || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
    meta: { allRowIds },
  });

  if (isPending) {
    return "";
  }

  return (
    <>
      <div className="rounded-md border bg-card shadow-sm overflow-hidden my-4 w-full">
        <Table>
          <TableHeader>
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
          </TableBody>

          {enableRowSelection && (
            <TableFooter>
              <TableRow>
                <TableCell>
                  <SelectAction />
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
