import { Router } from 'express';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';
import { kirimExpoPush } from '../services/pushService.js';

const router = Router();

// Endpoint 1: Ambil daftar tugas milik user yang login (Kriteria 2 & 3)
router.get('/', wajibLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tugas WHERE user_id = ? ORDER BY dibuat_pada DESC',
      [req.user.sub]
    );
    res.json({ pesan: 'Berhasil mengambil data tugas', data: rows });
  } catch (e) {
    res.status(500).json({ pesan: 'Server error', error: e.message });
  }
});

// Endpoint 2: Tambah tugas baru & Kirim Notifikasi (Kriteria 2, 4, & 5)
router.post('/', wajibLogin, async (req, res) => {
  const { judul, deskripsi } = req.body;

  // Skenario Error 400: Validasi input kosong
  if (!judul || judul.trim() === '') {
    return res.status(400).json({ pesan: 'Judul tugas wajib diisi' });
  }

  try {
    // Skenario Error 409: Cek duplikasi judul tugas untuk user yang sama
    const [existing] = await pool.query(
      'SELECT id FROM tugas WHERE user_id = ? AND judul = ?',
      [req.user.sub, judul]
    );
    if (existing.length > 0) {
      return res.status(409).json({ pesan: 'Tugas dengan judul tersebut sudah ada' });
    }

    // Simpan ke database
    const [result] = await pool.query(
      'INSERT INTO tugas (user_id, judul, deskripsi) VALUES (?, ?, ?)',
      [req.user.sub, judul, deskripsi || '']
    );

    // Ambil push token perangkat user untuk mengirim notifikasi
    const [tokens] = await pool.query(
      'SELECT expo_push_token FROM push_tokens WHERE user_id = ?',
      [req.user.sub]
    );

    // Kirim notifikasi jika token tersedia (Kriteria 4 & 5)
    if (tokens.length > 0) {
      for (const t of tokens) {
        await kirimExpoPush(t.expo_push_token, {
          title: 'Tugas Baru Dibuat!',
          body: `Tugas "${judul}" berhasil ditambahkan.`,
          data: { screen: 'tugas' }, // Payload untuk navigasi (Kriteria 5)
        });
      }
    }

    res.status(201).json({
      pesan: 'Tugas berhasil dibuat',
      tugasId: result.insertId,
    });
  } catch (e) {
    res.status(500).json({ pesan: 'Server error', error: e.message });
  }
});

export default router;