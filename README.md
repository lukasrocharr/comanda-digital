# Comanda Digital

Sistema de gestão de restaurante com frontend Angular e backend Spring Boot.

## Visão geral

- Frontend: Angular 17
- Backend: Spring Boot 3.2.0
- Banco local: H2 em memória no perfil `dev`
- Produção: PostgreSQL no Railway

---

## Instituicao

[](https://github.com/ialemoreira-hub/comanda-digital#instituicao)

- **Instituicao:** Centro Universitario Adventista de Sao Paulo (UNASP SP)
- **Disciplina:** Desenvolvimento Full-Stack (G01371.1)
- **Professor:** Thiago Silva
- **Semestre:** 4
- **Dupla:** Lukas Rocha e Maria Eduarda Rodrigues

## Funcionalidades

[](https://github.com/ialemoreira-hub/comanda-digital#funcionalidades)

**Area do Cliente**

- Cardapio publico com filtro por categoria e imagens
- Carrinho de compras com quantidade e observacoes
- Cadastro e login com JWT
- Checkout com calculo de frete por CEP (ViaCEP)
- Acompanhamento de status do pedido
- Historico de pedidos com avaliacao

**Painel Administrativo**

- Dashboard com KPIs e graficos (Chart.js)
- Gestao completa de pedidos com fluxo de status
- CRUD de pratos, categorias e ingredientes
- Fichas tecnicas com calculo de custo e food cost
- Controle de estoque com baixa automatica
- Gestao de fornecedores e pedidos de compra
- Alertas de estoque minimo

## Estrutura do projeto

- `/src` - código Angular
- `/backend` - backend Spring Boot
- `/backend/src/main/resources` - configurações e arquivos Flyway

## Endpoints principais

- `/api/categorias`
- `/api/pratos`
- `/api/pedidos`
- `/api/auth/login`
- `/api/auth/register`

---

## Como rodar localmente

### 1) Iniciar o backend

Abra um terminal e rode:

```powershell
cd "C:\Users\lukas\Desktop\comanda-digital-main\backend"
mvn "spring-boot:run" "-Dspring-boot.run.profiles=dev"
```

Isso inicia o backend em `http://localhost:8080` e usa H2 em memória.

Se a porta `8080` já estiver ocupada, use:

```powershell
cd "C:\Users\lukas\Desktop\comanda-digital-main\backend"
mvn "spring-boot:run" "-Dspring-boot.run.profiles=dev" "-Dserver.port=8081"
```

### 2) Iniciar o frontend

Abra outro terminal e rode:

```powershell
cd "C:\Users\lukas\Desktop\comanda-digital-main"
npm install
npm start
```

O frontend será servido em `http://localhost:4200`.

---

## Como o frontend chama a API

O serviço Angular utiliza `src/app/services/api.service.ts` e define:

- `http://localhost:8080/api` para desenvolvimento local
- `https://comanda-digital-production.up.railway.app/api` para produção

Portanto, rodando o frontend em `localhost:4200` e o backend em `localhost:8080`, as chamadas serão feitas corretamente para a API local.

---

## Como verificar se a API está sendo chamada

1. Abra o app em `http://localhost:4200`
2. Abra o DevTools do navegador
3. Acesse a aba `Network`
4. Faça uma ação no app (por exemplo, abrir o cardápio)
5. Veja requisições XHR para URLs como:
   - `http://localhost:8080/api/categorias?todas=false`
   - `http://localhost:8080/api/pratos?todos=false`

Se elas retornarem `200`, o frontend está conectado ao backend.

---

## Console H2

O backend em `dev` expõe o console H2 em:

- `http://localhost:8080/h2-console`

Use:

- JDBC URL: `jdbc:h2:mem:comanda`
- User: `SA`
- Password: (deixe vazio)

---

## Credenciais de seed obrigatórias

O sistema inclui dados de exemplo e um usuário administrador padrão criado automaticamente pelas migrations Flyway.

- Email: `admin@email.com`
- Senha: `senha123`

Esse usuário é inserido automaticamente durante o processo de seed/migração.

---

## Documentação da API

Após iniciar o backend, a documentação Swagger estará disponível em:

- `http://localhost:8080/swagger-ui/index.html`

Use essa página para testar endpoints e ver o contrato OpenAPI.

---

## Tecnologias

Frontend
- Angular 17
- TypeScript
- Bootstrap
- Chart.js

Backend
- Java 17
- Spring Boot 3.2
- Spring Security
- JWT
- Spring Data JPA
- Flyway

Banco
- H2 (desenvolvimento)
- PostgreSQL (produção)

---

## Perfis

ADMIN
- acesso total

GERENTE
- pedidos
- estoque
- fornecedores
- dashboard

COZINHEIRO
- gerenciamento de pedidos

CLIENTE
- cardápio
- pedidos
- histórico

---

## Fluxo do cliente

Cardápio
↓
Carrinho
↓
Cadastro/Login
↓
Pedido
↓
Acompanhamento do status

---

## Variáveis de ambiente para produção

Para executar em produção com PostgreSQL, defina:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`

---

## Observações

- O backend lê o perfil ativo em `backend/src/main/resources/application.properties`
- O backend usa Flyway para aplicar migrações ao iniciar
- Se quiser rodar o backend em `prod`, configure as variáveis de ambiente do banco e `APP_JWT_SECRET`
