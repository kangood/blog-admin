import { Message } from '@arco-design/web-react';
import { AxiosError } from 'axios';

import { ResponseResultType } from './types';

export const globalSuccess = () => Message.success('success');

export const globalError = (error: AxiosError<ResponseResultType>) => Message.error(error.message);
