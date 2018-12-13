let session = {};
let map;
const markers = [];
const stores = {};

function createPayment(payment) {
  $('#list-payments').append($(`
    <li class="list-group-item list-group-item-action list-payment">
      <span>${payment.type}</span>
      <span>${payment.data.card_num || ''}${payment.data.acc_num || ''}</span>
    </li>`));

  $('#storeModal #store-pay').append($(`
    <option value="${payment.type}-${payment.data.card_num || ''}${payment.data.acc_num || ''}">${payment.type}-${payment.data.card_num || ''}${payment.data.acc_num || ''}</option>`));
}

function createStore(store) {
  const element = $(`
    <li class="list-group-item list-group-item-action list-store" data-store-id="${store.store_id}">
      <p>name: ${store.sname}</p>
      <p>addr: ${store.address}</p>
      <p>${store.phone_nums.map(phone => `<button class="btn btn-outline-secondary disabled">${phone}</button>`).join('')}</p>
      <small>${JSON.stringify(store.schedules)}</small>
    </li>`);

  $.get(`/menu?store_id=${store.store_id}`, menus => {
    store.menus = menus;
  });

  stores[store.store_id] = store;

  element.on('click', function() {
    $('#storeModal .list-menus').empty();
    $('#storeModal .list-menus').data('store-id', $(this).data('store-id'));
    stores[$(this).data('store-id')].menus.forEach(menu => {
      const e = $(`
        <li class="list-group-item list-group-item-action list-menu" data-menu-id="${menu.menu_id}">
          <span>${menu.name}</span>
          <small>${menu.price}</small>
        </li>`);
      e.on('click', function() {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
        } else {
          $(this).addClass('active'); 
        }
      });
      $('#storeModal .list-menus').append(e);
    });

    $('#storeModal').modal('show');
  });

  $('#list-stores').append(element);
}

function createOrder(order) {
  $.get(`/destination?destination_id=${order.destination_id}`, destinations => {
    $.get(`/store?store_id=${order.store_id}`, stores => {
      $.get(`/menu?store_id=${order.store_id}`, menus => {
        const omenu = new Set(order.menus.split(',').map(m => parseInt(m, 10)));
        const element = $(`
          <li class="list-group-item list-group-item-action list-order" data-order-id="${order.order_id}">
            <span>${stores[0].sname}</span>
            <small>${menus.filter(m => omenu.has(m.menu_id)).map(m => m.name).join(', ')}</small>
            <p>${destinations[0].lat}, ${destinations[0].lng}</p>
            <small>${order.payment}</small><br>
            <small>${order.createdAt}</small>
          </li>`);

        if (order.done === 0) {
          element.addClass('disabled');
        } else if (order.done === 10) {
          element.addClass('disabled');
          element.append('<strike><small>취소됨<small></strike>');
        } else if (order.done === 100) {
          element.addClass('active');
          element.append('<small>확인됨</small>');

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
        } else if (order.done == 999) {
          element.append('<small>배달 완료됨</small>');
        }

        $('#list-orders').append(element);
      });
    });
  });
}

function createDest(dest) {
  const element = $(`
    <li class="list-group-item list-group-item-action list-destination" data-dest-id="${dest.destination_id}">
      <p>${dest.lat}, ${dest.lng}</p>
      <button type="button" class="btn btn-sm btn-outline-warning mb-2 btn-mod" data-dest-id="${dest.destination_id}">변경</button>
      <button type="button" class="btn btn-sm btn-outline-danger mb-2 btn-cls" data-dest-id="${dest.destination_id}">삭제</button>
    </li>`);

  $('#storeModal #store-dest').append($(`
    <option value="${dest.destination_id}">${dest.lat},${dest.lng}</option>`));

  element.find('.btn-mod').on('click', function() {
    const [lat, lng] = prompt(`Input [lat,lng] (${$(this).parent().find('p').text()})`).split(',');
    $.ajax({
      url: `/destination/${dest.destination_id}`,
      type: 'PUT',
      data: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      success: data => {
        alert('destination updated!');
      },
    });
  });

  element.find('.btn-cls').on('click', function() {
    $.ajax({
      url: `/destination/${dest.destination_id}`,
      type: 'DELETE',
      success: data => {
        alert('destination deleted!');
      },
    });
  });

  $('#list-destinations').append(element);
}

function getCoords() {
  return new Promise((res, rej) => (
    navigator.geolocation.getCurrentPosition(pos => res({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    }))
  ));
}

function initMap() {
  return new Promise((res, rej) => {
    if (map) {
      res(map);
    } else {
      getCoords().then(coords => {
        if (map) {
          res(map);
        } else {
          $('#position').append(`<span>${coords.lat}</span>,`);
          $('#position').append(`<span>${coords.lng}</span>`);

          map = new google.maps.Map(document.getElementById('map'), {
            center: coords,
            zoom: 17,
          });

          markers.push(new google.maps.Marker({
            position: coords,
            map: map,
            title: "Now",
          }));

          res(map);
        }
      });
    }
  });
}

function addMarker(coords, title) {
  initMap().then(m => (
    markers.push(new google.maps.Marker({
      position: coords,
      map: m,
      title: title,
    }))
  ))
}

$(document).ready(function() {
  // init
  $.get('/session', sess => {
    session = sess;
    $('#setting-name').val(session.user.name);

    $('#list-stores').empty();
    $('#list-orders').empty();
    $('#list-destinations').empty();
    $('#list-payments').empty();

    session.user.payments.forEach(createPayment);
    $.get(`/order?customer_id=${session.user.customer_id}`, orders => orders.forEach(createOrder));
    
    $.get(`/destination?customer_id=${session.user.customer_id}`, destinations => destinations.forEach(createDest));

    $.get(`/store`, stores => {
      session.stores = stores;
      session.stores.forEach((store, i) => {
        createStore(store);
        addMarker({
          lat: parseFloat(store.lat),
          lng: parseFloat(store.lng),
        }, store.sname);
      });
    });
  });

  $('#store-apply').on('click', () => {
    const store_id = $('#storeModal .list-menus').data('store-id');
    const customer_id = session.user.customer_id;
    const destination_id = parseInt($('#storeModal #store-dest').val(), 10);
    const payment = $('#storeModal #store-pay').val();
    const menus = $('#storeModal .list-menus').children().filter(function() {
      return $(this).hasClass('active');
    }).map(function() {
      return $(this).data('menu-id');
    }).get();

    if (!payment) {
      alert('결제 수단을 선택하세요.');
      return;
    }

    $.ajax({
      url: `/order`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        store_id: store_id,
        customer_id: customer_id,
        destination_id: destination_id,
        menus: menus.join(','),
        payment: payment,
      }),
      success: data => {
        alert('order added!');
        $('#storeModal').modal('hide');
      }
    });
  });

  $('#destination-apply').on('click', () => {
    $.ajax({
      url: `/destination`,
      type: 'POST',
      data: {
        customer_id: session.user.customer_id,
        lat: parseFloat($('#destination-lat').val()),
        lng: parseFloat($('#destination-lng').val()),
      },
      success: data => {
        alert('destination added!');
        $('#destinationModal').modal('hide');
      }
    });
  });

  $('.payment-mod').on('click', () => {
    $('#payment-values').val(JSON.stringify(session.user.payments));
  });
  $('#payment-apply').on('click', () => {
    $.ajax({
      url: `/customer/${session.user.customer_id}/payment`,
      type: 'PUT',
      contentType: 'application/json',
      data: {
        payments: JSON.parse($('#payment-values').val()),
      },
      success: data => {
        alert('payments updated!');
        $('#paymentModal').modal('hide');
      }
    });
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
      url: `/customer/${session.user.customer_id}`,
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
