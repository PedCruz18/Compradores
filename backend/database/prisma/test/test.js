import prisma from "../client.js";

const users = await prisma.user.findMany();

console.log("\nUsuários no banco:");
console.log(users);

await prisma.$disconnect();