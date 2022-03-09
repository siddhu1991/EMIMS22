import * as React from "react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "../utils/supabaseClient";

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default function Users() {
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: "200" },
    { field: "surname", headerName: "Surname", width: "200" },
    { field: "created_at", headerName: "Created At", width: "200" },
  ];

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [searchText, setSearchText] = useState("");
  const prevSelectionModel = useRef(selectionModel);
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const rowCount = async () => {
    const { count } = await supabase
      .from("posta")
      .select("*", { count: "exact" });
    setCount(count);
  };

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      rowCount();
      const newRows = await loadServerRows(page, sortModel, searchText);

      if (!active) {
        return;
      }

      setRows(newRows);
      setLoading(false);
      setTimeout(() => {
        setSelectionModel(prevSelectionModel.current);
      });
    })();

    return () => {
      active = false;
    };
  }, [page, sortModel, searchText]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DataGrid
        components={{ Toolbar: QuickSearchToolbar }}
        rows={rows}
        columns={columns}
        pagination
        checkboxSelection
        pageSize={pageSize}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        rowsPerPageOptions={[5, 10, 20]}
        rowCount={count}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        paginationMode="server"
        onPageChange={(newPage) => {
          prevSelectionModel.current = selectionModel;
          setPage(newPage);
        }}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        loading={loading}
        autoHeight={true}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
      />
    </div>
  );
}

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      />
    </Box>
  );
}

/* Load the Dyanmic Data from Supabase*/
async function loadServerRows(page, sorting, searchText) {
  let sort = false;
  let sorting_field = "id";
  if (sorting != "") {
    sorting_field = sorting[0].field;
    if (sorting[0].sort == "asc") {
      sort = true;
    }
  }

  const startIndex = page * 13;
  const endIndex = (page + 1) * 13;
  let query = supabase
    .from("posta")
    .select("*")
    .range(startIndex, endIndex)
    .order(sorting_field, { ascending: sort })
    // If search text
    if(searchText != ''){
      query.textSearch('name', searchText);
    }

  const { data, error } = await query

  if (error) {
    throw new Error(error);
  }
  return data;
}
