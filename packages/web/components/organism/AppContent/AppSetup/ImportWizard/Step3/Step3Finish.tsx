import React, { useState } from 'react';
import styles from './Step3Finish.module.scss';
import { App } from '@modules/firebase';

interface Step3FinishProps {
  app: App;
}

export default function Step3Finish({ app }: Step3FinishProps) {
  return (
    <div>
      <h4>Successfully Imported Contract</h4>
      <div>You can now proceed to view your app.</div>
    </div>
  );
}
