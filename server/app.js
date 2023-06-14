import express from "express";
import cors from "cors";
import mysql from "mysql";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// conecção no banco de dados
const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "gerenciamento_tarefa",
});

// rota de leitura com o banco
app.get("/tasks", (req, res) => {
  const sql = " SELECT * FROM tarefa";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "O recurso solicitado não existe" });
    return res.json(result);
  });
});

// cadastrar task

app.post("/tasks", (req, res) => {
  const sql =
    "INSERT INTO tarefa(`titulo`, `descricao`, `arquivo`, `status`, `data`, `data_atualizada`, `data_excluida`, `usuario`) VALUES (?)";
  console.log(req.body);

  const values = [
    req.body.titulo,
    req.body.descricao,
    req.body.arquivo,
    req.body.status,
    req.body.data,
    req.body.data_atualizada,
    req.body.data_excluida,
    req.body.usuario,
  ];
  db.query(sql, [values], (err, result) => {
    if (err)
      return res.json({
        Message: "Erros de validação nos dados enviados pelo cliente",
      });
    return res.status(200).send({ msg: "Tarefa cadastrada com sucesso" });
  });
});

// ler um  task
app.get("/tasks/:id", (req, res) => {
  const sql = "SELECT * FROM tarefa WHERE id=?";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({
        Message: "Erros de validação nos dados enviados pelo cliente",
      });
    return res.json(result);
  });
});

// atualizar dados de uma tarefa espesifica
app.put("/tasks/:id", (req, res) => {
  const sql =
    "UPDATE tarefa SET `titulo`=?,`descricao`=?,`arquivo`=?,`status`=?,`data`=?,`data_atualizada`=?,`data_excluida`=?,`usuario`=? WHERE id=?";
  const id = req.params.id;
  const {
    titulo,
    descricao,
    arquivo,
    status,
    data,
    data_atualizada,
    data_excluida,
    usuario,
  } = req.body;

  db.query(
    sql,
    [
      titulo,
      descricao,
      arquivo,
      status,
      data,
      data_atualizada,
      data_excluida,
      usuario,
      id,
    ],
    (err, result) => {
      if (err) return res.json({ Message: "Error ao iniciar servidor" });
      return res.json({ Message: "Atulizado com sucesso " });
    }
  );
});

// delete
app.delete("/tasks/:id", (req, res) => {
  const sql = "DELETE FROM `tarefa` WHERE id=?";

  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Message: "Error ao iniciar servidor" });
    return res.json({ Message: "Deletado  com sucesso " });
  });
});
// // listando os pets
app.listen(PORT, () => {
  console.log("Estamos rodando em: http://localhost:" + PORT + "/tasks");
});
