import React from 'react';
import { replace } from 'lodash';
import './index.scss';

export default function HighLevel({
  keyword,
  name,
  highLevelclassName = 'high-level'
}) {
  if (!keyword) {
    return <span>{name}</span>;
  }
  let reg = new RegExp(RegExp.escape(keyword), 'g');
  let html = replace(
    name,
    reg,
    `<span class="${highLevelclassName}">${keyword}</span>`
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
