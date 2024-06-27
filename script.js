function copyEmail() {
    var emailAddress = "waihonglim@icloud.com";
    navigator.clipboard.writeText(emailAddress).then(function() {
        showToast();
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

function showToast() {
    var toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function updateClock() {
    var now = new Date();
    var options = { timeZone: 'Asia/Kuala_Lumpur', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var timeString = now.toLocaleTimeString('en-US', options);
    document.getElementById('clock').textContent = timeString + ' GMT+8';
}

// Custom cursor functionality
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .project-image, .text-btn');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
});

updateClock();
setInterval(updateClock, 1000);
