# 🚛 Sistema de Gestão de Frota

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-red?style=for-the-badge&logo=java" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-green?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/H2-Database-orange?style=for-the-badge" />
</p>

---

# 📋 Sobre o Projeto

Sistema desenvolvido para o desafio técnico de **Gestão de Frota**, utilizando:

* ✅ Java 17
* ✅ Spring Boot
* ✅ React
* ✅ H2 Database
* ✅ Axios
* ✅ API REST

O sistema realiza o gerenciamento completo de:

* 🚚 Caminhões
* 👨‍✈️ Motoristas
* 🛣️ Rotas
* 📦 Fretes

Além disso, possui regras de negócio para controle operacional da frota e cálculo automático do valor do frete.

---

# ✨ Funcionalidades

## 🚚 Caminhões

* Cadastro de caminhões
* Edição de caminhões
* Exclusão de caminhões
* Controle de status

## 👨‍✈️ Motoristas

* Cadastro de motoristas
* Edição de motoristas
* Exclusão de motoristas
* Controle de disponibilidade

## 🛣️ Rotas

* Cadastro de rotas
* Consulta de rotas

## 📦 Fretes

* Criação de fretes
* Finalização de fretes
* Atualização automática de status
* Validação de capacidade do caminhão
* Validação de disponibilidade

---

# 🧠 Regras de Negócio

✔️ Caminhão deve estar disponível
✔️ Motorista deve estar disponível
✔️ Peso da carga não pode ultrapassar a capacidade do caminhão
✔️ CPF deve ser único
✔️ Placa deve ser única
✔️ Status são atualizados automaticamente

---

# 💰 Fórmula do Frete

O valor do frete é calculado automaticamente utilizando a fórmula:

```text
valorFrete =
(distanciaKm * 6.50)
+ pedagio
+ (pesoCargaKg * 0.08)
```

---

# 🖥️ Frontend

O frontend foi desenvolvido utilizando React e possui:

* Interface moderna
* Dashboard operacional
* Controle visual de status
* Cadastro completo
* Integração com API REST

---

# ⚙️ Como Executar o Projeto

# 🔹 Backend (Spring Boot)

## Entrar na pasta do backend

```bash
cd frota-api
```

## Executar aplicação

```bash
mvn spring-boot:run
```

Servidor backend:

```text
http://localhost:8081
```

---

# 🔹 Frontend (React)

## Entrar na pasta do frontend

```bash
cd frontend
```

## Instalar dependências

```bash
npm install
```

## Executar aplicação

```bash
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

# 📡 Endpoints Principais

## 🚚 Caminhões

```http
POST /caminhoes
GET /caminhoes
PUT /caminhoes/{id}
DELETE /caminhoes/{id}
```

---

## 👨‍✈️ Motoristas

```http
POST /motoristas
GET /motoristas
PUT /motoristas/{id}
DELETE /motoristas/{id}
```

---

## 🛣️ Rotas

```http
POST /rotas
GET /rotas
```

---

## 📦 Fretes

```http
POST /fretes
GET /fretes
PATCH /fretes/{id}/finalizar
```

---

# 🛠️ Tecnologias Utilizadas

| Tecnologia  | Descrição                   |
| ----------- | --------------------------- |
| Java 17     | Linguagem backend           |
| Spring Boot | Framework Java              |
| React       | Frontend                    |
| Axios       | Requisições HTTP            |
| H2 Database | Banco em memória            |
| Maven       | Gerenciador de dependências |

---

## Dashboard

* Gestão completa da frota
* Controle operacional
* Criação e finalização de fretes

---
