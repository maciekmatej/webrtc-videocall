import expressAsyncHandler from 'express-async-handler';
import * as db from '../config/db';

export const getEnvironmentConfig = async () => {
  const query = {
    text: 'SELECT * FROM devs_maciek.global_environments WHERE environment = $1',
    values: [process.env.NODE_ENV],
  };
  const { rows } = await db.query(query.text, query.values);
  console.log('helo gb ?', rows);
  const globalEnvironment = rows[0];
  // return isVerified;
  // res.send(isVerified);
  return globalEnvironment;
};
