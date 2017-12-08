(function() {
  if (location.href.indexOf('mousehuntgame.com') < 0) {
    alert('You are not on mousehuntgame.com! Please try again.');
    return;
  }
  if (document.querySelector('div.treasureMapPopupContainer.hasMap') == null) {
    alert("Please navigate to 'Active Map'!");
    return;
  }

  var mice = $('.treasureMapPopup-mice-group-mouse:not(.caught)')
    .map(function() {
      return $(this).data('name');
    })
    .toArray();
  var url = 'https://tsitu.github.io/MH-Tools/map.html';
  url += '?mice=' + encodeURIComponent(mice.join('/'));

  var newWindow = window.open('', 'mhmapsolver');
  newWindow.location = url;
})();
