let cart = [];
let total = 0;

// ========== CARRITO ==========

function openCart() {
  document.getElementById("cart").classList.add("active");
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById("cart").classList.remove("active");
  document.body.style.overflow = 'auto';
}

function addToCart(name, price, image) {
  // Buscar si el producto ya existe en el carrito
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1
    });
  }

  total += price;
  renderCart();
  
  // Abrir carrito automáticamente
  openCart();
  
  // Efecto visual
  showNotification(`${name} agregado al carrito`);
}

function removeFromCart(index, event) {
  // Prevenir que el evento se propague y cierre el carrito
  event.stopPropagation();
  
  total -= cart[index].price * cart[index].quantity;
  cart.splice(index, 1);
  renderCart();
  showNotification('Producto eliminado del carrito');
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 20px;">Tu carrito está vacío</p>';
  } else {
    cart.forEach((item, index) => {
      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-info">
            <h4>${item.name}</h4>
            <p>$${item.price} x ${item.quantity}</p>
            <small>Subtotal: $${item.price * item.quantity}</small>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index}, event)">✕</button>
        </div>
      `;
    });
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0; // Envío gratis si hay compra
  const totalAmount = subtotal + shipping;

  document.getElementById("subtotal").innerText = `$${subtotal}`;
  document.getElementById("shipping").innerText = `$${shipping}`;
  document.getElementById("total").innerText = totalAmount;
  document.getElementById("cart-count").innerText = cart.length;
}

function sendWhatsApp() {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let message = "*PEDIDO ICEE SHOT*%0A%0A";

  cart.forEach(item => {
    message += `${item.name}%0A`;
    message += `   Cantidad: ${item.quantity}%0A`;
    message += `   Precio unitario: $${item.price}%0A`;
    message += `   Subtotal: $${item.price * item.quantity}%0A%0A`;
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  message += `%0A*TOTAL:* $${subtotal}%0A%0A`;
  message += `*DATOS PARA DOMICILIO* %0A`;
  message += `Nombre: ________________%0A`;
  message += `Dirección: ________________%0A`;
  message += `Teléfono: ________________%0A`;
  message += `Método de pago: ________________%0A`;

  const phone = "573045810613";

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );
}

// ========== FILTRO PRODUCTOS ==========

function filterProducts(category) {
  // Actualizar botones activos
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Mostrar/ocultar productos
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    if (category === 'todos') {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.6s ease-out';
    } else {
      if (card.getAttribute('data-category') === category) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.6s ease-out';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// ========== NOTIFICACIÓN ==========

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #00e5ff, #00b8d4);
    color: black;
    padding: 16px 24px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 10000;
    animation: slideInRight 0.4s ease-out;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
  `;
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease-out';
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  
  // Cerrar carrito al hacer clic fuera
  document.addEventListener('click', (e) => {
    const cart = document.getElementById('cart');
    const cartToggle = document.querySelector('.cart-toggle');
    
    if (cart.classList.contains('active') && !cart.contains(e.target) && !cartToggle.contains(e.target)) {
      closeCart();
    }
  });
});