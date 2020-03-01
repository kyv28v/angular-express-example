import {NextFunction, Request, Response} from 'express';

const express = require('express');
const router = express.Router();

// 生存確認用API
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.json({ message: 'API Called.' });
});

module.exports = router;
