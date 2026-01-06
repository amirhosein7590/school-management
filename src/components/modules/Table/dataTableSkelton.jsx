import React, { memo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
} from "@/components/modules/Table/table";

const ROW_INDICES = [0, 1];
const CELL_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function DataTableSkelton({ enableRowSelection = false, columnsCount = 5 }) {
  const totalColumns = Math.min(
    enableRowSelection ? columnsCount + 1 : columnsCount,
    10
  );

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden my-4 w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {CELL_INDICES.slice(0, totalColumns).map((cellIndex) => (
              <TableHead
                key={`header-${cellIndex}`}
                className="text-center py-3"
              >
                <div
                  className={`mx-auto bg-gray-200 rounded animate-pulse ${
                    enableRowSelection && cellIndex === 0
                      ? "h-5 w-10"
                      : "h-5 w-24"
                  }`}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {ROW_INDICES.map((rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {CELL_INDICES.slice(0, totalColumns).map((cellIndex) => (
                <TableCell
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="text-center py-4"
                >
                  <div className="flex justify-center">
                    <div
                      className={`mx-auto bg-gray-100 rounded animate-pulse ${
                        cellIndex === 0 && enableRowSelection
                          ? "h-4 w-4"
                          : rowIndex % 3 === 0
                          ? "h-4 w-32"
                          : rowIndex % 3 === 1
                          ? "h-4 w-24"
                          : "h-4 w-16"
                      }`}
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        {enableRowSelection && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={totalColumns}>
                <div className="flex justify-between items-center px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

export default memo(DataTableSkelton);
