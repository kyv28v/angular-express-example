# Angular + Express Example

Angular、Expressを使用したサンプル画面です。  
DBはPostgreSQLを使用しています。  
最低限の構成で、簡単なCRUD機能を実現しています。  

## 動作確認環境

・node.js       12.16.1  
・npm           6.13.4  
・PostgreSql    12.1

## インストール方法
 npm install で必要なモジュールをインストールします。  
 DBは、PostgreSqlを適当にインストールし、テスト用のテーブル、初期ユーザを作成してください。

・DB設定（server/src/config/common.ts）
```
user = 'postgres';
password = 'postgres';
host = 'localhost';
port = 5432;
database = 'postgres';
```

・テスト用のテーブル、初期ユーザ作成
```
# CREATE TABLE users (id serial, name varchar(50), age int, sex int, birthday timestamptz, password varchar(128), note varchar(256));
# CREATE TABLE room_access_mng (id serial, room_cd varchar(10), user_id int, entry_dt timestamptz, exit_dt timestamptz, note varchar(256));
# INSERT INTO users (name, password, note) VALUES ('admin', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 'password:123456');
```

## ビルド＆起動方法

・ビルド
```
$ npm run build
```

・起動

```
$ npm start
```

・起動（開発用、ソースの変更監視）
```
$ npm run watch
```

※ VSCodeでデバッグする場合、「Attach Node」でnodeのプロセス（`・・・/ts-node ./src/bin/www.ts`）にアタッチしてください。

## herokuでの実行

以下の設定が必要です。

・devDependenciesのmoduleもインストールする。
```
heroku config:set NPM_CONFIG_PRODUCTION=false --app XXXXXXXXXXXX
```

・DBの設定を変更する
```
heroku config:set DB_USER=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_PASSWORD=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_HOST=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_PORT=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_NAME=XXXXXXXXXX --app XXXXXXXXXXXX
```

・タイムゾーンの設定
```
# alter database XXXXXXXXXX set timezone = 'Asia/Tokyo';
```



