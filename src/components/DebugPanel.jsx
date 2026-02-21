import React, { useState, useEffect } from 'react';
import './DebugPanel.css';

function DebugPanel() {
  const [fps, setFps] = useState(60);
  const [renderedRows, setRenderedRows] = useState(0);
  const [scrollPosition, setScrollPosition] = useState('0 / 0');

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.debugInfo) {
        setRenderedRows(window.debugInfo.renderedRows || 0);
        const scrollPos = window.debugInfo.scrollPosition || 0;
        const total = window.debugInfo.totalRows || 0;
        setScrollPosition(`${scrollPos.toLocaleString()} / ${total.toLocaleString()}`);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="debug-panel" data-test-id="debug-panel">
      <div className="debug-title">Performance Monitor</div>
      <div className="debug-metric">
        <span className="debug-label">FPS:</span>
        <span className="debug-value" data-test-id="debug-fps">{fps}</span>
      </div>
      <div className="debug-metric">
        <span className="debug-label">Rendered Rows:</span>
        <span className="debug-value" data-test-id="debug-rendered-rows">{renderedRows}</span>
      </div>
      <div className="debug-metric">
        <span className="debug-label">Scroll Position:</span>
        <span className="debug-value" data-test-id="debug-scroll-position">{scrollPosition}</span>
      </div>
    </div>
  );
}

export default DebugPanel;
