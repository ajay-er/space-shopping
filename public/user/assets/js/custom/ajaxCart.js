document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.addTocartButton');
  cartButtons.forEach((cartButton) => {
    cartButton.addEventListener('click', async (event) => {
      event.preventDefault();
      let quantity = 1;

      const productId = cartButton.getAttribute('data-product-id');
      const url = '/cart';
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          productId,
        }),
      });

      console.log(response);
      if (response.status === 200) {
        swal.fire("Good job!", "Product added to cart!", "success");
        
      } else if (response.status === 401 || response.status === 302) {
        window.location.href = response.headers.get('Location') || '/login';
      } else {
        alert('something wrong!');
      }
    });
  });

  

 
});
