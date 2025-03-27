import pgPromise from 'pg-promise'






const pgp = pgPromise();
export const db = pgp("postgresql://prova_owner:npg_5sYambondV3p@ep-soft-glade-a2hz4q2a-pooler.eu-central-1.aws.neon.tech/prova?sslmode=require");
const initDb = async () => {
  try {
    await db.none(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            nome TEXT,
            cognome TEXT,
            email TEXT UNIQUE,
            password TEXT
            )
            `);
    // await db.none(`INSERT INTO users (nome, cognome, email, password) VALUES(
    //             'Veronica',
    //             'Tarantino',
    //             'veronica@gmail.com',
    //             'Pass123!'

    //             )`);
    

    console.log("tabelle create correttamente");
  } catch (error) {
    console.error("errore", error.message);
  }
};
initDb();
