import React from 'react';
import { App } from '@modules/firebase';

interface Step3ReadyProps {
  app: App;
}

export default function Step3Ready({ app }: Step3ReadyProps) {
  return (
    <div>
      <h4>Your Contact Is Ready</h4>
      <div>You can now proceed to deploy the contract.</div>
    </div>
  );
}
