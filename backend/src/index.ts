import express from "express";
import cors from "cors";
import { authRouter } from "./routes/authRouter";
import { userRouter } from "./routes/userRouter";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
