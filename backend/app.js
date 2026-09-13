import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import prisma from "./database/prisma/client.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());



// Rota base de boas-vindas
app.get("/", async (_req, res) => {
  res.json({
    message: "Backend Compradores API em funcionamento",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});



// Rotas da aplicação
app.use("/api", router);



// Inicialização do servidor
const server = app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});

// Encerramento gracioso
const handleShutdown = async () => {
  console.log("\nEncerrando servidor...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Servidor finalizado com sucesso.");
    process.exit(0);
  });
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

export default app;
