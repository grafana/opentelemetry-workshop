import React from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import opentelemetryIcon from '../../../static/img/opentelemetry-icon.svg';

function OpenTelemetryTipAdmonition(props) {
  return (
    <div className={'admonition-otel'}>
      <div className={'icon-container'}>
        <img src="/img/opentelemetry-icon.svg" alt="Example banner" />
      </div>
      <div>
        <div className={'heading'}>{props.title}</div>
        <div className={'content'}>{props.children}</div>
      </div>
    </div>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,

  // Add all your custom admonition types here...
  // You can also override the default ones if you want
  'opentelemetry-tip': OpenTelemetryTipAdmonition,
};

export default AdmonitionTypes;
