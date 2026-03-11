import {CustomDecorator, SetMetadata} from '@nestjs/common';
export const Response_MESSAGE = 'response:message';
export const Response_OPTS = 'response:opts';

export type ResponseOpts = {
    Code?: number;
    message?: string;
    liftToken? : boolean;
};

export const ResponseMessage : (message: string) => CustomDecorator<string> = (message: string): CustomDecorator<string> => {
  return SetMetadata(Response_MESSAGE, message);
};
export const ResponseOPTS : (opts: ResponseOpts) => CustomDecorator<string>  = (opts: ResponseOpts): CustomDecorator<string> => {
  return SetMetadata(Response_OPTS, opts);
};