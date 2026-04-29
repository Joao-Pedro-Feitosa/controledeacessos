// supabase.js — inicialização do cliente Supabase
// Substitua os valores abaixo pelos do seu projeto:
// Supabase → Settings → API

const SUPABASE_URL = "https://eqgyvbqckzgquqabqxvk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZ3l2YnFja3pncXVxYWJxeHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0OTQ1NjIsImV4cCI6MjA5MzA3MDU2Mn0.txsrYjLO9CweKXFiVG-hX2amv5yTc8ymcQm8LNH7voA";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
