import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';  // ou index.css

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [role
