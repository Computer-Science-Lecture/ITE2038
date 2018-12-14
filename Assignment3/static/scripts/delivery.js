let session = {};
function createOrder(order) {
  $.get(`/destination?destination_id=${order.destination_id}`, destinations => {
    $.get(`/store?store_id=${order.store_id}`, stores => {
      $.get(`/menu?store_id=${order.store_id}`, menus => {
        $.get(`/customer?customer_id=${order.customer_id}`, customers => {
          const omenu = JSON.parse(order.menus);
          const element = $(`
            <li class="list-group-item list-group-item-action list-order" data-order-id="${order.order_id}">
              <span>${stores[0].sname}</span>
              <small>${menus.filter(m => Object.keys(omenu).indexOf(m.menu_id.toString()) !== -1).map(m => `${m.name}(${omenu[m.menu_id]})`).join(', ')}</small>
              <p>${destinations[0].lat}, ${destinations[0].lng}</p>
              <small>${customers[0].name}</small>
              <small>${customers[0].phone}</small><br>
              <small>${order.payment}</small><br>
              <small>${order.createdAt}</small>
            </li>`);

          if (order.done === 0) {
            element.addClass('list-group-item-secondary');
            element.append('<small>준비중</small>');
          } else if (order.done === 10) {
            element.addClass('list-group-item-danger');
            element.append('<strike><small>취소됨<small></strike>');
          } else if (order.done === 100) {
            $.get(`/delivery?delivery_id=${order.delivery_id}`, deliveries => {
              element.addClass('list-group-item-warning');
              element.append(`<small>${deliveries[0].name}님이 배달중</small>`);

              element.on('click', function() {
                if (confirm("주문을 완료하시겠습니까?")) {
                  $.ajax({
                    url: `/order/${$(this).data('order-id')}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      done: 999,
                      delivery_id: 0,
                    }),
                    success: data => {
                      alert('배달이 완료되었습니다.');
                    }
                  });
                }
              });
            });
          } else if (order.done == 999) {
            element.addClass('list-group-item-info');
            element.append('<small>배달 완료됨</small>');
          }

          $('#list-orders').append(element);
        });
      });
    });
  });
}

$(document).ready(function() {
  // init
  $.get('/session', sess => {
    session = sess;

    $('#list-orders').empty();

    $.get(`/order?delivery_id=${session.user.delivery_id}`, orders => orders.forEach(createOrder));
  });
});
