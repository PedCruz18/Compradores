import { Router } from "express";
import prisma from "../database/prisma/client.js";

const router = Router();

// Listar todos os usuários
router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuários" });
  }
});

// Buscar usuário por ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuário" });
  }
});

// Criar um novo usuário
router.post("/users", async (req, res) => {
  const { name, email, company } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        company: company || "",
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    // Tratar violação de restrição única (ex: e-mail duplicado)
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um usuário com este e-mail" });
    }
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
});

// Atualizar um usuário
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, company } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(company !== undefined && { company }),
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro interno ao atualizar usuário" });
  }
});

// Deletar um usuário
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro interno ao deletar usuário" });
  }
});

export default router;
