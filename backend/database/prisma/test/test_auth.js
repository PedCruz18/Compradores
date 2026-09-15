import prisma from "../client.js";
import "../../../app.js";

async function runTests() {
  console.log("Iniciando testes de autenticação e rotas backend...");

  // Esperar 500ms para o servidor iniciar completamente
  await new Promise((r) => setTimeout(r, 500));

  const PORT = process.env.PORT || 3000;
  const baseUrl = `http://localhost:${PORT}/api`;

  try {
    // 0. Teste rota base
    const homeRes = await fetch(`http://localhost:${PORT}/`);
    const homeData = await homeRes.json();
    console.log("Status Rota Raiz:", homeRes.status, homeData.message);

    // Limpar usuário de teste anterior se existir
    await prisma.user.deleteMany({
      where: { email: "teste.auth@empresa.com" }
    });

    console.log("\n1. Teste de Cadastro (POST /auth/register)");
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Comprador Teste",
        email: "teste.auth@empresa.com",
        company: "Empresa Teste SA",
        phone: "+55 (11) 99999-8888",
        password: "senhaSegura123"
      })
    });
    const regData = await regRes.json();
    console.log("Status Cadastro:", regRes.status);
    console.log("Resposta Cadastro:", regData);

    if (regRes.status !== 201 || !regData.user || regData.user.password) {
      throw new Error("Falha no teste de cadastro ou senha exposta!");
    }
    const userId = regData.user.id;

    console.log("\n2. Teste de Login com Sucesso (POST /auth/login)");
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "teste.auth@empresa.com",
        password: "senhaSegura123"
      })
    });
    const loginData = await loginRes.json();
    console.log("Status Login:", loginRes.status);
    console.log("Resposta Login:", loginData);

    if (loginRes.status !== 200 || !loginData.token) {
      throw new Error("Falha no teste de login com credenciais válidas!");
    }

    console.log("\n2.1 Teste de Cadastro com E-mail Duplicado (esperado 409)");
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Comprador Duplicado",
        email: "teste.auth@empresa.com",
        password: "senhaSegura123"
      })
    });
    console.log("Status Cadastro Duplicado:", dupRes.status);
    if (dupRes.status !== 409) {
      throw new Error("Deveria ter retornado 409 para e-mail duplicado!");
    }

    console.log("\n3. Teste de Login com Senha Incorreta");
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "teste.auth@empresa.com",
        password: "senhaErrada"
      })
    });
    console.log("Status Login Falha (esperado 401):", badLoginRes.status);
    if (badLoginRes.status !== 401) {
      throw new Error("Deveria ter retornado 401 para senha inválida!");
    }

    console.log("\n4. Teste de Obtenção de Perfil (GET /auth/me)");
    const meRes = await fetch(`${baseUrl}/auth/me?id=${userId}`);
    const meData = await meRes.json();
    console.log("Status Perfil:", meRes.status);
    console.log("Dados do Perfil:", meData);
    if (meRes.status !== 200 || meData.name !== "Comprador Teste") {
      throw new Error("Falha no teste de obtenção de perfil!");
    }

    console.log("\n5. Teste de Atualização de Perfil (PUT /auth/me)");
    const updateRes = await fetch(`${baseUrl}/auth/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        role: "Gerente de Suprimentos",
        company: "Empresa Teste Atualizada"
      })
    });
    const updateData = await updateRes.json();
    console.log("Status Atualização:", updateRes.status);
    console.log("Dados Atualizados:", updateData);
    if (updateRes.status !== 200 || updateData.user.role !== "Gerente de Suprimentos") {
      throw new Error("Falha no teste de atualização de perfil!");
    }

    console.log("\n TODOS OS TESTES DE BACKEND PASSARAM COM SUCESSO!");
  } catch (err) {
    console.error("\n Erro durante testes:", err);
    process.exit(1);
  } finally {
    // Limpar usuário de teste
    await prisma.user.deleteMany({
      where: { email: "teste.auth@empresa.com" }
    });
    await prisma.$disconnect();
    process.exit(0);
  }
}

runTests();
