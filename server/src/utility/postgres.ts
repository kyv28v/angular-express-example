import { pgConf } from '../config/common';

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || pgConf.user,
    password: process.env.DB_PASSWORD || pgConf.password,
    host: process.env.DB_HOST || pgConf.host,
    port: process.env.DB_PORT || pgConf.port,
    database: process.env.DB_NAME || pgConf.database,
});

export class Postgres {
    private client: any;

    async connect() {
        this.client = await pool.connect();
    }

    async release() {
        if (this.client) { await this.client.release(true); }
    }

    async query(text: string, values: any) {
        console.log('Postgres.query(' + text + ',' + values + ')');
        const ret = await this.client.query(text, values);
        return ret;
    }

    async begin() {
        await this.client.query('BEGIN');
    }

    async commit() {
        await this.client.query('COMMIT');
    }

    async rollback() {
        await this.client.query('ROLLBACK');
    }
}

const getPostgres = async () => {
    const postgres = new Postgres();
    return postgres;
};

export { getPostgres };
