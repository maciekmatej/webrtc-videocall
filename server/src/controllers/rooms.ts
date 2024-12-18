import asyncHandler from 'express-async-handler';
// import * as db from '../config/db';

export const checkIfRoomExists = asyncHandler(async (req, res, next) => {
  console.log(req.query.roomId, 'server checkIfRoomExists');
  // const query = {
  //   text: 'SELECT * FROM devs_maciek.room WHERE card_no = $1 AND pin_no = $2',
  //   values: [req.query.roomId, req.query.pin_no],
  // };
  // const { rows } = await db.query(query.text, query.values);
  // console.log('helo ?', rows);
  // const isVerified = rows[0] ? true : false;
  res.send(true);
  // return isVerified;
});
