let session = {};

function createOrder(order) {
  $.get(`/destination?destination_id=${order.destination_id}`, destinations => {
    $.get(`/store?store_id=${order.store_id}`, stores => {
      $.get(`/menu?store_id=${order.store_id}`, menus => {
        const omenu = new Set(order.menus.split(',').map(m => parseInt(m, 10)));
        const element = $(`
          <li class="list-group-item list-group-item-action list-order" data-order-id="${order.order_id}" data-dest-id="${order.destination_id}">
            <span>${stores[0].sname}</span>
            <small>${menus.filter(m => omenu.has(m.menu_id)).map(m => m.name).join(', ')}</small>
            <p>${destinations[0].lat}, ${destinations[0].lng}</p>
            <small>${order.createdAt}</small>
            <button type="button" class="btn bg-white btn-sm btn-outline-secondary btn-cls">취소</button>
            <button type="button" class="btn bg-white btn-sm btn-outline-primary btn-cnf">확인</button>
          </li>`);

        if (order.done === 0) {
          element.addClass('active');
        } else if (order.done === 10) {
          element.addClass('disabled');
          element.find('button').detach();
          element.append('<strike><small>취소됨<small></strike>');
        } else if (order.done === 100) {
          element.find('button').detach();
          element.append('<small>확인됨</small>');
        } else if (order.done === 999) {
          element.find('button').detach();
          element.append('<small>완료됨</small>');
        }

        element.find('button.btn-cls').on('click', function() {
          $.ajax({
            url: `/order/${$(this).parent().data('order-id')}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
              done: 10,
            }),
            success: data => {
              alert('주문이 취소되었습니다.');
            }
          });
        });
        element.find('button.btn-cnf').on('click', function() {
          $.get('/delivery', deliveries => {
            $.get(`/destination?destination_id=${$(this).parent().data('dest-id')}`, destinations => {
              const [lat, lng] = [destinations[0].lat, destinations[0].lng];
              const dist = delivery => Math.pow(delivery.lat-lat, 2) + Math.pow(delivery.lng-lng, 2);

              $('#orderModal #order-delivery').data('order-id', $(this).parent().data('order-id'));
              deliveries.sort((l, r) => dist(l) - dist(r)).slice(0, 5).forEach(delivery => {
                $('#order-delivery').append($(`<option value="${delivery.delivery_id}">${delivery.name}-${delivery.stack}<small>(${delivery.lat},${delivery.lng})</small></option>`));
              });

              $('#orderModal').modal('show');  
            });
          });
        });

        $('#list-orders').append(element);
      });
    });
  });
}

function createMenu(menu) {
  const element = $(`
    <li class="list-group-item list-group-item-action list-menu" data-menu-id="${menu.menu_id}">
      <span>${menu.name}</span>
      <small>${menu.price}</small>
      <button type="button" class="btn btn-sm btn-outline-warning mb-2 btn-mod">변경</button>
      <button type="button" class="btn btn-sm btn-outline-danger mb-2 btn-del">삭제</button>
    </li>`);

  element.find('button.btn-mod').on('click', function() {
    $('#menuModal').data('store-id', 0);
    $('#menuModal').data('menu-id', $(this).parent().data('menu-id'));
    $('#menu-name').val($(this).parent().find('span').text());
    $('#menu-price').val($(this).parent().find('small').text());
    $('#menuModal').modal('show');
  });

  element.find('button.btn-del').on('click', function() {
    if (confirm('이 메뉴를 삭제하시겠습니까?')) {
      const menu_id = $(this).parent().data('menu-id');
      $.ajax({
        url: `/menu/${menu_id}`,
        type: 'DELETE',
        success: data => {
          alert('Menu deleted!');
        }
      });
    }
  });

  return element;
}

function createStore(store) {
  const element = $(`
    <li class="list-group-item list-group-item-action list-store">
      <span>${store.sname}</span>
      <small>${store.address}</small>
      <hr>
      ${store.tags.map(tag => `<span class="badge badge-primary badge-pill">${tag}</span>`).join('')}
      <p>${store.description}</p>
      <h5>Menus</h5>
      <button type="button" class="btn btn-outline-primary mb-2 btn-add" data-store-id="${store.store_id}">추가</button>
      <ul class="list-group list-menus" data-store-id="${store.store_id}">
      </ul>
    </li>`);

  element.find('button.btn-add').on('click', function() {
    $('#menuModal').data('store-id', $(this).data('store-id'));
    $('#menuModal').data('menu-id', 0);
    $('#menu-name').val('');
    $('#menu-price').val(0);
    $('#menuModal').modal('show');
  });

  $('#list-stores').append(element);
  $.get(`/menu?store_id=${store.store_id}`, menus => menus.map(createMenu).forEach(m => element.append(m)));
  $.get(`/order?store_id=${store.store_id}`, orders => orders.forEach(createOrder));
}

$(document).ready(function() {
  // init
  $.get('/session', sess => {
    session = sess;
    $('#setting-name').val(session.user.name);

    $('#list-stores').empty();
    $('#list-orders').empty();
    $.get(`/store?seller_id=${session.user.seller_id}`, stores => stores.forEach(createStore));
  });

  $('#order-apply').on('click', () => {
    $.ajax({
      url: `/order/${$('#orderModal #order-delivery').data('order-id')}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        done: 100,
        delivery_id: $('#orderModal #order-delivery').val(),
      }),
      success: data => {
        alert('주문이 확인되었습니다.');
        $('#orderModal').modal('hide');
      }
    });
  });

  $('#menu-apply').on('click', () => {
    const store_id = $('#menuModal').data('store-id');
    const menu_id = $('#menuModal').data('menu-id');
    const name = $('#menu-name').val();
    const price = $('#menu-price').val();

    if (!name || !price) {
      alert('가격과 이름을 설정해야합니다.');
      return;
    }

    if (store_id === 0 && menu_id) {
      $.ajax({
        url: `/menu/${menu_id}`,
        type: 'PUT',
        data: {
          name: name,
          price: price,
        },
        success: data => {
          alert('Menu updated!');
          $('#menuModal').modal('hide');
        }
      });
    } else if (menu_id === 0 && store_id) {
      $.ajax({
        url: `/menu`,
        type: 'POST',
        data: {
          name: name,
          price: price,
          store_id: store_id,
        },
        success: data => {
          alert('Menu created!');
          $('#menuModal').modal('hide');
        }
      });
    }
  });

  // update user pass
  $('#setting-apply').on('click', () => {
    const name = $('#setting-name').val();
    const pass = $('#setting-passwd').val();

    if (!name || !pass) {
      alert('Input name, pass');
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
        $('#settingModal').modal('hide');
      }
    });
  });
});
