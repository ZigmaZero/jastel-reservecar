import axios from 'axios';
import type { CarExternal } from '../../types/externalTypes';
import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export default function listCars(
    paginationModel: GridPaginationModel, 
    sortModel: GridSortModel,
    filterModel: GridFilterModel,
    token: string
): Promise<{
    data: CarExternal[];
    total: number;
    page: number;
    pageSize: number;
    maxPages: number;
}> {
    return axios.get(`/cars`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            params: {
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                sortField: sortModel.at(0)?.field,
                sortOrder: sortModel.at(0)?.sort,
                filterField: filterModel.items.at(0)?.field,
                filterOp: filterModel.items.at(0)?.operator,
                filterValue: filterModel.items.at(0)?.value
            },
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            return response.data;
        })
        .catch((error) => {
            if(error.response && error.response.status !== 400 && error.response.status !== 401) {
                console.error("Unexpected error status:", error.response.status, error.response.data);
                throw new Error("An unexpected error occurred. Please try again later.");
            }
            else {
                throw error;
            }
        })
}