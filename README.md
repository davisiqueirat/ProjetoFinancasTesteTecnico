Sistema de Gestão Financeira Fullstack.

## Tecnologias Utilizadas
### BackEnd
- **C# .NET 8** (Web API)
- **Entity Framework Core**
- **SQL Server**
- **Swagger**


### FrontEnd
- **React**
- **TypeScript**

### Infraestrutura
- **Docker** Para containerização do Banco de Dados SQL SERVER

 ### Arquitetura
 - Arquitetura em Camadas

##  Como rodar
1. Acesse a pasta do projeto Backend:
 ```bash
cd ApiFinançasProject
```
2. Suba o container do banco (pode demorar um pouco na primeira vez):
```bash
docker-compose up -d
```
3. Depois é so rodar normalmente o BackEnd.

## Frontend:
Na pasta Frontend, para instalar as dependencias do projeto (node modules) 
```bash
npm i
```

para executar quando estiver tudo instalado.
```bash
npm run dev
```


Funcionalidades Entregues

[x] CRUD de Pessoas (com validação de idade).

[x] CRUD de Transações (Receitas e Despesas).

[x] Regra de Negócio: Menores de idade só podem lançar Despesas.

[x] Regra de Negócio: Deleção em cascata (apagar pessoa apaga suas transações).

[x] Relatório de totais e saldo líquido.

[x] Swagger totalmente documentado e com comentarios XML para facilitar as requisições.

[x] FrontEnd e BackEnd Totalmente documentados tb. Deixei varios comentarios explicando algumas decisões, principalmente no Frontend.
 
