import bcrypt from 'bcryptjs';
import { connmysql } from './db.js';

async function actualizarPasswords() {
  try {
    const [usuarios] = await connmysql.query('SELECT id_usuario, password FROM usuarios');

    for (const usuario of usuarios) {
      if (!usuario.password.startsWith('$2')) {
        const hash = await bcrypt.hash(usuario.password, 10);

        await connmysql.query(
          'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
          [hash, usuario.id_usuario]
        );

        console.log(`Contraseña cifrada para usuario ID ${usuario.id_usuario}`);
      }
    }

    console.log('Proceso finalizado');
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

actualizarPasswords();