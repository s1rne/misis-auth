import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}
