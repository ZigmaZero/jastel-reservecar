import { useEffect, useState, useCallback, type FC } from "react";
import listReservations from "../../api/reservations/listReservations";
import type { ReservationExternal } from "../../types/externalTypes";
import exportReservations from "../../api/reservations/exportReservations";
import ExportJobsModal from "../ExportJobsModal";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  type GridColumnVisibilityModel,
  type GridColDef,
  type GridFilterModel,
  type GridPaginationModel,
  type GridSortModel,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  Toolbar,
  getGridNumericOperators,
  getGridStringOperators,
  getGridDateOperators,
  GridActionsCellItem
} from "@mui/x-data-grid";
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import EditJobsModal from "../editModals/EditJobsModal";
import editReservation from "../../api/reservations/editReservation";

interface JobsPanelProps {
  token: string;
}

const pageSizeOptions = [10, 25, 50];

const JobsPanel: FC<JobsPanelProps> = ({ token }) => {

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [data, setData] = useState<ReservationExternal[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [loading, setLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<ReservationExternal | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listReservations(
        paginationModel,
        sortModel,
        filterModel,
        token
      );
      setData(response.data);
      setRowCount(response.total ?? response.data.length);
    } catch {
      setData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, sortModel, filterModel, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (row: any) => {
    setEditItem(row as ReservationExternal);
    setIsEditOpen(true);
  };

  const resolveEdit = async (item: ReservationExternal, updatedItem: ReservationExternal) => {
    await editReservation(item, updatedItem, token);
    await fetchData();
    setIsEditOpen(false);
    setEditItem(null);
  };

  const handleExport = async (startTime: string, endTime: string) => {
    const exportData = await exportReservations(startTime, endTime, token);
    if (exportData.length === 0) {
      alert("No job data in that range.");
      return;
    }

    // Define CSV headers
    const headers = [
      "id",
      "user",
      "car",
      "description",
      "checkinTime",
      "checkoutTime"
    ];

    // Create CSV rows
    const rows = exportData.map(reservation =>
      headers.map(header => {
        // Escape quotes and commas in values
        const value = reservation[header as keyof ReservationExternal];
        if (value === undefined || value === null) return "";
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",")
    );

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\r\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reservations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    {
      field: "id", headerName: "ID", width: 50, type: "number",
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "="
      )
    },
    {
      field: "userId", headerName: "User ID", width: 50, type: "number",
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "="
      )
    },
    {
      field: "user", headerName: "User", flex: 1, width: 120,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains"
      )
    },
    {
      field: "carId", headerName: "Car ID", width: 50, type: "number",
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "="
      )
    },
    {
      field: "car", headerName: "Car", flex: 1, width: 90,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains"
      )
    },
    {
      field: "description", headerName: "Description", flex: 1, width: 150,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains"
      )
    },
    {
      field: "checkinTime",
      headerName: "Check-in",
      flex: 1,
      width: 220,
      type: "dateTime",
      filterOperators: getGridDateOperators(true).filter(
        (operator) => operator.value === "onOrBefore" || operator.value === "onOrAfter"
      ),
      valueGetter: (value) =>
        value ? new Date(value) : null,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "Not checked in"
    },
    {
      field: "checkoutTime",
      headerName: "Check-out",
      flex: 1,
      width: 220,
      type: "dateTime",
      filterOperators: getGridDateOperators(true).filter(
        (operator) => operator.value === "onOrBefore" 
        || operator.value === "onOrAfter"
        || operator.value === "isEmpty"
        || operator.value === "isNotEmpty"
      ),
      valueGetter: (value) =>
        value ? new Date(value) : null,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : "Not checked out"
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
          showInMenu={false}
        />,
      ]
    }
  ];

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    id: false,
    userId: false,
    carId: false
  });

  const JobsPanelToolbar = () => (
    <Toolbar>
      <Tooltip title="Export">
        <ToolbarButton
          disabled={data.length === 0}
          onClick={() => setIsExportOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger>
          <ToolbarButton>
            <ViewColumnIcon fontSize="small" />
          </ToolbarButton>
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>
    </Toolbar>
  )

  return (
    <Paper sx={{ p: 3, mt: 2 }} variant="outlined">
      <Typography variant="h5" gutterBottom>
        งานจองรถ
      </Typography>
      {isExportOpen && (
        <ExportJobsModal
          onClose={() => setIsExportOpen(false)}
          onExport={handleExport}
        />
      )}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          pagination
          pageSizeOptions={pageSizeOptions}
          paginationMode="server"
          paginationModel={paginationModel}
          sortingMode="server"
          sortModel={sortModel}
          filterMode="server"
          filterModel={filterModel}
          rowCount={rowCount}
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={setSortModel}
          onFilterModelChange={setFilterModel}
          loading={loading}
          getRowId={(row) => row.id ?? Math.random()}
          disableRowSelectionOnClick
          showToolbar
          slots={{ toolbar: JobsPanelToolbar }}
        />
      </Box>
      {isEditOpen && editItem && (
        <EditJobsModal
          item={editItem}
          onClose={() => setIsEditOpen(false)}
          onEdit={resolveEdit}
        />
      )}
    </Paper>
  );
};

export default JobsPanel;