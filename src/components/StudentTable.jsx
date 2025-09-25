import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TablePagination,
  Chip
} from "@mui/material";

const subjects = ["Math", "Science", "English", "History", "Geography"];


const divisionColors = {
  First: "success",
  Second: "primary",
  Third: "warning",
  Fail: "error"
};

export default function StudentTable({ students, onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              {subjects.map(sub => <TableCell key={sub}>{sub}</TableCell>)}
              <TableCell>Total</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7 + subjects.length} align="center" sx={{ color:'#64748b' }}>
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(student => (
                  <TableRow
                    key={student.id}
                    sx={{
                      "&:hover": { backgroundColor: "#e0f7fa" },
                      transition: "0.3s"
                    }}
                  >
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    {student.marks.map((mark, idx) => <TableCell key={idx}>{mark}</TableCell>)}
                    <TableCell>{student.total}</TableCell>
                    <TableCell>{student.percentage.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Chip
                        label={student.division}
                        color={divisionColors[student.division] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => onEdit(student.id)} sx={{ mr:1 }}>Edit</Button>
                      <Button variant="contained" color="error" size="small" onClick={() => onDelete(student.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
