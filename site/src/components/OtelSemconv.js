import React from 'react';

/**
 * Component for styling OpenTelemetry semantic convention elements.
 * Links to OpenTelemetry documentation search for the attribute/metric.
 *
 * @param {string} type - The type of semantic convention: 'resource', 'span', or 'metric'
 * @param {ReactNode} children - The attribute or metric name to display
 */
export default function OtelSemconv({children, type = 'resource'}) {
  const className = `otel-semantic otel-semantic--${type}`;
  const searchUrl = `https://opentelemetry.io/search/?q=${encodeURIComponent(children)}`;

  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{textDecoration: 'none'}}
    >
      {children}
    </a>
  );
}
