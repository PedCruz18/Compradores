import { Router } from "express";
import crypto from "crypto";
import prisma from "../database/prisma/client.js";

const router = Router();

// Função auxiliar para hash de senha com salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Função auxiliar para verificar senha
function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  if (storedHash.includes(":")) {
    const [salt, key] = storedHash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derived = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derived);
  }
  return password === storedHash;
}

// Sanitizar objeto de usuário para não expor a senha
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

// ----------------------------------------------------
// ROTAS DE AUTENTICAÇÃO E PERFIL
// ----------------------------------------------------

// Registrar novo usuário
router.post("/auth/register", async (req, res) => {
  const { name, email, company, password, phone, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail.includes("@")) {
    return res.status(400).json({ error: "E-mail corporativo inválido" });
  }

  if (String(password).length < 4) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 4 caracteres" });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(409).json({ error: "Já existe uma conta com este e-mail corporativo" });
    }

    const hashedPassword = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        company: (company || "").trim(),
        phone: (phone || "").trim(),
        role: (role || "Comprador Master").trim(),
      },
    });

    const token = crypto.randomUUID();
    return res.status(201).json({
      message: "Conta criada com sucesso!",
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um usuário com este e-mail" });
    }
    return res.status(500).json({ error: "Erro interno ao cadastrar usuário" });
  }
});

// Login do usuário
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    const token = crypto.randomUUID();
    return res.json({
      message: "Login realizado com sucesso!",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno ao autenticar usuário" });
  }
});

// Obter perfil do usuário
router.get("/auth/me", async (req, res) => {
  const userId = req.query.id || req.headers["x-user-id"];

  if (!userId) {
    return res.status(400).json({ error: "Identificador do usuário não fornecido" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ error: "Erro ao buscar perfil do usuário" });
  }
});

// Atualizar perfil
router.put("/auth/me", async (req, res) => {
  const userId = req.body.id || req.query.id || req.headers["x-user-id"];
  const { name, company, phone, role } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Identificador do usuário não fornecido" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(company !== undefined && { company: company.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(role !== undefined && { role: role.trim() }),
      },
    });

    return res.json({
      message: "Perfil atualizado com sucesso",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

// ----------------------------------------------------
// ROTAS CRUD DE USUÁRIOS
// ----------------------------------------------------

// Listar todos os usuários
router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users.map(sanitizeUser));
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

    res.json(sanitizeUser(user));
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno ao buscar usuário" });
  }
});

// Criar um novo usuário (CRUD direto)
router.post("/users", async (req, res) => {
  const { name, email, company, password, phone, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.trim().toLowerCase(),
        password: password ? hashPassword(password) : "",
        company: company || "",
        phone: phone || "",
        role: role || "Comprador",
      },
    });

    res.status(201).json(sanitizeUser(newUser));
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um usuário com este e-mail" });
    }
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
});

// Atualizar um usuário
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, company, phone, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email: email.trim().toLowerCase() }),
        ...(company !== undefined && { company }),
        ...(phone !== undefined && { phone }),
        ...(role !== undefined && { role }),
      },
    });

    res.json(sanitizeUser(updatedUser));
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

