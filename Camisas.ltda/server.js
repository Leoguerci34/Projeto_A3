// Criar o app, express...
const express = require("express");
const app = express();
const fs = require("fs");

// Inicializando do banco de dados SQLite
const dbFile = "./.data/camisa.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// Rota POST para criar um produto....
app.post("/api/camisa", function(request, response) {
    /*
    console.log(request);
    
    const novo_produto = {
      id: produtos.length + 1,
      nome: request.body.nome,
      preco: request.body.preco,
      estoque: request.body.estoque
    };
    
    produtos.push(novo_produto);
    response.status(201).json(novo_produto);
    */
    db.run("INSERT INTO camisa (nome, preco, estoque) VALUES (?, ?, ?) ", request.body.nome, request.body.preco, request.body.estoque, function(error) {
      if (error) {
        return response.status(500).send(error);
      } else {
        return response.status(201).json({ id: this.lastID, nome: request.body.nome, preco: request.body.preco, estoque: request.body.estoque});
      }
    });
    
});

// Vamos tratar quando o visitante acessar o "/" (página principal)
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/index.html");
});

// se não colocar isso aqui, o POST não funciona..
app.use(express.json());

/* INÍCIO DO NOSSO API SERVER */

// Vamos criar um array de camisas (futuramente será um banco de dados SQLite)
let camisa = [
  { id: 1, nome: 'Nintendo Switch', preco: 2212.99, estoque: 10},
  { id: 2, nome: 'Sony Playstation 5', preco: 3533.07, estoque: 5}
];

// Rota GET para retornar todos os produtos
app.get("/api/camisa", function(request, response) {
  response.json(camisas);
});

// Rota GET para retornar um único produto, passando o id do mesmo na URL
app.get("/api/camisa/:id", function(request, response) {
  const camisa_id = parseInt(request.params.id);
  const camisa = camisas.find(i => i.id === camisa_id);
  
  if (!camisa) { // produto == false
    return response.status(404).send("camisa não encontrado");
  } else {
    return response.json(camisa);
  }
});

// Rota POST para criar um produto....
app.post("/api/camisa", function(request, response) {
  console.log(request);
  
  const novo_camisa = {
    id: camisas.length + 1,
    nome: request.body.nome,
    preco: request.body.preco,
    estoque: request.body.estoque
  };
  
  camisas.push(novo_camisa);
  response.status(201).json(novo_camisa);
  
});

/* FIM DO NOSSO API SERVER */

//"Listener"
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// APAGAR camisa CORRIGIDO.
app.delete("/api/camisa/:id", function(request, response) {
    const camisa_id = parseInt(request.params.id);
    const camisaIndex = produtos.findIndex(i => i.id === produto_id);
   
    //console.log(camisa);
    //console.log(produtoIndex);
    if (camisaIndex === -1) {
      return response.status(404).send("Produto não encontrado.");
    } else {
        camisas.splice(camisaIndex, 1);
      return response.status(204).send();
    }
});

// ATUALIZAR PRODUTO...
// Rota GET para retornar todos os produtos
app.get("/api/produtos", function(request, response) {
    //response.json(produtos);
    db.all("SELECT * FROM camisas", (error, linhas) => {
      response.setHeader('content-type', 'text/json');
      return response.send(JSON.stringify(linhas));
    })
});
app.patch("/api/produtos/:id", function(request, response) {
    const camisa_id = parseInt(request.params.id);
    const camisaIndex = camisa.findIndex(i => i.id === camisa_id);
    
    const camisa_atualizado = {
      id: camisa_id,
      nome: request.body.nome,
      preco: request.body.preco,
      estoque: request.body.estoque
    };
    
    if (camisasIndex === -1) {
      return response.status(404).send("camisa não encontrado.");
    } else {
      camisa[camisaIndex] = camisa_atualizado;
      return response.status(200).send();
    }
});