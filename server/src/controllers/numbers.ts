import asyncHandler from 'express-async-handler';
import * as db from '../config/db';

export const verifyCardNumber = asyncHandler(async (req, res, next) => {
  const query = {
    text: 'SELECT * FROM devs_maciek.numbers WHERE card_no = $1 AND pin_no = $2',
    values: [req.query.card_no, req.query.pin_no],
  };
  const { rows } = await db.query(query.text, query.values);
  console.log('helo ?', rows);
  const isVerified = rows[0] ? true : false;
  res.send(isVerified);
  // return isVerified;
});
