
import { useState } from 'react';
export default function BookCover({ src='/images/cover-1.svg', title='Book cover', className='' }) {
  const [broken,setBroken]=useState(false);
  return <img className={`book-cover ${className}`} src={broken?'/images/cover-1.svg':src} alt={`${title} cover`} loading="lazy" onError={()=>setBroken(true)} />;
}
