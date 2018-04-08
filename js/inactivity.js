document.addEventListener("DOMContentLoaded", function(event) {

  document.getElementsByClassName('inactivity')[0].addEventListener('click', function() {
    window.location.replace('./index.html');
  });

  document.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      document.getElementsByClassName('inactivity')[0].click();
    };
  });

});
