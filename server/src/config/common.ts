export namespace pgConf {
    export const user = 'postgres';
    export const password = 'postgres';
    export const host = 'localhost';
    export const port = 5432;
    export const database = 'postgres';
}

export namespace tokenConf {
    export const algorithm = 'HS256';
    export const accessTokenExpiresIn = '30m';          // 有効期限：30分
    export const refreshTokenExpiresIn = '180 days';    // 有効期限：180日
    export const accessTokenSecretKey = 'Sv3tnH9pe6DT4Vm9G7UzmDmyM2qTWE38';
    export const refreshTokenSecretKey = '9JYZxaQfdCjX8iHDC5MLmmv2TgYQLdRv';
}
