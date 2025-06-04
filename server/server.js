import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import notesRouter from './routes/notes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use('/api/notes', notesRouter);

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
