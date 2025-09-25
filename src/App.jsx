import React, { useState, useMemo } from 'react';
import { Container, Paper, Typography, Box, TextField, Select, MenuItem } from '@mui/material';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import Modal from './components/Modal';

export default function App() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name:'', age:'', marks:['','','','',''] });
  const [searchName, setSearchName] = useState('');
  const [filterDivision, setFilterDivision] = useState('All');
  const [modal, setModal] = useState({ open:false, title:'', message:'', onConfirm: null, showCancel:false });

  // Helper functions
  const parseMarks = (marksArr) => marksArr.map(m => Number.isFinite(Number(m)) ? Number(m) : 0);
  const calculateTotals = (marksArr) => {
    const parsed = parseMarks(marksArr);
    const total = parsed.reduce((a,b) => a+b,0);
    const percentage = (total/(5*100))*100;
    return { total, percentage };
  };
  const getDivision = (percentage) => percentage>=60?'First':percentage>=45?'Second':percentage>=33?'Third':'Fail';
  const validateForm = ({name,age,marks}) => {
    const errors = [];
    if(!name || name.trim().length===0) errors.push('Name is required.');
    const ageN = Number(age);
    if(!Number.isInteger(ageN) || ageN<=0) errors.push('Age must be positive integer.');
    marks.forEach((m,idx)=>{const n=Number(m); if(!Number.isFinite(n)||n<0||n>100) errors.push(`Mark ${idx+1} must be 0-100.`)});
    return errors;
  };

  // Handlers
  const handleSubmit = (e)=>{
    e.preventDefault();
    const errors = validateForm(formData);
    if(errors.length>0){
      setModal({ open:true, title:'Validation Error', message:errors.join('\n'), onConfirm:()=>setModal(m=>({...m,open:false})), showCancel:false});
      return;
    }
    const {total,percentage}=calculateTotals(formData.marks);
    const division = getDivision(percentage);
    if(editingId){
      setStudents(prev=>prev.map(s=>s.id===editingId?{...s, name:formData.name.trim(), age:Number(formData.age), marks:parseMarks(formData.marks), total, percentage, division}:s));
      setModal({ open:true, title:'Updated', message:'Student updated successfully.', onConfirm:()=>setModal(m=>({...m,open:false})), showCancel:false});
      setEditingId(null);
    } else {
      const newStudent = { id:Date.now(), name:formData.name.trim(), age:Number(formData.age), marks:parseMarks(formData.marks), total, percentage, division };
      setStudents(prev=>[newStudent,...prev]);
      setModal({ open:true, title:'Added', message:'Student added successfully.', onConfirm:()=>setModal(m=>({...m,open:false})), showCancel:false});
    }
    setFormData({ name:'', age:'', marks:['','','','',''] });
  };

  const handleEdit = id => {
    const s = students.find(x=>x.id===id);
    if(!s) return;
    setEditingId(id);
    setFormData({ name:s.name, age:String(s.age), marks:s.marks.map(m=>String(m)) });
    window.scrollTo({top:0, behavior:'smooth'});
  };

  const handleDelete = id => {
    const student = students.find(s=>s.id===id);
    if(!student) return;
    setModal({
      open:true, title:'Confirm Delete', message:`Delete ${student.name}? This cannot be undone.`,
      showCancel:true,
      onConfirm:()=>{ setStudents(prev=>prev.filter(s=>s.id!==id)); setModal({ open:true, title:'Deleted', message:'Student deleted.', onConfirm:()=>setModal(m=>({...m,open:false})), showCancel:false }) }
    });
  };

  const handleCancelEdit = () => { setEditingId(null); setFormData({ name:'', age:'', marks:['','','','',''] }); };

  const displayedStudents = useMemo(()=>{
    const term = searchName.trim().toLowerCase();
    return students.filter(s=>{
      const matchesName = term==='' || s.name.toLowerCase().includes(term);
      const matchesDiv = filterDivision==='All' || s.division===filterDivision;
      return matchesName && matchesDiv;
    });
  },[students, searchName, filterDivision]);

  const divisionOptions = useMemo(()=>{
    const set = new Set(students.map(s=>s.division));
    return ['All', ...Array.from(set)];
  },[students]);

  return (
    <Box sx={{ minHeight:'100vh', background:'linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)', py:5 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight:'bold', mb:4, color:'#1e3a8a' }}>
          Student Data Dashboard
        </Typography>

        <StudentForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          isEditing={Boolean(editingId)}
        />

        <Paper sx={{ p:3, mt:4 }}>
          <Box sx={{ display:'flex', gap:2, mb:2, flexWrap:'wrap', alignItems:'center' }}>
            <TextField label="Search by Name" size="small" value={searchName} onChange={e=>setSearchName(e.target.value)} />
            <Select size="small" value={filterDivision} onChange={e=>setFilterDivision(e.target.value)}>
              {divisionOptions.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
            <Box sx={{ ml:'auto', fontWeight:'medium', color:'#475569' }}>Total Records: {students.length}</Box>
          </Box>

          <StudentTable students={displayedStudents} onEdit={handleEdit} onDelete={handleDelete} />
        </Paper>

        <Modal
          open={modal.open}
          title={modal.title}
          message={modal.message}
          onConfirm={()=>typeof modal.onConfirm==='function'?modal.onConfirm():setModal(m=>({...m,open:false}))}
          onClose={()=>setModal(m=>({...m,open:false}))}
          showCancel={modal.showCancel}
        />
      </Container>
    </Box>
  );
}
