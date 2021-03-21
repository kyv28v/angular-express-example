import { NextFunction, Request, Response } from 'express';
import { getPostgres, Postgres } from '../../utility/postgres';

const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('db.get() start');
        console.log('sql:' + req.query.sql);
        console.log('values:' + req.query.values);

        const sql = fs.readFileSync('./src/config/sql/' + req.query.sql, 'utf-8');
        console.log(sql);

        // SQL実行
        const values = JSON.parse(req.query.values + '');
        const data = await query(sql, values, false);

        console.log('db.get() end');
        console.log('data:' + JSON.stringify(data.rows));
        res.json({rows: data.rows, message: null});
    } catch (e) {
        console.error(e.stack);
        res.json({rows: null, message: e.message});
    }
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('db.post() start');
        console.log('sql:' + req.body.sql);
        console.log('values:' + req.body.values);

        const sql = fs.readFileSync('./src/config/sql/' + req.body.sql, 'utf-8');
        console.log(sql);

        // SQL実行
        const data = await query(sql, req.body.values, true);

        console.log('db.post() end');
        console.log('data:' + JSON.stringify(data.rows));
        res.json({rows: data.rows, message: null});
    } catch (e) {
        console.error(e.stack);
        res.json({rows: null, message: e.message});
    }
});

async function query(sql: string, values: any[], trans: boolean) {
    const db: Postgres = await getPostgres();
    try {
        console.log('db.query() start');
        console.log('sql:' + sql);
        console.log('values:' + JSON.stringify(values));

        // DB接続
        await db.connect();

        // SQL実行
        if (trans) { await db.begin(); }
        const data = await db.query(sql, values);
        if (trans) { await db.commit(); }

        console.log('db.query() end');
        console.log('data:' + JSON.stringify(data.rows));
        return data;
    } catch (e) {
        if (trans) { await db.rollback(); }
        throw e;
    } finally {
        await db.release();
    }
}

module.exports = router;
