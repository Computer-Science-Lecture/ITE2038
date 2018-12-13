$(document).on('load', () => {
  $.get('/orders').success(() => {
    console.log('wtf');
  }).error(e => console.log(e));
});
