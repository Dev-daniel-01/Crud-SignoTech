import { db } from "../db.js";

export const pollController = {

    vote: (req, res) => {
        const { pollId, optionId } = req.params;
    
        const checkQuery = 'SELECT * FROM options WHERE id = ? AND poll_id = ?';
        db.query(checkQuery, [optionId, pollId], (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          if (results.length === 0) return res.status(404).json({ error: 'Opção não encontrada para essa enquete' });
    
          const updateQuery = 'UPDATE options SET votes = votes + 1 WHERE id = ?';
          db.query(updateQuery, [optionId], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
    
            res.status(200).json({ message: 'Voto computado com sucesso' });
          });
        });
      },
      
  create: (req, res) => {
    const { title, start_date, end_date } = req.body;
    const created_at = new Date();
    const updated_at = new Date();

    const query = `INSERT INTO polls (title, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [title, start_date, end_date, created_at, updated_at], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ id: result.insertId, title, start_date, end_date, created_at, updated_at });
    });
  },

  read: (req, res) => {
    const query = `SELECT id, title, start_date, end_date, created_at, updated_at FROM polls`;

    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json(results);
    });
  },

 update: (req, res) => {
  const id = req.params.id;
  const { title, start_date, end_date, options } = req.body;
  const updated_at = new Date();

  const queryPoll = `UPDATE polls SET title = ?, start_date = ?, end_date = ?, updated_at = ? WHERE id = ?`;

  db.query(queryPoll, [title, start_date, end_date, updated_at, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) return res.status(404).json({ error: "Poll não encontrada" });

    // Atualizar as options em sequência
    if (Array.isArray(options) && options.length > 0) {
      // Promise para atualizar todas as options
      const promises = options.map(opt => {
        return new Promise((resolve, reject) => {
          const { id: optionId, text } = opt;
          const queryOption = `UPDATE options SET text = ?, updated_at = ? WHERE id = ? AND poll_id = ?`;
          db.query(queryOption, [text, updated_at, optionId, id], (errOpt, resultOpt) => {
            if (errOpt) return reject(errOpt);
            resolve(resultOpt);
          });
        });
      });

      Promise.all(promises)
        .then(() => {
          res.status(200).json({ message: "Poll e opções atualizadas com sucesso" });
        })
        .catch(errOpt => {
          res.status(500).json({ error: "Erro ao atualizar opções: " + errOpt.message });
        });
    } else {
      res.status(200).json({ message: "Poll atualizada com sucesso (sem opções)" });
    }
  });
},

  delete: (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM polls WHERE id = ?`;

    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) return res.status(404).json({ error: "Poll não encontrada" });

      res.status(200).json({ message: `Poll com id ${id} deletada` });
    });
  },

  readOne: (req, res) => {
    const id = req.params.id;
  
    const queryPoll = `SELECT id, title, start_date, end_date, created_at, updated_at FROM polls WHERE id = ?`;
    const queryOptions = `SELECT id, poll_id, text, votes FROM options WHERE poll_id = ?`;
  
    db.query(queryPoll, [id], (err, polls) => {
      if (err) return res.status(500).json({ error: err.message });
      if (polls.length === 0) return res.status(404).json({ error: "Enquete não encontrada" });
  
      const poll = polls[0];
  
      db.query(queryOptions, [id], (err2, options) => {
        if (err2) return res.status(500).json({ error: err2.message });
  
        poll.options = options; // adiciona opções à enquete
        res.status(200).json(poll);
      });
    });
  },
  
  
};
