import prisma from "../client.js";
import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  const passHash = hashPassword("123456");

  // Usuário 1: Pedro Cruz
  const pedro = await prisma.user.upsert({
    where: { email: "pedro.cruz@suplyfast.com" },
    update: {
      password: passHash,
      name: "Pedro Cruz",
      company: "SuplyFast Soluções",
      phone: "+55 (11) 98765-4321",
      role: "Comprador Master & Suprimentos",
    },
    create: {
      name: "Pedro Cruz",
      email: "pedro.cruz@suplyfast.com",
      password: passHash,
      company: "SuplyFast Soluções",
      phone: "+55 (11) 98765-4321",
      role: "Comprador Master & Suprimentos",
    },
  });

  // Usuário 2: Carlos Silva
  await prisma.user.updateMany({
    where: { email: "carlos@email.com" },
    data: { password: passHash },
  });

  console.log("Usuários cadastrados e prontos para teste:");
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, company: true, role: true },
  });
  console.log(users);

  await prisma.$disconnect();
}

seed();
