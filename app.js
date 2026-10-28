import express from 'express'; 
import cors from 'cors'; 
import authRoutes from './routes/auth.js'; 
import notificationRoutes from './routes/notifications.js'; 
import tugasRoutes from './routes/tugas.js';


const app = express(); 
 
app.use(cors()); 
app.use(express.json()); 
 
app.get('/', (req, res) => { 
  res.json({ pesan: 'API Auth & Notification berjalan' }); 
}); 
 
app.use('/auth', authRoutes); 
app.use('/notifications', notificationRoutes); 
app.use('/tugas', tugasRoutes);
 
export default app; 