let session = {};
let map;
let markers = [];
const stores = {};

function updateCurrent(lat = 0, lng = 0) {
  const dist = (lt, lg) => Math.pow(lat-lt,2)+Math.pow(lng-lg,2);

  markers.forEach(marker => marker.setMap(null));
  markers = [];

  $('#list-stores').empty();
  session.stores
    .sort((l, r) => dist(l.lat, l.lng)-dist(r.lat, r.lng))
    .forEach(store => {
      createStore(store);
      addMarker({
        lat: parseFloat(store.lat),
        lng: parseFloat(store.lng),
      }, store.sname);
    });
}

function updatePayment(update=false) {
  if (update) {
    $.ajax({
      url: `/customer/${session.user.customer_id}/payment`,
      type: 'PUT',
      data: {
        payments: session.user.payments,
      },
      success: data => {
        alert('payments updated!');
      }
    });
  }
  $('#list-payments').empty();
  session.user.payments.forEach(createPayment);
}

function createPayment(payment, i) {
  const element = $(`
    <li class="list-group-item list-group-item-action list-payment" data-payment-id="${i}">
      <span>${payment.type}</span>
      <span>${payment.data.card_num || ''}${payment.data.acc_num || ''}</span>
      <button type="button" class="btn btn-sm btn-outline-warning mb-2 btn-mod">변경</button>
      <button type="button" class="btn btn-sm btn-outline-danger mb-2 btn-del">삭제</button>
    </li>`);

  element.find('.btn-mod').on('click', function() {
    const payment_id = $(this).parent().data('payment-id');
    $('#paymentModal').data('payment-id', payment_id);
    $('#payment-type').val(session.user.payments[payment_id].type);

    $('.payment-div').prop('hidden', true);
    $(`#payment-${session.user.payments[payment_id].type}`).prop('hidden', false);

    if (session.user.payments[payment_id].type === 'account') {
      $('#payment-bank').val(session.user.payments[payment_id].data.bid);
      $('#payment-acc').val(session.user.payments[payment_id].data.acc_num);
    } else if (session.user.payments[payment_id].type === 'card') {
      $('#payment-cc').val(session.user.payments[payment_id].data.card_num);
    }
    $('#paymentModal').modal('show');
  });

  element.find('.btn-del').on('click', function() {
    if (confirm('정말 결제정보를 지우시겠습니까?')) {
      const payment_id = $(this).parent().data('payment-id');
      session.user.payments.splice(payment_id, 1);
      updatePayment(true);
    }
  });

  $('#list-payments').append(element);

  $('#storeModal #store-pay').append($(`
    <option value="${payment.type}-${payment.data.card_num || ''}${payment.data.acc_num || ''}">${payment.type}-${payment.data.card_num || ''}${payment.data.acc_num || ''}</option>`));
}

function createStore(store) {
  const day = {0: '월', 1: '화', 2: '수', 3: '목', 4: '금', 5: '토', 6: '일'};
  const element = $(`
    <li class="list-group-item list-group-item-action list-store" data-store-id="${store.store_id}">
      <p class="s-name">${store.sname}</p>
      <p class="s-addr">${store.address}</p>
      ${store.tags.map(tag => `<span class="badge badge-primary badge-pill">${tag}</span>`).join('')}
      <p>${store.description}</p>
      <p>${store.phone_nums.map(phone => `<button class="btn btn-outline-secondary disabled">${phone}</button>`).join('')}</p>
      <div class="btn-group mr-2 schedules" role="group">
        ${store.schedules.map(schedule => `<button type="button" class="btn btn-sm disabled btn-${schedule.holiday?'secondary':'primary'}">${day[schedule.day]}<small>${schedule.open||''}-${schedule.closed||''}</small></button>`).join('')}
      </div>
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
        <li class="list-group-item list-group-item-action list-menu" data-menu-id="${menu.menu_id}" data-count="0">
          <span class="badge badge-primary badge-pill">0</span>
          <span>${menu.name}</span>
          <small>${menu.price}</small>
        </li>`);
      e.on('click', function() {
        $(this).data('count', $(this).data('count') + 1);
        $(this).find('.badge').text($(this).data('count'));
        if ($(this).data('count')) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
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
        const omenu = JSON.parse(order.menus);
        const element = $(`
          <li class="list-group-item list-group-item-action list-order" data-order-id="${order.order_id}">
            <span>${stores[0].sname}</span>
            <small>${menus.filter(m => Object.keys(omenu).indexOf(m.menu_id.toString()) !== -1).map(m => `${m.name}(${omenu[m.menu_id]})`).join(', ')}</small>
            <p>${destinations[0].lat}, ${destinations[0].lng}</p>
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
          $('#position').find('span').text(`${coords.lat},${coords.lng}`);

          map = new google.maps.Map(document.getElementById('map'), {
            center: coords,
            zoom: 17,
          });

          markers.push(new google.maps.Marker({
            position: coords,
            map: map,
            title: "Now",
          }));

          updateCurrent(coords.lat, coords.lng);

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

    $('#list-orders').empty();
    $('#list-destinations').empty();

    updatePayment();

    $.get(`/order?customer_id=${session.user.customer_id}`, orders => orders.forEach(createOrder));
    
    $.get(`/destination?customer_id=${session.user.customer_id}`, destinations => destinations.forEach(createDest));

    $.get(`/store`, stores => { 
      session.stores = stores;
      updateCurrent();
    });

    $.get('/bank', banks => {
      banks.map(bank => `<option value="${bank.bank_id}">${bank.name}</option>`).forEach(bank => $('select#payment-bank').append(bank));
    });
  });

  $('select#payment-type').on('change', function() {
    $('.payment-div').prop('hidden', true);
    $(`#payment-${$(this).val()}`).prop('hidden', false);
  });

  $('button.payment-add').on('click', () => {
    $('#paymentModal').data('payment-id', -1);
    $('#paymentModal').modal('show');
  });

  $('input#store-search').on('input', function() {
    const text = $(this).val();

    $('#list-stores').children().removeClass('d-none');
    $('#list-stores').children().each(function(i) {
      if (!$(this).find('.s-name').text().includes(text) &&
        !$(this).find('.s-addr').text().includes(text) &&
        !$(this).find('span.badge').text().includes(text)) {
        $(this).addClass('d-none');
      }
    });
  });

  $('#store-apply').on('click', () => {
    const store_id = $('#storeModal .list-menus').data('store-id');
    const customer_id = session.user.customer_id;
    const destination_id = parseInt($('#storeModal #store-dest').val(), 10);
    const payment = $('#storeModal #store-pay').val();
    const menus = {};

    $('#storeModal .list-menus').children().filter(function() {
      return $(this).hasClass('active');
    }).each(function() {
      menus[$(this).data('menu-id')] = parseInt($(this).data('count'), 10);
    });

    if (Object.keys(menus).length === 0) {
      alert('메뉴를 선택하세요.');
      return;
    }

    if (isNaN(destination_id)) {
      alert('목적지를 선택하세요.');
      return;
    }

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
        menus: JSON.stringify(menus),
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

  $('#payment-apply').on('click', () => {
    const payment_id = $('#paymentModal').data('payment-id');
    const type = $('#payment-type').val();
    let data;

    if (type === 'account') {
      data = {
        bid: $('#payment-bank').val(),
        acc_num: $('#payment-acc').val(),
      }
    } else if (type === 'card') {
      data = {
        card_num: $('#payment-cc').val(),
      }
    }

    if (payment_id === -1) {
      session.user.payments.push({
        type: type,
        data: data
      });
    } else {
      session.user.payments[payment_id] = {
        type: type,
        data: data
      };
    }
    $('#paymentModal').modal('hide');
    updatePayment(true);
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
