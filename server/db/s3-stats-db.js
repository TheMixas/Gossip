import {pool} from './database.js';
export const receiveS3GetCount = async () => {
    const result = await pool.query(`
        SELECT get_count FROM s3statistics WHERE bucket_name = ?
    `, [process.env.AWS_BUCKET_NAME])
    return result[0][0]['get_count'];
}

export const receiveS3PutCount = async () => {
    const result = await pool.query(`
        SELECT put_count FROM s3statistics WHERE bucket_name = ?
    `, [process.env.AWS_BUCKET_NAME])
    return result[0][0]['put_count'];
}


export const incrementS3GetCount = async () => {
    await pool.query(`
        UPDATE s3statistics SET get_count = get_count + 1 WHERE bucket_name = ?
    `, [process.env.AWS_BUCKET_NAME])
}
export const incrementS3PutCount = async () => {
    await pool.query(`
        UPDATE s3statistics SET put_count = put_count + 1 WHERE bucket_name = ?
    `, [process.env.AWS_BUCKET_NAME])
}
