import React from "react";
import { TextField, Button, Grid, Paper } from "@mui/material";

export default function StudentForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateMark = (index, value) => {
    const newMarks = [...formData.marks];
    newMarks[index] = value;
    setFormData(prev => ({ ...prev, marks: newMarks }));
  };

  const subjects = ["Math", "Science", "English", "History", "Geography"]; // actual names

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={e => updateField("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={formData.age}
              onChange={e => updateField("age", e.target.value)}
            />
          </Grid>

          {formData.marks.map((mark, idx) => (
            <Grid item xs={12} md={2.4} key={idx}>
              <TextField
                label={subjects[idx]}
                type="number"
                fullWidth
                value={mark}
                onChange={e => updateMark(idx, e.target.value)}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isEditing ? "Update Student" : "Add Student"}
            </Button>
          </Grid>

          {isEditing && (
            <Grid item xs={12} md={6}>
              <Button type="button" variant="outlined" color="secondary" fullWidth onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </Paper>
  );
}
