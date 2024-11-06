const movingCursor = document.getElementById('movingCursor');
const enterSVGElement = document.querySelector('#input-field-container svg');

document.addEventListener('mousemove', (event) => {
const x = event.pageX;
const y = event.pageY;
movingCursor.style.left = `${x - 25}px`;
movingCursor.style.top = `${y - 25}px`;
const hoveredElements = document.querySelectorAll(':hover');
if (hoveredElements.length==5 || hoveredElements.length==6) {
    if(hoveredElements[4].tagName.toLowerCase() === 'svg'){
    movingCursor.classList.add('stop');
    }
}
else{
    if(movingCursor.classList.contains('stop')){
        movingCursor.classList.remove('stop');

    }
}   
});

