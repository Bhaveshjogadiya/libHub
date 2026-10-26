
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { api } from './services/api';
import Shell from './components/Shell';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Management from './pages/Management';
import Reports from './pages/Reports';
function Guard({user,children,staff=false}){const loc=useLocation();if(!user)return <Navigate to="/login" replace state={{from:loc}}/>;if(staff&&!['admin','librarian'].includes(user.role))return <Navigate to="/dashboard" replace/>;return children}
function Inner(){const [user,setUser]=useState(null),[loading,setLoading]=useState(true);useEffect(()=>{api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>setUser(null)).finally(()=>setLoading(false))},[]);if(loading)return <div className="boot-screen"><div className="brand-mark">L</div><p>Preparing your library…</p></div>;return <Routes><Route path="/login" element={user?<Navigate to="/dashboard"/>:<Login setUser={setUser}/>}/><Route path="/register" element={user?<Navigate to="/dashboard"/>:<Register setUser={setUser}/>}/><Route path="/" element={user?<Navigate to="/dashboard"/>:<Navigate to="/login"/>}/><Route element={<Guard user={user}><Shell user={user} setUser={setUser}/></Guard>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/catalog" element={<Catalog/>}/><Route path="/catalog/:id" element={<Catalog/>}/><Route path="/books" element={<Guard user={user} staff><Management type="books"/></Guard>}/><Route path="/members" element={<Guard user={user} staff><Management type="members"/></Guard>}/><Route path="/loans" element={<Management type="loans"/>}/><Route path="/reservations" element={<Management type="reservations"/>}/><Route path="/fines" element={<Management type="fines"/>}/><Route path="/reports" element={<Guard user={user} staff><Reports/></Guard>}/></Route><Route path="*" element={<div className="boot-screen"><h2>Page not found</h2><a href="/dashboard">Return to LibHub</a></div>}/></Routes>}
export default function App(){return <BrowserRouter><Inner/></BrowserRouter>}
