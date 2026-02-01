import { useState } from 'react';

const ParagraphTest = () => {
  const [message] = useState('Paragraph Test page coming soon');
  return (
    <div className="paragraph-test">
      <h1>{message}</h1>
    </div>
  );
};

export default ParagraphTest;
