let session = {};

$(document).ready(function() {

  // init
  $.get('/session', sess => {
    session = sess;
    $('#setting-name').val(session.user.name);

    $.get(`/store?seller_id=${session.user.seller_id}`, stores => {
      
      
    });
  });


  // update user pass
  $('#setting-apply').on('click', () => {
    const name = $('#setting-name').val();
    const pass = $('#setting-passwd').val();

    if (!name || !pass) {
      alert('Input name, pass')
      return;
    }

    $.ajax({
      url: `/seller/${session.user.seller_id}`,
      type: 'PUT',
      data: {
        name: $('#setting-name').val(),
        passwd: $('#setting-passwd').val()
      },
      success: data => {
        alert('Name, pass updated!');
      }
    });
  });
});
