import prisma from "../client.js";

const user = await prisma.user.create({
  data: {
    name: "Pedro",
    email: "pedro@teste.com",
  },
});

console.log("Usuário criado:");
console.log(user);

const users = await prisma.user.findMany();

console.log("\nUsuários no banco:");
console.log(users);

await prisma.$disconnect();