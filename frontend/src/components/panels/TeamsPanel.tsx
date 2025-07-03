import { useEffect, useState, useCallback, type FC } from "react";
import type { TeamExternal } from "../../types/externalTypes";
import listTeams from "../../api/teams/listTeams";
import AddTeamsModal from "../addModals/AddTeamsModal";
import EditTeamsModal from "../editModals/EditTeamsModal";
import addTeam from "../../api/teams/addTeam";
import deleteTeam from "../../api/teams/deleteTeam";
import editTeam from "../../api/teams/editTeam";

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridSortModel,
  type GridPaginationModel,
  type GridFilterModel,
  type GridColumnVisibilityModel,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ToolbarButton,
  Toolbar,
  getGridNumericOperators,
  getGridStringOperators,
} from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';

interface TeamsPanelProps {
  token: string;
}

const TeamsPanel: FC<TeamsPanelProps> = ({ token }) => {
  const [data, setData] = useState<TeamExternal[]>([]);
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
  const [editItem, setEditItem] = useState<TeamExternal | null>(null);

  // Data fetching function
  const fetchData = useCallback(async () => {
    console.log({ paginationModel, sortModel, filterModel });
    setLoading(true);
    try {
      const res = await listTeams(paginationModel, sortModel, filterModel, token);
      setData(res.data);
      setRowCount(res.total ?? res.data.length);
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
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
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
    id: false
  })

  const handleAdd = async (item: TeamExternal) => {
    await addTeam(item, token);
    await fetchData();
  };

  const handleEdit = (row: any) => {
    setEditItem(row as TeamExternal);
    setIsEditOpen(true);
  };

  const quickDelete = async (row: any) => {
    const item = row as TeamExternal;
    await deleteTeam(item, token);
    await fetchData();
  };

  const resolveEdit = async (item: TeamExternal, updatedItem: TeamExternal | null) => {
    if (!updatedItem) {
      await deleteTeam(item, token);
    } else {
      await editTeam(item, updatedItem, token);
    }
    await fetchData();
    setIsEditOpen(false);
    setEditItem(null);
  };

  const TeamsPanelToolbar = () => (
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
  )

  return (
    <Paper sx={{ p: 3, mt: 2 }} variant="outlined">
      <Typography variant="h5" gutterBottom>
        ส่วนงาน
      </Typography>
      {isAddOpen && (
        <AddTeamsModal
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
          slots={{ toolbar: TeamsPanelToolbar }}
        />
      </Box>
      {isEditOpen && editItem && (
        <EditTeamsModal
          item={editItem}
          onClose={() => setIsEditOpen(false)}
          onEdit={resolveEdit}
        />
      )}
    </Paper>
  );
};

export default TeamsPanel;