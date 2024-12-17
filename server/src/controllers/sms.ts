import asyncHandler from 'express-async-handler';
import { getEnvironmentConfig } from './globalEnvironments';
import { URL, URLSearchParams } from 'node:url';

export const sendSmsImmediately = asyncHandler(async (req, res, next) => {
  const content = `rozmowa po lineczkiem: localhost:5000/${req.body.room} pin to 1111`;
  console.log(req.body.recipient);
  const recipient = req.query.recipient?.toString() || '48516588149';
  const env = await getEnvironmentConfig();

  const myHeaders = new Headers();
  myHeaders.append('X-Requested-With', 'XMLHttpRequest');
  myHeaders.append(
    'Content-Type',
    'application/x-www-form-urlencoded;charset=UTF-8'
  );
  // myHeaders.append('Authorization', `${env.sms_microservice_public_key}`);
  // myHeaders.append('UrlAccess', `${env.sms_microservice_url_access}`);
  // const url = new URL(`${env.sms_microservice_url}sendSmsImmediately`);
  const params = {
    gateway: '97a55371-6284-40df-b438-f5aa47850a66',
    content,
    recipient,
  };

  const options = {
    headers: myHeaders,
    method: 'POST',
    body: new URLSearchParams(params),
  };

  // const response = await fetch(url, options);
  // const result = await response.json();

  // res.send(result);
});
