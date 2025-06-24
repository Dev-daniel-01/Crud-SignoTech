import { db } from "../db.js"

export const optionController = {
  create: (req, res) => {
    const { poll_id, text, votes = 0 } = req.body;
    const created_at = new Date();
    const updated_at = new Date();

    const query = `INSERT INTO options (poll_id, text, votes, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [poll_id, text, votes, created_at, updated_at], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ id: result.insertId, poll_id, text, votes, created_at, updated_at });
    });
  },

  read: (req, res) => {
    const pollId = req.params.pollId;

    const query = `SELECT id, poll_id, text, votes, created_at, updated_at FROM options WHERE poll_id = ?`;

    db.query(query, [pollId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json(results);
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const { text, votes } = req.body;
    const updated_at = new Date();

    const query = `UPDATE options SET text = ?, votes = ?, updated_at = ? WHERE id = ?`;

    db.query(query, [text, votes, updated_at, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) return res.status(404).json({ error: "Option não encontrada" });

      res.status(200).json({ id, text, votes, updated_at });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM options WHERE id = ?`;

    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) return res.status(404).json({ error: "Option não encontrada" });

      res.status(200).json({ message: `Option com id ${id} deletada` });
    });
  },
};
