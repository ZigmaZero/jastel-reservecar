import { useEffect, useState, useCallback, type FC } from "react";
import listCars from "../../api/cars/listCars";
import type { CarExternal } from "../../types/externalTypes";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColumnVisibilityModel,
  type GridColDef,
  type GridFilterModel,
  type GridPaginationModel,
  type GridSortModel,
  Toolbar,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ToolbarButton,
  getGridNumericOperators,
  getGridStringOperators
} from "@mui/x-data-grid";
import AddCarsModal from "../addModals/AddCarsModal";
import addCar from "../../api/cars/addCar";
import deleteCar from "../../api/cars/deleteCar";
import editCar from "../../api/cars/editCar";
import EditCarsModal from "../editModals/EditCarsModal";
import AddIcon from '@mui/icons-material/Add';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';

interface CarsPanelProps {
  token: string;
}

const CarsPanel: FC<CarsPanelProps> = ({ token }) => {
  const [data, setData] = useState<CarExternal[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  
  const [loading, setLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<CarExternal | null>(null);

  // Data fetching function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCars(paginationModel, sortModel, filterModel, token);
      setData(
        res.data.map(car => ({
          ...car,
          teamName: car.teamName || "No Team"
        }))
      );
      setRowCount(res.total);
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      type: "number",
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "="
      )
    },
    {
      field: "plateNumber",
      headerName: "Plate No.",
      flex: 1,
      minWidth: 120,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains"
      )
    },
    {
      field: "teamId",
      headerName: "Team ID",
      type: "number",
      width: 90,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === "="
      )
    },
    {
      field: "teamName",
      headerName: "Team",
      flex: 1,
      width: 120,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains"
      )
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
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => quickDelete(params.row)}
          showInMenu={false}
        />
      ]
    }
  ];

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    id: false,
    teamId: false
  })

  const handleAdd = async (item: CarExternal) => {
    await addCar(item, token);
    await fetchData();
  };

  const handleEdit = (row: any) => {
    setEditItem(row as CarExternal);
    setIsEditOpen(true);
  };

  const quickDelete = async (row: any) => {
    const item = row as CarExternal;
    await deleteCar(item, token);
    await fetchData();
  }

  const resolveEdit = async (item: CarExternal, updatedItem: CarExternal | null) => {
    if (!updatedItem) {
      await deleteCar(item, token);
    } else {
      await editCar(item, updatedItem, token);
    }
    await fetchData();
    setIsEditOpen(false);
    setEditItem(null);
  };

  const CarsPanelToolbar = () => (
    <Toolbar>
      <Tooltip title="Add">
        <ToolbarButton onClick={() => setIsAddOpen(true)}>
          <AddIcon fontSize="small" />
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
  );

  return (
    <Paper sx={{ p: 3, mt: 2 }} variant="outlined">
      <Typography variant="h5" gutterBottom>
        Cars
      </Typography>
      {isAddOpen && (
        <AddCarsModal
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAdd}
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
          pageSizeOptions={[10, 25, 50]}
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
          slots={{ toolbar: CarsPanelToolbar }}
        />
      </Box>
      {isEditOpen && editItem && (
        <EditCarsModal
          item={editItem}
          onClose={() => setIsEditOpen(false)}
          onEdit={resolveEdit}
        />
      )}
    </Paper>
  );
};

export default CarsPanel;