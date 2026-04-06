import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, ShoppingCart, Shield, Calendar, Users } from 'lucide-react';

interface Combo {
  id: number;
  name: string;
  price: number;
  description: string;
  purchases: number;
}

const Dashboard: React.FC = () => {
  const navigate
