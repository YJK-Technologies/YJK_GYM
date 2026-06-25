"use client";

import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  GridOptions,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import '../../App.css';

interface AgGridTableProps {
  rowData: any[];
  columnDefs: ColDef[];
  loading?: boolean;
  height?: string;
  gridOptions?: GridOptions;
  onGridReady?: (params: GridReadyEvent) => void;
}

export default function AgGridTable({
  rowData,
  columnDefs,
  loading = false,
  height = "450px",
  gridOptions,
  onGridReady,
}: AgGridTableProps) {
  return (
    <div
      className="ag-theme-quartz w-full"
      style={{ height }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        loading={loading}
        animateRows
        suppressCellFocus
        headerHeight={48}
        rowHeight={60}
        pagination={true}
        paginationAutoPageSize={true}
        defaultColDef={{
          sortable: true,
          filter: false,
          resizable: true,
          flex: 1,
        }}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
      />
    </div>
  );
}