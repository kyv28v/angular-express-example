import { NextFunction, Request, Response } from 'express';
import { getPostgres, Postgres } from '../../utility/postgres';
import { tokenConf } from '../../config/common';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/createtoken', async function(req: Request, res: Response, next: NextFunction) {
    const db: Postgres = await getPostgres();
    try {
        console.log('auth.createtoken() start');
        console.log('userid:' + req.body.userid);
        console.log('password:' + req.body.password);

        if (!req.body.userid) {
            throw new Error('Invalid id');
        }

        // DB接続
        await db.connect();

        // SQL実行
        const data = await db.query('SELECT * FROM users WHERE id = $1', [ req.body.userid ]);

        // ユーザが見つからない場合はエラー
        if (data.rows.length === 0) {
            throw new Error('Invalid id or password');
        }

        // パスワード不一致の場合はエラー
        if (data.rows[0].password !== req.body.password) {
            throw new Error('Invalid id or password');
        }

        // アクセストークンの取得
        const accessToken = jwt.sign(
            { userid: req.body.userid },
            tokenConf.accessTokenSecretKey,
            {
                algorithm: tokenConf.algorithm,
                expiresIn: tokenConf.accessTokenExpiresIn,
            });

        // リフレッシュトークンの取得
        const refreshToken = jwt.sign(
            { userid: req.body.userid },
            tokenConf.refreshTokenSecretKey,
            {
                algorithm: tokenConf.algorithm,
                expiresIn: tokenConf.refreshTokenExpiresIn,
            });

        console.log('auth.createtoken() end');
        console.log('accessToken:' + accessToken);
        console.log('refreshToken:' + refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken, message: null });
    } catch (e) {
        console.error(e.stack);
        res.json({ message: e.message });
    } finally {
        await db.release();
    }
});

router.post('/refreshtoken', async function(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('auth.refreshtoken() start');

        const refreshToken = req.headers['refresh-token'];
        console.log('refreshToken:' + refreshToken);

        // tokenがない場合、アクセスを拒否
        if (!refreshToken) {
            res.status(401);
            return res.json({rows: null, message: 'No token provided'});
        }
        // tokenが改ざんされていないかチェック
        try {
            const decoded = await jwt.verify(refreshToken, tokenConf.refreshTokenSecretKey);
        } catch (e) {
            res.status(401);
            return res.json({rows: null, message: e.message});
        }

        // アクセストークンの取得
        const accessToken = jwt.sign(
            { userid: req.body.userid },
            tokenConf.accessTokenSecretKey,
            {
                algorithm: tokenConf.algorithm,
                expiresIn: tokenConf.accessTokenExpiresIn,
            });

        console.log('auth.refreshtoken() end');
        console.log('accessToken:' + accessToken);
        res.json({ accessToken: accessToken, message: null });
    } catch (e) {
        console.error(e.stack);
        res.json({ message: e.message });
    }
});

module.exports = router;
