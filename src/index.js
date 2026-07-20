import app from './app.js';
import { config } from './config.js';
import { connmysql } from './db.js';

async function main() {
  try {
    const connection = await connmysql.getConnection();
    console.log('Conexión a MySQL correcta');
    connection.release();

    app.listen(config.port, () => {
      console.log(`Servidor ejecutándose en puerto ${config.port}`);
    });
  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
  }
}

main();