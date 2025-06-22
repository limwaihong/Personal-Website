function copyEmail() {
  var emailAddress = "waihonglim@icloud.com";
  navigator.clipboard.writeText(emailAddress).then(
    function () {
      showToast();
    },
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
}

function showToast() {
  var toast = document.getElementById("toast");
  toast.className = "toast show";
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function updateClock() {
  var now = new Date();
  var options = {
    timeZone: "Asia/Kuala_Lumpur",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  var timeString = now.toLocaleTimeString("en-US", options);
  document.getElementById("clock").textContent = timeString + " GMT+8";
}

updateClock();
setInterval(updateClock, 1000);

// Random H1 title text rotation
function setRandomTitle() {
  const titleTexts = [
    "(WORK IN PROGRESS)",
    "(How's your day?)",
    "(HELLO! GOODBYE!)",
    "(What's for dinner?)"
  ];
  
  // Get random index
  const randomIndex = Math.floor(Math.random() * titleTexts.length);
  
  // Update the H1 text
  const h1Element = document.querySelector('h1');
  if (h1Element) {
    h1Element.textContent = titleTexts[randomIndex];
    
    // Redraw tape overlay after text change with a small delay to ensure text is rendered
    setTimeout(() => {
      if (window.redrawTape) {
        window.redrawTape();
      }
    }, 50);
  }
}

// Set random title when page loads
document.addEventListener('DOMContentLoaded', setRandomTitle);

// PNG sequence animation
function startPngSequence() {
  const sequenceImage = document.getElementById('lumber-sequence');
  let currentFrame = 0;
  const totalFrames = 75; // 000.png to 077.png
  const frameRate = 24; // frames per second
  const frameDuration = 1000 / frameRate; // milliseconds per frame

  function updateFrame() {
    // Format frame number with leading zeros (000, 001, 002, etc.)
    const frameNumber = currentFrame.toString().padStart(3, '0');
    sequenceImage.src = `assets/lumber/${frameNumber}.png`;
    
    // Move to next frame
    currentFrame = (currentFrame + 1) % totalFrames;
  }

  // Start the animation
  setInterval(updateFrame, frameDuration);
}

// Start the PNG sequence animation when DOM is loaded
document.addEventListener('DOMContentLoaded', startPngSequence);

// Paint brush effect
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');
  const tapeCanvas = document.getElementById('tapeCanvas');
  const tapeCtx = tapeCanvas.getContext('2d');
  let painting = false;
  let paintStrokes = [];
  let lastX = 0;
  let lastY = 0;
  let currentStrokeId = 0;

  // Set canvas size
  function resizeCanvas() {
    // Use document dimensions to avoid mobile viewport issues
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    canvas.width = width;
    canvas.height = height;
    tapeCanvas.width = width;
    tapeCanvas.height = height;
    
    // Use requestAnimationFrame to ensure proper rendering timing
    requestAnimationFrame(() => {
      drawTape();
    });
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Handle mobile orientation changes
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      resizeCanvas();
    }, 300); // Delay to allow orientation change to complete
  });

  // Draw the tape overlay over the H1 text
  function drawTape() {
    // Clear the entire tape canvas first
    tapeCtx.clearRect(0, 0, tapeCanvas.width, tapeCanvas.height);
    
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      const rect = titleElement.getBoundingClientRect();
      
      // Get scroll position to account for any scrolling
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate tape dimensions with mobile-friendly padding
      const isMobile = window.innerWidth <= 768;
      const padding = isMobile ? 15 : 20;
      const extraHeight = isMobile ? 8 : 10;
      
      // Ensure tape doesn't go outside screen bounds
      const tapeLeft = Math.max(0, rect.left + scrollX - padding);
      const tapeTop = Math.max(0, rect.top + scrollY - 5);
      const tapeWidth = Math.min(rect.width + (padding * 2), tapeCanvas.width - tapeLeft);
      const tapeHeight = rect.height + extraHeight;
      
      tapeCtx.fillStyle = '#ffcc00';
      tapeCtx.fillRect(tapeLeft, tapeTop, tapeWidth, tapeHeight);
    }
  }
  
  // Expose drawTape function globally so it can be called when text changes
  window.redrawTape = drawTape;

  // Check if coordinates are over the tape area
  function isOverTape(x, y) {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      const rect = titleElement.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      const isMobile = window.innerWidth <= 768;
      const padding = isMobile ? 15 : 20;
      
      // Convert canvas coordinates to page coordinates
      const pageX = x - scrollX;
      const pageY = y - scrollY;
      
      return pageX >= rect.left - padding && pageX <= rect.right + padding && 
             pageY >= rect.top - 5 && pageY <= rect.bottom + 5;
    }
    return false;
  }

  // Mouse/touch events
  function startPainting(e) {
    painting = true;
    canvas.style.pointerEvents = 'all';
    
    const rect = canvas.getBoundingClientRect();
    lastX = (e.clientX || e.touches[0].clientX) - rect.left;
    lastY = (e.clientY || e.touches[0].clientY) - rect.top;
    
    currentStrokeId = Date.now(); // Unique ID for this stroke session
    paint(e);
  }

  function stopPainting() {
    if (painting) {
      painting = false;
      canvas.style.pointerEvents = 'none';
    }
  }

  function paint(e) {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    // Calculate distance to determine how many points to interpolate
    const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
    const steps = Math.max(1, Math.floor(distance / 2)); // Interpolate every 2 pixels

    // Create smooth continuous stroke by interpolating between points
    for (let i = 0; i <= steps; i++) {
      const interpolatedX = lastX + (x - lastX) * (i / steps);
      const interpolatedY = lastY + (y - lastY) * (i / steps);

      // Check if painting over tape area
      const paintX = interpolatedX;
      const paintY = interpolatedY;
      
      if (isOverTape(paintX, paintY)) {
        // Erase tape to reveal text (permanent)
        tapeCtx.globalCompositeOperation = 'destination-out';
        tapeCtx.fillStyle = 'rgba(0, 0, 0, 1)';
        tapeCtx.fillRect(paintX - 10, paintY - 3, 20, 6);
      } else {
        // Draw normal paint stroke (temporary)
        const stroke = {
          x: interpolatedX,
          y: interpolatedY,
          timestamp: Date.now(),
          strokeId: currentStrokeId
        };
        
        paintStrokes.push(stroke);
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(interpolatedX - 10, interpolatedY - 3, 20, 6); // 20px width, 6px height (horizontal)

        // Set timer to remove this stroke after 3 seconds
        setTimeout(() => {
          removePaintStroke(stroke);
        }, 3000);
      }
    }

    // Update last position
    lastX = x;
    lastY = y;
  }

  function removePaintStroke(strokeToRemove) {
    paintStrokes = paintStrokes.filter(stroke => stroke !== strokeToRemove);
    redrawCanvas();
  }

  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintStrokes.forEach(stroke => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(stroke.x - 10, stroke.y - 3, 20, 6); // Always horizontal
    });
  }

  // Mouse events
  document.addEventListener('mousedown', startPainting);
  document.addEventListener('mouseup', stopPainting);
  document.addEventListener('mousemove', paint);

  // Touch events for mobile
  document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    startPainting(e);
  });
  document.addEventListener('touchend', function(e) {
    e.preventDefault();
    stopPainting();
  });
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    paint(e);
  });
});
