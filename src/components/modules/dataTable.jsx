import React, { memo, useEffect, useMemo } from "react";
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
} from "@/components/modules/Table/table";

import StatusButtons from "./Button/StatusButton";
import TimeCell from "./Table/Cell/TimeCell";
import DescriptionCell from "./Table/Cell/DescriptionCell";

import RowSelectCheckbox from "@/components/modules/Table/Cell/RowSelectCheckBox";
import SelectAllCheckbox from "@/components/modules/Table/Cell/SelectAllCheckbox";
import SelectAction from "./Button/SelectAction";
import useTableStore from "@/store/tableStore";

function DataTable({ enableRowSelection = true }) {
  const data = useMemo(
    () => [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        firstName: "علی",
        lastName: "محمدی",
        teacher: "فاطمه اکبری",
      },
      {
        id: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
        firstName: "سارا",
        lastName: "رحمانی",
        teacher: "مهدی نوروزی",
        status: "absent",
      },
      {
        id: "c3d4e5f6-a7b8-9012-cdef-345678901234",
        firstName: "رضا",
        lastName: "کریمی",
        teacher: "فاطمه اکبری",
        status: "late",
      },
      {
        id: "d4e5f6a7-b8c9-0123-def0-456789012345",
        firstName: "مریم",
        lastName: "جعفری",
        teacher: "حسین علیزاده",
        status: "excused",
      },
      {
        id: "e5f6a7b8-c9d0-1234-ef01-567890123456",
        firstName: "امیرحسین",
        lastName: "قاسمی",
        teacher: "زهرا امیری",
      },
      {
        id: "f6a7b8c9-d0e1-2345-f012-678901234567",
        firstName: "نازنین",
        lastName: "موسوی",
        teacher: "مهدی نوروزی",
        status: "other",
      },
      {
        id: "a7b8c9d0-e1f2-3456-7890-890123456789",
        firstName: "پارسا",
        lastName: "احمدی",
        teacher: "حسین علیزاده",
      },
      {
        id: "b8c9d0e1-f2a3-4567-8901-901234567890",
        firstName: "فاطمه",
        lastName: "حسینی",
        teacher: "زهرا امیری",
        status: "absent",
      },
      {
        id: "c9d0e1f2-a3b4-5678-9012-012345678901",
        firstName: "کامیار",
        lastName: "رستمی",
        teacher: "فاطمه اکبری",
        status: "late",
      },
      {
        id: "d0e1f2a3-b4c5-6789-0123-123456789012",
        firstName: "یاسمن",
        lastName: "نوروزی",
        teacher: "مهدی نوروزی",
      },
    ],
    []
  );

  const allRowIds = useMemo(() => data.map((d) => d.id), [data]);

  const columnHelper = useMemo(() => createColumnHelper(), []);

  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor("fullName", {
        header: "نام و نام خانوادگی",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("teacher", {
        header: "نام معلم",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.display({
        id: "status",
        header: "وضعیت غیبت",
        cell: ({ row }) => <StatusButtons rowId={row.id} />,
      }),
      columnHelper.display({
        id: "time",
        header: "زمان",
        cell: ({ row }) => <TimeCell rowId={row.id} />,
      }),
      columnHelper.display({
        id: "description",
        header: "توضیحات",
        cell: ({ row }) => <DescriptionCell rowId={row.id} />,
      }),
    ];

    if (enableRowSelection) {
      cols.push(
        columnHelper.display({
          id: "select",
          header: ({ table }) => {
            return (
              <SelectAllCheckbox
                allRowIds={table.options.meta?.allRowIds ?? allRowIds}
              />
            );
          },
          cell: ({ row, table }) => {
            const metaIds = table.options.meta?.allRowIds ?? allRowIds;
            return <RowSelectCheckbox rowId={row.id} allRowIds={metaIds} />;
          },
          size: 40,
        })
      );
    }

    return cols;
  }, [columnHelper, enableRowSelection, allRowIds]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    meta: { allRowIds },
  });

  const setAllRowState = useTableStore((s) => s.setAllRowState);
  useEffect(() => {
    const initialRowsState = allRowIds.reduce((acc, curr) => {
      acc[curr] = { status: "present" };
      return acc;
    }, {});
    setAllRowState(initialRowsState);
    return () => setAllRowState({});
  }, []);

  return (
    <>
      <SelectAction />
      <div className="rounded-md border bg-card shadow-sm overflow-hidden m-4 p-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row._getAllVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {cell.column.columnDef.cell(cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default memo(DataTable);
