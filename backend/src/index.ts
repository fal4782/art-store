import express from "express";
import cors from "cors";
import { authRouter } from "./routes/authRouter";
import { userRouter } from "./routes/userRouter";
import { artworkRouter } from "./routes/artworkRouter";
import { tagRouter } from "./routes/tagRouter";
import { cartRouter } from "./routes/cartRouter";
import { wishlistRouter } from "./routes/wishlistRouter";
import { orderRouter } from "./routes/orderRouter";
import { paymentRouter } from "./routes/paymetRouter";
import { addressRouter } from "./routes/addressRouter";
import { reviewRouter } from "./routes/reviewRouter";
import { categoryRouter } from "./routes/categoryRouter";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/artworks", artworkRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1", reviewRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
